import { inngest } from "../client";
import { createClient } from "@supabase/supabase-js";

// We use the standard supabase-js client here because this runs in a background job
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const parseResumeJob = inngest.createFunction(
  { 
    id: "parse-resume", // keeping the ID same to avoid breaking old inngest state
    name: "Extract Data Source",
    retries: 3,
    triggers: { event: "resume/parse" }
  },
  async ({ event, step }) => {
    const { resumeId, userId, filePath } = event.data;

    // 1. Mark status as processing
    await step.run("update-status-processing", async () => {
      await supabase
        .from("resumes")
        .update({ parse_status: "processing" })
        .eq("id", resumeId);
    });

    // 2. Fetch current candidate profile
    const currentProfile = await step.run("fetch-current-profile", async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data;
    });

    // 3. Download file from Supabase Storage
    const fileBase64 = await step.run("download-file", async () => {
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(filePath);

      if (error || !data) {
        throw new Error("Failed to download file from storage");
      }

      return Buffer.from(await data.arrayBuffer()).toString("base64");
    });

    const ext = filePath.split('.').pop()?.toLowerCase();
    let mimeType = "application/pdf";
    if (ext === "docx" || ext === "doc") {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (ext === "xlsx") {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (ext === "xls") {
      mimeType = "application/vnd.ms-excel";
    }

    // 4. If Excel, extract text natively first
    const extractedText = await step.run("extract-text-if-excel", async () => {
      if (ext === "xlsx" || ext === "xls") {
        const xlsx = await import("xlsx");
        const workbook = xlsx.read(Buffer.from(fileBase64, "base64"));
        // Extract all sheets
        let allText = "";
        for (const sheetName of workbook.SheetNames) {
           const sheet = workbook.Sheets[sheetName];
           allText += `\n--- Sheet: ${sheetName} ---\n`;
           allText += xlsx.utils.sheet_to_csv(sheet);
        }
        return allText;
      }
      return null;
    });

    // 5. Send to Google Gemini for Data Enrichment
    const enrichedData = await step.run("analyze-and-merge", async () => {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = `
        You are an expert AI Profile Data Extractor. 
        Your goal is to build a rich "Candidate Memory" from the attached data source (CV, Portfolio, or previously filled HR forms).
        
        Here is the candidate's CURRENT profile memory (JSON):
        ${JSON.stringify(currentProfile, null, 2)}
        
        ${extractedText ? `\n\nAttached Data Source Content (CSV):\n${extractedText}` : ""}
        
        Instructions:
        1. Extract all relevant candidate information (personal details, work history, random questionnaire answers like 'salary expectation', 'emergency contact', 'technical stack', etc).
        2. MERGE this extracted information with the CURRENT profile memory.
        3. You MAY overwrite existing fields if the attached document contains newer, more accurate, or more detailed information.
        4. Accumulate as much knowledge as possible about the candidate in the "profile_data_json" object. Use descriptive keys (e.g., "emergency_contact", "education_history", "skills", "salary_history").
        5. Return the full merged JSON object representing the UPDATED candidate profile.
      `;

      const contents: any[] = [prompt];
      if (!extractedText) {
        contents.push({ inlineData: { data: fileBase64, mimeType } });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              full_name: { type: Type.STRING, nullable: true },
              email: { type: Type.STRING, nullable: true },
              job_title: { type: Type.STRING, nullable: true, description: "Their primary or most recent title" },
              years_experience: { type: Type.INTEGER, nullable: true, description: "Total years of experience" },
              professional_summary: { type: Type.STRING, nullable: true, description: "A brief 2-3 sentence summary" },
              profile_data_json: { 
                type: Type.OBJECT, 
                description: "A rich object containing arrays/objects of ALL other extracted details like skills, education, experience, specific HR form answers, etc.",
                additionalProperties: { type: Type.ANY }
              }
            }
          }
        }
      });

      const content = response.text;
      return JSON.parse(content || "{}");
    });

    // 6. Update database with merged results
    await step.run("save-results", async () => {
      // Update Resume/Data Source record
      await supabase
        .from("resumes")
        .update({
          parse_status: "completed",
          parsed_data_json: enrichedData,
        })
        .eq("id", resumeId);

      // Overwrite the user profile completely with the newly enriched data
      const updates = {
        full_name: enrichedData.full_name,
        email: enrichedData.email || currentProfile.email,
        job_title: enrichedData.job_title,
        professional_summary: enrichedData.professional_summary,
        years_experience: enrichedData.years_experience,
        profile_data_json: enrichedData.profile_data_json || {}
      };

      await supabase.from("profiles").update(updates).eq("id", userId);
    });

    return { success: true, data: enrichedData };
  }
);

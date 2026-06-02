import { inngest } from "../client";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI, Type } from "@google/genai";

// We use the standard supabase-js client here because this runs in a background job, not a Next.js request context
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// We will instantiate clients inside the function or inside step.run
// to avoid Next.js startup crashes if env variables are missing initially
export const parseResumeJob = inngest.createFunction(
  { 
    id: "parse-resume", 
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

    // 2. Download file from Supabase Storage
    const fileBuffer = await step.run("download-file", async () => {
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(filePath);

      if (error || !data) {
        throw new Error("Failed to download file from storage");
      }

      return Buffer.from(await data.arrayBuffer());
    });

    // 3. Send to Google Gemini for structured parsing directly (Gemini natively understands PDFs)
    const parsedData = await step.run("analyze-with-gemini", async () => {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = `
        You are an expert ATS (Applicant Tracking System) parser.
        Extract the following candidate information from the attached resume PDF document.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: fileBuffer.toString("base64"),
              mimeType: "application/pdf"
            }
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              full_name: { type: Type.STRING, nullable: true },
              email: { type: Type.STRING, nullable: true },
              job_title: { type: Type.STRING, nullable: true, description: "Their primary or most recent title" },
              years_experience: { type: Type.INTEGER, nullable: true, description: "Calculate total years if possible" },
              professional_summary: { type: Type.STRING, nullable: true, description: "A brief 2-3 sentence summary" },
              skills: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            }
          }
        }
      });

      const content = response.text;
      return JSON.parse(content || "{}");
    });

    // 4. Update database with results
    await step.run("save-results", async () => {
      // Update Resume record
      await supabase
        .from("resumes")
        .update({
          parse_status: "completed",
          parsed_data_json: parsedData,
        })
        .eq("id", resumeId);

      // Optionally, update the user profile with the new data if fields are empty
      // First fetch current profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        const updates: any = {};
        if (!profile.full_name && parsedData.full_name) updates.full_name = parsedData.full_name;
        if (!profile.job_title && parsedData.job_title) updates.job_title = parsedData.job_title;
        if (!profile.professional_summary && parsedData.professional_summary) updates.professional_summary = parsedData.professional_summary;
        if (!profile.years_experience && parsedData.years_experience) updates.years_experience = parsedData.years_experience;
        
        // Merge skills into profile_data_json
        const existingData = profile.profile_data_json || {};
        updates.profile_data_json = {
          ...existingData,
          skills: parsedData.skills || existingData.skills || []
        };

        if (Object.keys(updates).length > 0) {
          await supabase.from("profiles").update(updates).eq("id", userId);
        }
      }
    });

    return { success: true, data: parsedData };
  }
);

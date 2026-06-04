import { inngest } from "../client";
import { createClient } from "@supabase/supabase-js";

// Background Job for Form Autofill
export const autofillFormJob = inngest.createFunction(
  { 
    id: "autofill-form", 
    retries: 2,
    triggers: { event: "form/autofill" },
    onFailure: async ({ event, error }) => {
      // Mark as failed in DB if the job completely fails after retries
      const { formId } = event.data.event.data;
      if (formId) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        await supabase.from("recruiter_forms").update({ 
          analysis_status: "failed", 
          autofill_status: "failed",
          analysis_error: error.message 
        }).eq("id", formId);
      }
    }
  },
  async ({ event, step }) => {
    const { formId, userId, filePath } = event.data;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Mark analysis as processing
    await step.run("update-status-processing", async () => {
      await supabase
        .from("recruiter_forms")
        .update({ analysis_status: "processing", autofill_status: "processing" })
        .eq("id", formId);
    });

    // 2. Fetch the candidate's profile
    const profile = await step.run("fetch-candidate-profile", async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data;
    });

    // 3. Download the blank form file
    const fileBase64 = await step.run("download-form", async () => {
      const { data, error } = await supabase.storage
        .from("forms")
        .download(filePath);

      if (error || !data) {
        throw new Error("Failed to download form");
      }
      const buffer = Buffer.from(await data.arrayBuffer());
      return buffer.toString("base64");
    });

    // Determine MimeType
    const ext = filePath.split('.').pop()?.toLowerCase();
    let mimeType = "application/pdf";
    if (ext === "docx" || ext === "doc") {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (ext === "xlsx") {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (ext === "xls") {
      mimeType = "application/vnd.ms-excel";
    }

    // Prepare extracted text for Excel because Gemini doesn't support inlineData for Excel natively
    const extractedText = await step.run("extract-text-if-excel", async () => {
      if (ext === "xlsx" || ext === "xls") {
        const xlsx = await import("xlsx");
        const workbook = xlsx.read(Buffer.from(fileBase64, "base64"));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return xlsx.utils.sheet_to_csv(sheet);
      }
      return null;
    });

    // 4. Analyze Form Structure (No Answering yet)
    const analysisJson = await step.run("analyze-form-structure", async () => {
      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
        You are an expert AI form analyzer.
        Extract all questions and required fields from the attached form.
        ${extractedText ? `\n\nForm Content (Extracted CSV):\n${extractedText}` : ""}
      `;

      const contents: any[] = [prompt];
      // Only attach inlineData if it's not extracted as text (e.g., PDF)
      if (!extractedText) {
        contents.push({ inlineData: { data: fileBase64, mimeType } });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                type: { type: Type.STRING, description: "text, checkbox, or dropdown" }
              }
            }
          }
        }
      });
      
      return JSON.parse(response.text || "[]");
    });

    // Save Analysis Status
    await step.run("save-analysis-status", async () => {
      await supabase.from("recruiter_forms").update({ analysis_status: "completed", analysis_json: analysisJson }).eq("id", formId);
    });

    // 5. Intelligent Field Matching & Autofill
    const autofillJson = await step.run("intelligent-matching", async () => {
      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
        Candidate Profile:
        ${JSON.stringify(profile, null, 2)}
        
        Form Fields to fill:
        ${JSON.stringify(analysisJson, null, 2)}

        Answer each field using the candidate profile. If information is missing, infer professionally or leave blank.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                missing: { type: Type.BOOLEAN, description: "True if data was completely missing from profile" }
              }
            }
          }
        }
      });
      
      return JSON.parse(response.text || "[]");
    });

    // Save Autofill Status
    await step.run("save-autofill-status", async () => {
      const missingCount = autofillJson.filter((x: any) => x.missing).length;
      const percentage = Math.round(((autofillJson.length - missingCount) / (autofillJson.length || 1)) * 100);
      await supabase.from("recruiter_forms").update({ autofill_status: "completed", autofill_json: autofillJson, autofill_percentage: percentage }).eq("id", formId);
    });

    // 6. Generate Document (PDF and Excel supported)
    const completedPath = await step.run("generate-document", async () => {
      let savedBytes: Uint8Array | Buffer;
      let newPath = "";
      let contentType = "";

      if (mimeType === "application/pdf") {
        const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
        const pdfBytes = Buffer.from(fileBase64, "base64");
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Append a new page with the filled answers as a summary
        const page = pdfDoc.addPage();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let y = page.getHeight() - 50;
        
        page.drawText("Autofilled Application Summary", { x: 50, y, size: 20, font, color: rgb(0.2, 0.2, 0.8) });
        y -= 40;
        
        for (const item of autofillJson) {
          if (y < 50) {
             // pagination logic omitted for MVP
          }
          page.drawText(`Q: ${item.question}`, { x: 50, y, size: 12, font });
          y -= 20;
          page.drawText(`A: ${item.answer}`, { x: 50, y, size: 12, font, color: rgb(0.1, 0.5, 0.1) });
          y -= 30;
        }
        
        savedBytes = await pdfDoc.save();
        newPath = `${userId}/filled_${Date.now()}.pdf`;
        contentType = "application/pdf";
      } else if (ext === "xlsx" || ext === "xls") {
        const xlsx = await import("xlsx");
        const workbook = xlsx.read(Buffer.from(fileBase64, "base64"));
        
        // Create a new sheet for AI Answers
        const wsData = [
          ["Question", "AI Answer", "Missing Info?"]
        ];
        
        for (const item of autofillJson) {
          wsData.push([item.question, item.answer, item.missing ? "Yes" : "No"]);
        }
        
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(workbook, ws, "AI Answers Summary");
        
        savedBytes = xlsx.write(workbook, { type: "buffer", bookType: ext as any });
        newPath = `${userId}/filled_${Date.now()}.${ext}`;
        contentType = mimeType;
      } else {
        return null; // Skip document generation for unsupported types
      }
      
      await supabase.storage.from("forms").upload(newPath, savedBytes, { contentType });
      
      await supabase.from("recruiter_forms").update({ completed_form_path: newPath }).eq("id", formId);
      return newPath;
    });

    return { success: true, completedPath };
  }
);

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { inngest } from "@/inngest/client";

export async function uploadRecruiterForm(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  // Generate unique file path
  const originalName = (file as any).name || "form.pdf";
  const fileExt = originalName.split(".").pop() || "pdf";
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  // 1. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("forms")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Error:", uploadError);
    return { error: "Failed to upload form file: " + uploadError.message };
  }

  // 2. Create DB Record
  const { data: formRecord, error: dbError } = await supabase
    .from("recruiter_forms")
    .insert({
      user_id: user.id,
      file_name: originalName,
      file_path: filePath,
      file_type: file.type || fileExt,
      file_size: file.size,
    })
    .select()
    .single();

  if (dbError || !formRecord) {
    console.error("DB Error detailed:", JSON.stringify(dbError, null, 2));
    return { error: `Failed to save form record: ${dbError?.message || 'Unknown error'}` };
  }

  try {
    // 3. Trigger Inngest Background Job
    await inngest.send({
      name: "form/autofill",
      data: {
        formId: formRecord.id,
        userId: user.id,
        filePath: filePath,
      }
    });
  } catch (inngestError: any) {
    console.error("Inngest Error:", inngestError);
    return { error: "Failed to trigger background job: " + (inngestError.message || "Unknown error") };
  }

  revalidatePath("/dashboard/recruiter-forms");
  return { success: true, formId: formRecord.id };
}

export async function getFormsHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("recruiter_forms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getFormDetails(formId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recruiter_forms")
    .select("*")
    .eq("id", formId)
    .single();

  return data;
}

export async function getDownloadUrl(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("forms").createSignedUrl(path, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}

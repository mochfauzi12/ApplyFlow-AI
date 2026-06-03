import { getFormDetails, getDownloadUrl } from "@/app/actions/form";
import FormReviewClient from "./FormReviewClient";

export default async function FormReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const form = await getFormDetails(id);
  
  if (!form) {
    return <div className="p-8 text-center text-red-500">Form not found.</div>;
  }
  
  let downloadUrl = null;
  if (form.completed_form_path) {
    downloadUrl = await getDownloadUrl(form.completed_form_path);
  }

  return <FormReviewClient form={form} initialDownloadUrl={downloadUrl} />;
}

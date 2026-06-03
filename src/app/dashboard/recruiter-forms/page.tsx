"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadRecruiterForm, getFormsHistory } from "@/app/actions/form";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RecruiterFormsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const data = await getFormsHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Simple polling for MVP since we don't have Supabase Realtime setup yet
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (formData: FormData) => {
    try {
      const res = await uploadRecruiterForm(formData);
      if (res.success) {
        await fetchHistory();
        return { success: true };
      }
      return { error: "Upload failed without details." };
    } catch (e: any) {
      return { error: e.message || "Failed to upload form" };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Recruiter Forms</h1>
        <p className="text-text-secondary mt-2">
          Upload blank recruiter forms (PDF, DOCX, Excel) and let AI automatically answer them using your profile data.
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-light rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Upload New Form</h2>
        <FileUpload 
          onUpload={handleUpload} 
          accept=".pdf,.docx,.doc,.xls,.xlsx"
          maxSizeMB={5}
        />
      </div>

      <div className="bg-bg-secondary border border-border-light rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light bg-bg-tertiary">
          <h2 className="text-lg font-semibold text-text-primary">Form History</h2>
        </div>
        <div className="divide-y divide-border-light">
          {history.length === 0 ? (
            <div className="p-6 text-center text-text-secondary">
              No forms uploaded yet.
            </div>
          ) : (
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="flex flex-col"
            >
              {history.map((form) => (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  key={form.id} 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-bg-tertiary/50 transition-colors border-b border-border-light last:border-0"
                >
                  <div>
                    <h3 className="font-medium text-text-primary">{form.file_name}</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Uploaded on {new Date(form.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      form.autofill_status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : form.autofill_status === 'failed'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-primary/10 text-primary border-primary/20 animate-pulse'
                    }`}>
                      {form.autofill_status ? form.autofill_status.toUpperCase() : 'PENDING'}
                    </span>
                    
                    {form.autofill_status === 'completed' && (
                      <Link 
                        href={`/dashboard/recruiter-forms/${form.id}`}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm active:scale-95"
                      >
                        View Answers
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

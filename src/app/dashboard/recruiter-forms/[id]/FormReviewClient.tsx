"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, AlertTriangle } from "lucide-react";

export default function FormReviewClient({ form, initialDownloadUrl }: { form: any, initialDownloadUrl: string | null }) {
  const [answers, setAnswers] = useState<any[]>(form.autofill_json || []);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = answers.map(a => `${a.question}\n${a.answer}`).join("\n\n");
    navigator.clipboard.writeText(allText);
    alert("All answers copied to clipboard!");
  };

  const missingCount = answers.filter(a => a.missing).length;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/recruiter-forms" className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Autofill Results</h1>
            <p className="text-text-secondary text-sm">{form.file_name}</p>
          </div>
        </div>
        
        {initialDownloadUrl && (
          <a 
            href={initialDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Filled PDF
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-secondary border border-border-light rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Form Status</h3>
          <p className="text-lg font-semibold text-text-primary capitalize">{form.autofill_status}</p>
        </div>
        
        <div className="bg-bg-secondary border border-border-light rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Autofill Success</h3>
          <p className="text-lg font-semibold text-emerald-600">{form.autofill_percentage || 0}%</p>
        </div>
        
        <div className={`border rounded-xl p-6 shadow-sm ${missingCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-bg-secondary border-border-light'}`}>
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Missing Info</h3>
          <p className={`text-lg font-semibold ${missingCount > 0 ? 'text-amber-600' : 'text-text-primary'}`}>
            {missingCount} Field(s)
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-light rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light bg-bg-tertiary flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-primary">AI Extracted Answers</h2>
          <button 
            onClick={handleCopyAll}
            className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
          >
            Copy All
          </button>
        </div>

        <div className="divide-y divide-border-light">
          {answers.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No questions found or AI could not process the form.
            </div>
          ) : (
            answers.map((item, index) => (
              <div key={index} className={`p-6 space-y-3 transition-colors ${item.missing ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-bg-tertiary/30'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-text-primary">{item.question}</h3>
                    {item.missing && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Missing Info
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleCopy(item.answer, index)}
                    className="p-2 hover:bg-bg-tertiary rounded-lg text-text-secondary hover:text-text-primary transition-colors shrink-0"
                    title="Copy Answer"
                  >
                    {copiedIndex === index ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea 
                  className={`w-full bg-bg-tertiary border rounded-lg p-3 text-text-primary min-h-[100px] focus:ring-1 focus:ring-primary focus:outline-none ${item.missing ? 'border-amber-300' : 'border-border-light'}`}
                  defaultValue={item.answer}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index].answer = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  placeholder={item.missing ? "This information wasn't in your profile. Please fill it manually." : ""}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

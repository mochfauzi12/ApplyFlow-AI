'use client'

import { FileUpload } from '@/components/ui/file-upload'
import { uploadResume } from '@/app/actions/resume'
import { Card } from '@/components/ui/card'
import { FileText, Database } from 'lucide-react'
import { useState } from 'react'

export function ResumeUploaderCard() {
  const [showUpload, setShowUpload] = useState(false)

  if (showUpload) {
    return (
      <Card className="p-6 bg-bg-secondary/50">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg text-text-primary">Upload Data Source</h3>
          <button 
            onClick={() => setShowUpload(false)}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
        <FileUpload 
          onUpload={uploadResume} 
          accept=".pdf,.docx,.xlsx" 
          maxSizeMB={10} 
        />
      </Card>
    )
  }

  return (
    <Card 
      onClick={() => setShowUpload(true)}
      className="flex flex-col items-center justify-center p-8 text-center bg-indigo-500/5 border-2 border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm relative overflow-hidden h-full"
    >
      <div className="absolute top-4 left-4 bg-indigo-500/10 text-indigo-600 font-bold px-3 py-1 rounded-full text-xs tracking-wider">
        STEP 1: TRAIN AI
      </div>
      <div className="rounded-full bg-indigo-500/10 p-4 mb-4 group-hover:scale-110 transition-transform mt-4">
        <Database className="h-8 w-8 text-indigo-600" />
      </div>
      <h3 className="font-bold text-xl text-text-primary mb-2">Feed AI Knowledge Base</h3>
      <p className="text-sm text-text-secondary">Upload CVs or previously filled HR forms (PDF/Excel) here. The AI will learn and remember this data.</p>
    </Card>
  )
}

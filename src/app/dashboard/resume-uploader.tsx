'use client'

import { FileUpload } from '@/components/ui/file-upload'
import { uploadResume } from '@/app/actions/resume'
import { Card } from '@/components/ui/card'
import { FileText } from 'lucide-react'
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
      className="flex flex-col items-center justify-center p-8 text-center bg-bg-secondary/50 border-dashed border-2 border-border-light hover:border-primary/50 transition-colors cursor-pointer group"
    >
      <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:scale-110 transition-transform">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg text-text-primary">Add Data Source</h3>
      <p className="text-sm text-text-secondary mt-1">Upload CVs, previously filled HR forms (PDF/Excel), or portfolios to enrich your profile.</p>
    </Card>
  )
}

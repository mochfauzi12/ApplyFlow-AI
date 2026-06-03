'use client'

import { useState, useRef } from 'react'
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onUpload: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({ onUpload, accept = ".pdf,.docx", maxSizeMB = 5 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateFile = (selectedFile: File) => {
    setError(null)
    
    // Check size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return false
    }

    // Since we accept .pdf, .docx, .xls, .xlsx
    const ext = selectedFile.name.toLowerCase().split('.').pop()
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc' && ext !== 'xls' && ext !== 'xlsx') {
      setError('Invalid file type. Only PDF, DOCX, and Excel files are allowed.')
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleUploadSubmit = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await onUpload(formData)
      if (result.error) {
        setError(result.error)
      } else {
        // Success
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (err) {
      setError('An unexpected error occurred during upload.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/50 hover:bg-bg-secondary'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-text-secondary mt-1">
                PDF, DOCX, or Excel (Max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border-light rounded-xl p-4 bg-bg-secondary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded text-primary">
                <FileIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
                  {file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={() => setFile(null)}
                className="text-text-secondary hover:text-error transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleUploadSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Confirm Upload'
            )}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}
    </div>
  )
}

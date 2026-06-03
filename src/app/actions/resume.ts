'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadResume(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // File size validation (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { error: 'File size exceeds 10MB limit' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // 1. Upload to Supabase Storage
  const { error: uploadError, data } = await supabase.storage
    .from('resumes')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: 'Failed to upload file to storage' }
  }

  // 2. Save metadata to resumes table
  const { data: dbData, error: dbError } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: data.path,
      file_type: file.type,
      file_size: file.size,
      parse_status: 'pending'
    })
    .select('id')
    .single()

  if (dbError || !dbData) {
    console.error('DB Insert error:', dbError)
    return { error: 'Failed to save resume metadata' }
  }

  // Trigger Inngest job for AI parsing
  try {
    const { inngest } = await import('@/inngest/client')
    await inngest.send({
      name: 'resume/parse',
      data: {
        resumeId: dbData.id,
        userId: user.id,
        filePath: data.path
      }
    })
  } catch (err) {
    console.error('Failed to trigger background job', err)
  }

  revalidatePath('/dashboard')
  return { success: true }
}

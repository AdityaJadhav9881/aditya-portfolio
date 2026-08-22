import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BUCKET_NAME = 'media'

export async function uploadToSupabase(file: File, folder: string = 'uploads'): Promise<{ url: string; key: string }> {
  const ext = file.name.split('.').pop()
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, file, { contentType: file.type })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key)

  return { url: data.publicUrl, key }
}

export async function deleteFromSupabase(key: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([key])
  if (error) throw error
}

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

const BUCKET_NAME = 'media'

export async function uploadToSupabase(file: File, folder: string = 'uploads'): Promise<{ url: string; key: string }> {
  const ext = file.name.split('.').pop()
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const client = getSupabase()
  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(key, file, { contentType: file.type })

  if (error) throw error

  const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(key)

  return { url: data.publicUrl, key }
}

export async function deleteFromSupabase(key: string): Promise<void> {
  const client = getSupabase()
  const { error } = await client.storage.from(BUCKET_NAME).remove([key])
  if (error) throw error
}

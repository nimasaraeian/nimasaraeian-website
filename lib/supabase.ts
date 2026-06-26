import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Project = {
  id: string
  title: string
  description: string | null
  color: string
  owner_id: string
  created_at: string
}

export type Note = {
  id: string
  title: string
  content: string
  project_id: string
  author_id: string
  created_at: string
  updated_at: string
}

export type FileRecord = {
  id: string
  name: string
  size: number
  mime_type: string
  storage_path: string
  project_id: string
  uploader_id: string
  created_at: string
}

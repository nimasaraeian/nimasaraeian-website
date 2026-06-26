import type { QStatus } from './data'

export type Project = {
  id: string
  title: string
  description: string | null
  color: string
  owner_id: string
}

export type ProjectWithRole = {
  role: 'owner' | 'member'
  project: Project
}

export type Note = {
  id: string
  title: string
  content: string
  project_id: string
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
  created_at: string
}

export type Member = {
  id: string
  user_id: string
  role: 'owner' | 'member'
  joined_at: string
  email?: string
}

export type QAnswer = {
  question_id: string
  answer: string
  status: QStatus
  note: string
}

export type View = 'overview' | 'questionnaire' | 'question' | 'notes' | 'files' | 'members'

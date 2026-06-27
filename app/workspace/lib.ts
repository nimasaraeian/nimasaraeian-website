import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const IS_LOAN = (t: string) =>
  t.includes('تسهیلات') ||
  t.includes('آتیه') ||
  t.includes('وام') ||
  t.includes('atieh') ||
  t.toLowerCase().includes('financial')

export const DISPLAY_NAME = (t: string) => (IS_LOAN(t) ? 'نمای کلی کلینیک' : t)

export const AUTOSAVE_MS = 1200

export const PROJECT_COLORS = ['#c9a227', '#2a4a7a', '#1a6b4a', '#7a2a4a', '#4a2a7a']

export function fmtSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const STATUS_LABELS: Record<string, string> = {
  unanswered: 'بی‌پاسخ',
  draft: 'پیش‌نویس',
  completed: 'تکمیل‌شده',
}

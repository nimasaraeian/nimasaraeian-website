'use client'

import { ArrowRight } from 'lucide-react'
import { QUESTIONS } from '../data'
import type { QStatus } from '../data'
import { STATUS_LABELS } from '../lib'
import type { QAnswer } from '../types'

type Props = {
  questionId: string
  answer: QAnswer
  onBack: () => void
  onUpdate: (field: 'answer' | 'status' | 'note', value: string) => void
}

export default function QuestionDetailPanel({ questionId, answer, onBack, onUpdate }: Props) {
  const q = QUESTIONS.find((x) => x.id === questionId)
  if (!q) return null

  return (
    <div className="p-6 md:p-10 max-w-3xl ws-animate-in overflow-y-auto ws-main-scrollbar h-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[var(--ws-text-muted)] text-sm hover:text-[var(--ws-text)] mb-8 transition-colors"
      >
        <ArrowRight size={16} />
        بازگشت به پرسش‌نامه
      </button>

      <p className="text-[var(--ws-text-muted)] text-xs mb-2">بخش {q.section}</p>
      <h2 className="text-[var(--ws-text)] text-lg font-bold leading-relaxed mb-3">{q.title}</h2>
      {q.guidance && (
        <p className="text-[var(--ws-text-muted)] text-sm leading-relaxed mb-8 bg-slate-50 rounded-xl p-4 border border-[var(--ws-border)]">
          {q.guidance}
        </p>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[var(--ws-text)] text-sm font-medium mb-2">پاسخ</label>
          <textarea
            value={answer.answer}
            onChange={(e) => onUpdate('answer', e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            rows={6}
            className="ws-input resize-y leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[var(--ws-text)] text-sm font-medium mb-2">یادداشت داخلی</label>
          <textarea
            value={answer.note}
            onChange={(e) => onUpdate('note', e.target.value)}
            placeholder="یادداشت‌های داخلی..."
            rows={3}
            className="ws-input resize-y leading-relaxed text-[var(--ws-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--ws-text-muted)] text-xs mb-3">وضعیت</label>
          <div className="flex flex-wrap gap-2">
            {(['unanswered', 'draft', 'completed'] as QStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => onUpdate('status', s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  answer.status === s
                    ? 'bg-[var(--ws-navy)] text-white shadow-md'
                    : 'bg-white border border-[var(--ws-border)] text-[var(--ws-text-muted)] hover:border-[var(--ws-gold)]'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

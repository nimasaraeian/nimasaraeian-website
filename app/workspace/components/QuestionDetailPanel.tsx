'use client'

import { ArrowRight, ArrowLeft } from 'lucide-react'
import { QUESTIONS } from '../data'
import type { QStatus } from '../data'
import { STATUS_LABELS } from '../lib'
import type { QAnswer } from '../types'

type Props = {
  questionId: string
  answer: QAnswer
  onBack: () => void
  onNext?: (nextId: string) => void
  onUpdate: (field: 'answer' | 'status' | 'note', value: string) => void
}

export default function QuestionDetailPanel({ questionId, answer, onBack, onNext, onUpdate }: Props) {
  const idx = QUESTIONS.findIndex((x) => x.id === questionId)
  const q = QUESTIONS[idx]
  if (!q) return null

  const nextQ = QUESTIONS[idx + 1] ?? null

  return (
    <div className="p-6 md:p-10 max-w-3xl ws-animate-in overflow-y-auto ws-scroll h-full" dir="rtl">

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[var(--ws-text-muted)] text-sm hover:text-[var(--ws-text)] transition-colors"
        >
          <ArrowRight size={16} />
          بازگشت به پرسش‌نامه
        </button>
        <span style={{ fontSize: '12px', color: 'var(--ws-text-muted)' }}>
          {idx + 1} از {QUESTIONS.length}
        </span>
      </div>

      {/* Question header */}
      <p className="text-[var(--ws-text-muted)] text-xs mb-2">بخش {q.section}</p>
      <h2 className="text-[var(--ws-text)] text-lg font-bold leading-relaxed mb-3">{q.title}</h2>
      {q.guidance && (
        <p
          className="text-[var(--ws-text-muted)] text-sm leading-relaxed mb-8 rounded-xl p-4 border border-[var(--ws-border)]"
          style={{ background: '#f8f9fc' }}
        >
          {q.guidance}
        </p>
      )}

      {/* Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-[var(--ws-text)] text-sm font-medium mb-2">پاسخ</label>
          <textarea
            value={answer.answer}
            onChange={(e) => onUpdate('answer', e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            rows={6}
            className="ws-input resize-y leading-relaxed"
            style={{ background: '#ffffff', color: '#0d1526' }}
          />
        </div>

        <div>
          <label className="block text-[var(--ws-text)] text-sm font-medium mb-2">یادداشت داخلی</label>
          <textarea
            value={answer.note}
            onChange={(e) => onUpdate('note', e.target.value)}
            placeholder="یادداشت‌های داخلی..."
            rows={3}
            className="ws-input resize-y leading-relaxed"
            style={{ background: '#ffffff', color: '#0d1526' }}
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

      {/* Next question button */}
      <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--ws-border)', display: 'flex', justifyContent: 'flex-start' }}>
        {nextQ ? (
          <button
            onClick={() => onNext?.(nextQ.id)}
            className="ws-btn ws-btn-primary"
            style={{ gap: '8px' }}
          >
            سوال بعدی
            <ArrowLeft size={15} />
          </button>
        ) : (
          <button
            onClick={onBack}
            className="ws-btn ws-btn-primary"
          >
            بازگشت به لیست سوالات ✓
          </button>
        )}
      </div>
    </div>
  )
}

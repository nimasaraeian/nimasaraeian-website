'use client'

import { Search, ChevronLeft } from 'lucide-react'
import { SECTIONS, QUESTIONS } from '../data'
import type { QStatus } from '../data'
import { STATUS_LABELS } from '../lib'
import type { QAnswer } from '../types'

type Props = {
  answers: Record<string, QAnswer>
  activeSection: number | null
  statusFilter: QStatus | ''
  search: string
  onSectionChange: (s: number | null) => void
  onStatusFilterChange: (s: QStatus | '') => void
  onSearchChange: (s: string) => void
  onOpenQuestion: (id: string) => void
}

function statusColor(s: QStatus | undefined) {
  if (s === 'completed') return '#16a34a'
  if (s === 'draft') return '#d97706'
  return '#94a3b8'
}

export default function QuestionnairePanel({
  answers,
  activeSection,
  statusFilter,
  search,
  onSectionChange,
  onStatusFilterChange,
  onSearchChange,
  onOpenQuestion,
}: Props) {
  const filteredQ = QUESTIONS.filter((q) => {
    if (activeSection && q.section !== activeSection) return false
    if (statusFilter) {
      const s = answers[q.id]?.status || 'unanswered'
      if (s !== statusFilter) return false
    }
    if (search && !q.title.includes(search)) return false
    return true
  })

  return (
    <div className="flex h-full min-h-0">
      {/* Sections */}
      <div className="w-56 flex-shrink-0 border-l border-[var(--ws-border)] bg-white overflow-y-auto ws-main-scrollbar hidden lg:block">
        <div className="p-4">
          <p className="text-[var(--ws-text-muted)] text-[10px] tracking-widest uppercase mb-3">بخش‌ها</p>
          <button
            onClick={() => onSectionChange(null)}
            className={`w-full text-right px-3 py-2 rounded-lg text-sm mb-1 transition-all ${
              activeSection === null
                ? 'bg-[var(--ws-gold-dim)] text-[var(--ws-text)] font-medium'
                : 'text-[var(--ws-text-muted)] hover:bg-slate-50'
            }`}
          >
            همه
          </button>
          {SECTIONS.map((s) => {
            const done = QUESTIONS.filter(
              (q) => q.section === s.id && answers[q.id]?.status === 'completed'
            ).length
            const total = QUESTIONS.filter((q) => q.section === s.id).length
            return (
              <button
                key={s.id}
                onClick={() => onSectionChange(s.id)}
                className={`w-full text-right px-3 py-2 rounded-lg text-xs mb-0.5 transition-all flex items-center justify-between gap-2 ${
                  activeSection === s.id
                    ? 'bg-[var(--ws-gold-dim)] text-[var(--ws-text)] font-medium'
                    : 'text-[var(--ws-text-muted)] hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] text-slate-400 flex-shrink-0">
                  {done}/{total}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto ws-main-scrollbar p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="ws-input pr-10"
              placeholder="جستجو در سؤالات..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <select
            className="ws-input sm:w-44"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as QStatus | '')}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="unanswered">بی‌پاسخ</option>
            <option value="draft">پیش‌نویس</option>
            <option value="completed">تکمیل‌شده</option>
          </select>
        </div>

        <p className="text-[var(--ws-text-muted)] text-xs mb-4">{filteredQ.length} سؤال</p>

        <div className="space-y-2">
          {filteredQ.map((q) => {
            const status = (answers[q.id]?.status || 'unanswered') as QStatus
            return (
              <button
                key={q.id}
                onClick={() => onOpenQuestion(q.id)}
                className="ws-card ws-card-interactive w-full p-4 text-right flex items-start gap-3"
              >
                <ChevronLeft size={16} className="text-slate-300 mt-1 flex-shrink-0 rotate-180" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--ws-text)] text-sm leading-relaxed mb-1.5">{q.title}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: statusColor(status) }}>{STATUS_LABELS[status]}</span>
                  </div>
                </div>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: statusColor(status) }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

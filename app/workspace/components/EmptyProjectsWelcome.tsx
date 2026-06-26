'use client'

import { Plus } from 'lucide-react'

type Props = {
  showNewProject: boolean
  newTitle: string
  creating: boolean
  onToggleNewProject: () => void
  onNewTitleChange: (v: string) => void
  onCreateProject: () => void
}

export default function EmptyProjectsWelcome({
  showNewProject,
  newTitle,
  creating,
  onToggleNewProject,
  onNewTitleChange,
  onCreateProject,
}: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 ws-animate-in">
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--ws-gold-dim)' }}
        >
          <Plus size={32} className="text-[var(--ws-gold)]" />
        </div>
        <h2 className="text-[var(--ws-text)] text-2xl font-bold mb-3">به فضای کار خوش آمدید</h2>
        <p className="text-[var(--ws-text-muted)] mb-8 leading-relaxed">
          اولین پروژه خود را بسازید تا مستندات، فایل‌ها و پرسش‌نامه را مدیریت کنید.
        </p>

        {showNewProject ? (
          <div className="ws-card p-6 space-y-4 text-right">
            <input
              className="ws-input"
              placeholder="نام پروژه..."
              value={newTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCreateProject()}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={onCreateProject} disabled={creating || !newTitle.trim()} className="ws-btn-gold flex-1">
                {creating ? 'در حال ایجاد...' : 'ایجاد پروژه'}
              </button>
              <button onClick={onToggleNewProject} className="ws-btn-ghost flex-1">
                انصراف
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onToggleNewProject} className="ws-btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            پروژه جدید
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { Plus } from 'lucide-react'

type Props = {
  showNewProject: boolean
  newTitle: string
  creating: boolean
  onToggleNewProject: () => void
  onCancelNewProject: () => void
  onNewTitleChange: (v: string) => void
  onCreateProject: () => void
}

export default function EmptyProjectsWelcome({
  showNewProject,
  newTitle,
  creating,
  onToggleNewProject,
  onCancelNewProject,
  onNewTitleChange,
  onCreateProject,
}: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 ws-animate-in">
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--ws-gold-glow)', border: '1px solid var(--ws-gold-border)' }}
        >
          <Plus size={32} style={{ color: 'var(--ws-gold)' }} />
        </div>
        <h2 style={{ color: 'var(--ws-text)', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
          به فضای کار خوش آمدید
        </h2>
        <p style={{ color: 'var(--ws-text-muted)', marginBottom: '32px', lineHeight: 1.75, fontSize: '14px' }}>
          اولین پروژه خود را بسازید تا مستندات، فایل‌ها و پرسش‌نامه را مدیریت کنید.
        </p>

        {showNewProject ? (
          <div className="ws-card" style={{ padding: '24px', textAlign: 'right' }}>
            <input
              className="ws-input"
              placeholder="نام پروژه..."
              value={newTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCreateProject()}
              autoFocus
              style={{ marginBottom: '12px', background: '#ffffff', color: '#0d1526' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onCreateProject}
                disabled={creating || !newTitle.trim()}
                className="ws-btn ws-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {creating ? 'در حال ایجاد...' : 'ایجاد پروژه'}
              </button>
              <button
                onClick={onCancelNewProject}
                className="ws-btn ws-btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                انصراف
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onToggleNewProject} className="ws-btn ws-btn-primary">
            <Plus size={16} />
            پروژه جدید
          </button>
        )}
      </div>
    </div>
  )
}

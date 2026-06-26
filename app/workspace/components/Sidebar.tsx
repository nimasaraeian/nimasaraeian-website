'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { DISPLAY_NAME } from '../lib'
import type { ProjectWithRole } from '../types'

type Props = {
  session: Session
  projects: ProjectWithRole[]
  selId: string | null
  showNewProject: boolean
  newTitle: string
  creating: boolean
  onSelectProject: (id: string) => void
  onToggleNewProject: () => void
  onNewTitleChange: (v: string) => void
  onCreateProject: () => void
}

export default function Sidebar({
  session, projects, selId,
  showNewProject, newTitle, creating,
  onSelectProject, onToggleNewProject, onNewTitleChange, onCreateProject,
}: Props) {
  const email = session.user.email || ''

  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e8eaf0',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>

      {/* ── Top: back link + user ──────────────── */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #f0f1f6' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            color: '#9ca3af', fontSize: '11px', textDecoration: 'none',
            marginBottom: '16px', letterSpacing: '0.04em',
            fontFamily: 'Times New Roman, serif', transition: 'color .15s',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#374151')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#9ca3af')}
        >
          <ArrowLeft size={11} />
          nimasaraeian.com
        </Link>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'rtl' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1px solid #fbbf24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#92400e', fontWeight: 800, fontSize: '13px',
          }}>
            {email[0]?.toUpperCase() || 'N'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
              Workspace
            </div>
            <div style={{
              fontSize: '10px', color: '#9ca3af', lineHeight: 1.4,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              direction: 'ltr', textAlign: 'right',
            }}>
              {email}
            </div>
          </div>
        </div>
      </div>

      {/* ── Projects list ──────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px 10px' }} className="ws-scroll">

        <div style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#9ca3af',
          padding: '0 8px', marginBottom: '6px',
          fontFamily: 'Times New Roman, serif',
        }}>
          پروژه‌ها
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {projects.map(({ project, role }) => {
            const isActive = selId === project.id
            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 10px', borderRadius: '10px', border: 'none',
                  background: isActive ? '#f5f6fb' : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                  direction: 'rtl', transition: 'all 0.14s', textAlign: 'right',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive) e.currentTarget.style.background = '#f9fafb'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Color bar */}
                <div style={{
                  width: isActive ? '3px' : '7px',
                  height: isActive ? '22px' : '7px',
                  borderRadius: isActive ? '2px' : '50%',
                  background: project.color,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.6,
                  transition: 'all 0.2s',
                }} />

                <span style={{
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontSize: '13px', fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#111827' : '#374151',
                }}>
                  {DISPLAY_NAME(project.title)}
                </span>

                {role === 'owner' && (
                  <span style={{
                    fontSize: '9px', letterSpacing: '0.04em',
                    color: isActive ? project.color : '#9ca3af',
                    fontWeight: 600, flexShrink: 0,
                  }}>
                    owner
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* New project */}
        {showNewProject ? (
          <div style={{
            marginTop: '8px', padding: '11px',
            background: '#f9fafb', border: '1px solid #e5e7eb',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '7px',
          }}>
            <input
              className="ws-input"
              placeholder="نام پروژه..."
              value={newTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCreateProject()}
              autoFocus
              style={{ fontSize: '13px', padding: '8px 11px', direction: 'rtl' }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={onCreateProject}
                disabled={creating || !newTitle.trim()}
                className="ws-btn ws-btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '7px' }}
              >
                {creating ? '...' : 'ایجاد'}
              </button>
              <button
                onClick={onToggleNewProject}
                className="ws-btn ws-btn-ghost"
                style={{ padding: '7px 10px' }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleNewProject}
            style={{
              width: '100%', marginTop: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              padding: '8px', borderRadius: '9px',
              border: '1.5px dashed #e0e3ef',
              background: 'none', color: '#9ca3af', fontSize: '12px',
              cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
              direction: 'rtl',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.borderColor = '#d4a843'
              e.currentTarget.style.color = '#b8820a'
              e.currentTarget.style.background = '#fffbeb'
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.borderColor = '#e0e3ef'
              e.currentTarget.style.color = '#9ca3af'
              e.currentTarget.style.background = 'none'
            }}
          >
            <Plus size={12} />
            پروژه جدید
          </button>
        )}
      </div>
    </aside>
  )
}

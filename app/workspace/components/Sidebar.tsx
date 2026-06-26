'use client'

import Link from 'next/link'
import { LayoutDashboard, FileText, FolderOpen, Users, ClipboardList, LogOut, Plus, ArrowLeft } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { DISPLAY_NAME } from '../lib'
import type { ProjectWithRole, View } from '../types'

type NavItem = { id: View; label: string; icon: React.ReactNode }
type Props = {
  session: Session
  projects: ProjectWithRole[]
  selId: string | null
  view: View
  isLoan: boolean
  isOwner: boolean
  showNewProject: boolean
  newTitle: string
  creating: boolean
  onSelectProject: (id: string) => void
  onSetView: (v: View) => void
  onSignOut: () => void
  onToggleNewProject: () => void
  onNewTitleChange: (v: string) => void
  onCreateProject: () => void
}

export default function Sidebar({ session, projects, selId, view, isLoan, isOwner, showNewProject, newTitle, creating, onSelectProject, onSetView, onSignOut, onToggleNewProject, onNewTitleChange, onCreateProject }: Props) {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'نمای کلی', icon: <LayoutDashboard size={15} /> },
    ...(isLoan ? [{ id: 'questionnaire' as View, label: 'پرسش‌نامه', icon: <ClipboardList size={15} /> }] : []),
    { id: 'notes', label: 'یادداشت‌ها', icon: <FileText size={15} /> },
    { id: 'files', label: 'فایل‌ها', icon: <FolderOpen size={15} /> },
    ...(isOwner ? [{ id: 'members' as View, label: 'اعضا', icon: <Users size={15} /> }] : []),
  ]

  const email = session.user.email || ''
  const initial = email[0]?.toUpperCase() || 'N'

  return (
    <aside style={{
      width: '256px', flexShrink: 0,
      background: 'var(--ws-sidebar)',
      borderLeft: '1px solid var(--ws-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', direction: 'rtl',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--ws-border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ws-text-muted)', fontSize: '12px', textDecoration: 'none', marginBottom: '16px', transition: 'color .2s', fontFamily: 'Times New Roman, serif', letterSpacing: '0.05em' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--ws-text)')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--ws-text-muted)')}
        >
          <ArrowLeft size={13} />
          nimasaraeian.com
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--ws-gold-glow)', border: '1px solid var(--ws-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-gold)', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'var(--ws-text)', fontSize: '13px', fontWeight: 600 }}>Workspace</div>
            <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'ltr', textAlign: 'right' }}>{email}</div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }} className="ws-scroll">

        {/* Projects section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: 'var(--ws-text-dim)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px', fontFamily: 'Times New Roman, serif' }}>پروژه‌ها</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {projects.map(({ project, role }) => {
              const active = selId === project.id
              return (
                <button key={project.id} onClick={() => onSelectProject(project.id)} className={`ws-nav-item${active ? ' active' : ''}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <span style={{ width: active ? '3px' : '7px', height: active ? '20px' : '7px', borderRadius: active ? '2px' : '50%', background: active ? project.color : project.color, flexShrink: 0, opacity: active ? 1 : 0.7, transition: 'all .2s' }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{DISPLAY_NAME(project.title)}</span>
                  {role === 'owner' && <span style={{ fontSize: '10px', color: 'var(--ws-text-dim)', flexShrink: 0 }}>owner</span>}
                </button>
              )
            })}
          </div>

          {showNewProject ? (
            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input className="ws-input" placeholder="نام پروژه جدید..." value={newTitle} onChange={e => onNewTitleChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onCreateProject()} autoFocus style={{ fontSize: '13px', padding: '9px 12px' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={onCreateProject} disabled={creating || !newTitle.trim()} className="ws-btn ws-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}>{creating ? '...' : 'ایجاد'}</button>
                <button onClick={onToggleNewProject} className="ws-btn ws-btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}>انصراف</button>
              </div>
            </div>
          ) : (
            <button onClick={onToggleNewProject} style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '10px', border: '1px dashed var(--ws-border)', background: 'none', color: 'var(--ws-text-dim)', fontSize: '12px', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--ws-gold-border)'; e.currentTarget.style.color = 'var(--ws-gold)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--ws-border)'; e.currentTarget.style.color = 'var(--ws-text-dim)' }}
            >
              <Plus size={13} />پروژه جدید
            </button>
          )}
        </div>

        {/* Project nav */}
        {selId && navItems.length > 0 && (
          <div>
            <div style={{ color: 'var(--ws-text-dim)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px', fontFamily: 'Times New Roman, serif' }}>بخش‌ها</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => onSetView(item.id)} className={`ws-nav-item${view === item.id ? ' active' : ''}`} style={{ justifyContent: 'flex-start' }}>
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--ws-border)' }}>
        <button onClick={onSignOut} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '9px', background: 'none', border: 'none', color: 'var(--ws-text-muted)', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit', transition: 'all .2s', direction: 'rtl' }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.06)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-text-muted)'; e.currentTarget.style.background = 'none' }}
        >
          <LogOut size={13} />خروج
        </button>
      </div>
    </aside>
  )
}

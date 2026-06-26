'use client'

import { UserPlus, X, Crown } from 'lucide-react'
import { DISPLAY_NAME } from '../lib'
import type { Member, Project } from '../types'
import type { Session } from '@supabase/supabase-js'

type Props = {
  project: Project
  members: Member[]
  session: Session
  inviteEmail: string
  inviting: boolean
  inviteMsg: string
  onInviteEmailChange: (v: string) => void
  onInvite: () => void
  onRemoveMember: (id: string) => void
}

export default function MembersPanel({ project, members, session, inviteEmail, inviting, inviteMsg, onInviteEmailChange, onInvite, onRemoveMember }: Props) {
  return (
    <div className="ws-animate-in" style={{ padding: '40px 44px', maxWidth: '680px' }}>
      <div style={{ marginBottom: '32px', direction: 'rtl' }}>
        <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Times New Roman, serif' }}>اعضای تیم</div>
        <h1 style={{ color: 'var(--ws-text)', fontSize: '22px', fontWeight: 700 }}>{DISPLAY_NAME(project.title)}</h1>
      </div>

      <div className="ws-card" style={{ padding: '24px 28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', direction: 'rtl' }}>
          <UserPlus size={16} style={{ color: 'var(--ws-gold)' }} />
          <span style={{ color: 'var(--ws-text)', fontSize: '14px', fontWeight: 600 }}>دعوت عضو جدید</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="email" className="ws-input" placeholder="name@example.com" value={inviteEmail} onChange={e => onInviteEmailChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onInvite()} dir="ltr" style={{ flex: 1 }} />
          <button onClick={onInvite} disabled={inviting} className="ws-btn ws-btn-primary" style={{ whiteSpace: 'nowrap' }}>
            {inviting ? '...' : 'ارسال دعوت'}
          </button>
        </div>
        {inviteMsg && (
          <p style={{ fontSize: '12px', marginTop: '10px', color: inviteMsg.includes('✓') ? 'var(--ws-success)' : 'var(--ws-danger)', direction: 'rtl' }}>
            {inviteMsg}
          </p>
        )}
      </div>

      <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Times New Roman, serif', direction: 'rtl' }}>
        اعضای فعلی ({members.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {members.map((m) => (
          <div key={m.id} className="ws-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="ws-avatar">{(m.email || '?')[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--ws-text)', fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} dir="ltr">
                {m.email || m.user_id.slice(0, 12) + '...'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px', direction: 'rtl' }}>
                {m.role === 'owner' && <Crown size={11} style={{ color: 'var(--ws-gold)' }} />}
                <p style={{ color: 'var(--ws-text-muted)', fontSize: '11px' }}>{m.role === 'owner' ? 'مالک' : 'عضو'}</p>
              </div>
            </div>
            {m.user_id !== session.user.id && (
              <button onClick={() => onRemoveMember(m.id)} style={{ background: 'none', border: 'none', color: 'var(--ws-text-dim)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all .2s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-text-dim)'; e.currentTarget.style.background = 'none' }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

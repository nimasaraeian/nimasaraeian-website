'use client'

import { UserPlus, X, Crown, Mail, Calendar, Shield } from 'lucide-react'
import { DISPLAY_NAME, fmtDate } from '../lib'
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

const AVATAR_PALETTES = [
  { bg: 'rgba(212,168,67,0.12)', border: 'rgba(212,168,67,0.30)', text: '#b8820a' },
  { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.30)', text: '#3b82f6' },
  { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.30)', text: '#059669' },
  { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.30)', text: '#7c3aed' },
]

function avatarColor(userId: string, isOwner: boolean) {
  if (isOwner) return AVATAR_PALETTES[0]
  const idx = (userId.charCodeAt(0) % (AVATAR_PALETTES.length - 1)) + 1
  return AVATAR_PALETTES[idx]
}

function displayNameFrom(email?: string) {
  if (!email) return 'کاربر'
  const local = email.split('@')[0]
  return local.replace(/[._-]/g, ' ').trim() || email
}

export default function MembersPanel({
  project, members, session,
  inviteEmail, inviting, inviteMsg,
  onInviteEmailChange, onInvite, onRemoveMember,
}: Props) {
  const ownerId = members.find((m) => m.role === 'owner')?.user_id
  const isOwner = session.user.id === ownerId

  return (
    <div
      className="ws-animate-in ws-mobile-padded"
      style={{ padding: 'clamp(16px,4vw,40px) clamp(16px,4vw,44px)', maxWidth: '800px', direction: 'rtl' }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          color: 'var(--ws-text-muted)', fontSize: '11px',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          marginBottom: '6px', fontFamily: 'Georgia, serif',
        }}>
          اعضای تیم
        </div>
        <h1 style={{ color: 'var(--ws-text)', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          {DISPLAY_NAME(project.title)}
        </h1>
        <p style={{ color: 'var(--ws-text-muted)', fontSize: '13px' }}>
          {members.length} عضو در این پروژه
        </p>
      </div>

      {/* ── Profile Cards ────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {members.map((m) => {
          const isOwn = m.user_id === session.user.id
          const isOwnerRole = m.role === 'owner'
          const palette = avatarColor(m.user_id, isOwnerRole)
          const name = displayNameFrom(m.email)
          const initial = name[0]?.toUpperCase() || '?'

          return (
            <div
              key={m.id}
              className="ws-card"
              style={{
                padding: '28px 24px',
                position: 'relative',
                transition: 'box-shadow .2s, border-color .2s',
                border: isOwn ? '1px solid var(--ws-gold-border)' : '1px solid var(--ws-border)',
              }}
            >
              {/* Remove button */}
              {isOwner && !isOwn && (
                <button
                  onClick={() => onRemoveMember(m.id)}
                  title="حذف عضو"
                  style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ws-text-dim)', padding: '4px', borderRadius: '6px',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.color = 'var(--ws-danger)'
                    e.currentTarget.style.background = 'rgba(248,113,113,0.08)'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.color = 'var(--ws-text-dim)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <X size={14} />
                </button>
              )}

              {/* "You" badge */}
              {isOwn && (
                <div style={{
                  position: 'absolute', top: '14px', left: '14px',
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '20px', background: 'var(--ws-gold-glow)',
                  color: 'var(--ws-gold)', border: '1px solid var(--ws-gold-border)',
                }}>
                  شما
                </div>
              )}

              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: palette.bg, border: `2px solid ${palette.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', fontWeight: 800, color: palette.text,
                  marginBottom: '14px',
                  boxShadow: `0 0 0 4px ${palette.bg}`,
                }}>
                  {initial}
                </div>

                {/* Name */}
                <h3 style={{
                  color: 'var(--ws-text)', fontSize: '15px', fontWeight: 700,
                  textAlign: 'center', marginBottom: '6px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}>
                  {name}
                </h3>

                {/* Role badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {isOwnerRole
                    ? <Crown size={12} style={{ color: 'var(--ws-gold)' }} />
                    : <Shield size={12} style={{ color: '#60a5fa' }} />
                  }
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    color: isOwnerRole ? 'var(--ws-gold)' : '#60a5fa',
                  }}>
                    {isOwnerRole ? 'مالک پروژه' : 'عضو تیم'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--ws-border)', margin: '0 0 16px' }} />

              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {m.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: 'var(--ws-card-high)',
                      border: '1px solid var(--ws-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Mail size={12} style={{ color: 'var(--ws-text-muted)' }} />
                    </div>
                    <span
                      style={{ color: 'var(--ws-text-muted)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      dir="ltr"
                    >
                      {m.email}
                    </span>
                  </div>
                )}
                {m.joined_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: 'var(--ws-card-high)',
                      border: '1px solid var(--ws-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Calendar size={12} style={{ color: 'var(--ws-text-muted)' }} />
                    </div>
                    <span style={{ color: 'var(--ws-text-muted)', fontSize: '12px' }}>
                      عضو از {fmtDate(m.joined_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Invite section ───────────────────────── */}
      <div className="ws-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'var(--ws-gold-glow)', border: '1px solid var(--ws-gold-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <UserPlus size={15} style={{ color: 'var(--ws-gold)' }} />
          </div>
          <div>
            <span style={{ color: 'var(--ws-text)', fontSize: '14px', fontWeight: 600 }}>
              دعوت عضو جدید
            </span>
            <p style={{ color: 'var(--ws-text-muted)', fontSize: '11px', marginTop: '1px' }}>
              ایمیل عضو جدید را وارد کنید
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="email"
            className="ws-input"
            placeholder="name@example.com"
            value={inviteEmail}
            onChange={(e) => onInviteEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onInvite()}
            dir="ltr"
            style={{ flex: 1, background: '#ffffff', color: '#0d1526' }}
          />
          <button
            onClick={onInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="ws-btn ws-btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {inviting ? '...' : 'ارسال دعوت'}
          </button>
        </div>

        {inviteMsg && (
          <p style={{
            fontSize: '12px', marginTop: '10px', direction: 'rtl',
            color: inviteMsg.includes('✓') ? 'var(--ws-success)' : 'var(--ws-danger)',
          }}>
            {inviteMsg}
          </p>
        )}
      </div>
    </div>
  )
}

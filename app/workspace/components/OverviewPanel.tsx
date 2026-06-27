'use client'

import { FileText, FolderOpen, ClipboardList, MessageSquare, ArrowLeft, TrendingUp } from 'lucide-react'
import { DISPLAY_NAME } from '../lib'
import type { Project, Member, Note, FileRecord, Message, View } from '../types'

type Props = {
  project: Project
  notes: Note[]
  files: FileRecord[]
  members: Member[]
  messages: Message[]
  isLoan: boolean
  totalQ: number
  completedQ: number
  pct: number
  onNavigate: (view: View) => void
}

/* ── SVG circular progress ─────────────────── */
function CircleProgress({ pct, color }: { pct: number; color: string }) {
  const r = 52, c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  )
}

const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n) + '…' : s

export default function OverviewPanel({
  project, notes, files, members, messages,
  isLoan, totalQ, completedQ, pct, onNavigate,
}: Props) {

  const memberMap: Record<string, string> = {}
  members.forEach(m => { memberMap[m.user_id] = (m.email || '').split('@')[0] })

  const recentNotes = [...notes].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 5)

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = (now.getTime() - d.getTime()) / 1000
    if (diff < 60)    return 'همین الان'
    if (diff < 3600)  return `${Math.floor(diff/60)} دقیقه پیش`
    if (diff < 86400) return `${Math.floor(diff/3600)} ساعت پیش`
    return d.toLocaleDateString('fa-IR')
  }

  /* accent color safe for dark bg */
  const accent = '#f5c842'

  return (
    <div className="ws-animate-in" style={{ minHeight: '100%', background: 'var(--ws-bg)' }}>

      {/* ═══════════════════════════════════════
          HERO — dark gradient
      ═══════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, #0d1526 0%, ${project.color}dd 100%)`,
        padding: 'clamp(20px,5vw,40px) clamp(16px,5vw,40px) clamp(24px,5vw,40px)',
        position: 'relative', overflow: 'hidden',
        direction: 'rtl',
      }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 90% at 110% -20%, ${project.color}55 0%, transparent 70%)`,
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '20px', padding: '4px 12px', marginBottom: '14px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em' }}>
                پروژه فعال
              </span>
            </div>

            <h1 style={{
              color: '#fff', fontSize: '28px', fontWeight: 800,
              lineHeight: 1.25, marginBottom: '8px', letterSpacing: '-0.02em',
            }}>
              {DISPLAY_NAME(project.title)}
            </h1>

            {project.description && (
              <p style={{
                color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.7,
                maxWidth: '480px', marginBottom: '24px',
              }}>
                {project.description}
              </p>
            )}

            {/* Stat pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { n: notes.length,    label: 'یادداشت', icon: '📝' },
                { n: files.length,    label: 'فایل',    icon: '📎' },
                { n: messages.length, label: 'پیام',    icon: '💬' },
                { n: members.length,  label: 'عضو',     icon: '👤' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '10px', padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '13px' }}>{s.icon}</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>{s.n}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Circular progress (loan only) */}
          {isLoan && totalQ > 0 && (
            <div
              onClick={() => onNavigate('questionnaire')}
              style={{ cursor: 'pointer', flexShrink: 0, position: 'relative', width: 130, height: 130 }}
            >
              <CircleProgress pct={pct} color={accent} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transform: 'none',
              }}>
                <span style={{ color: accent, fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>{pct}٪</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '3px' }}>تکمیل</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          PROGRESS BAR (loan)
      ═══════════════════════════════════════ */}
      {isLoan && totalQ > 0 && (
        <div style={{
          background: '#fff', borderBottom: '1px solid var(--ws-border)',
          padding: '14px 40px', direction: 'rtl',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <TrendingUp size={15} style={{ color: 'var(--ws-gold)', flexShrink: 0 }} />
          <span style={{ color: 'var(--ws-text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
            پرسش‌نامه راهبردی
          </span>
          <div className="ws-progress-track" style={{ flex: 1 }}>
            <div className="ws-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ color: 'var(--ws-text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
            {completedQ} / {totalQ}
          </span>
          <button
            onClick={() => onNavigate('questionnaire')}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ws-gold)', fontSize: '12px', fontWeight: 600,
              fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            ادامه <ArrowLeft size={12} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          CONTENT AREA
      ═══════════════════════════════════════ */}
      <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,5vw,40px) clamp(24px,5vw,40px)', direction: 'rtl' }} className="ws-panel-grid">

        {/* ── Quick actions ── */}
        <div>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ws-text-dim)',
            marginBottom: '12px', fontFamily: 'Georgia, serif',
          }}>
            دسترسی سریع
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { view: 'notes'         as View, label: 'یادداشت‌ها',       sub: `${notes.length} یادداشت`,    icon: <FileText size={18}/>,    color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
              { view: 'chat'          as View, label: 'گفتگو',             sub: `${messages.length} پیام`,    icon: <MessageSquare size={18}/>, color: '#0d9488', bg: 'rgba(13,148,136,0.08)' },
              { view: 'files'         as View, label: 'فایل‌ها و مدارک',  sub: `${files.length} فایل`,       icon: <FolderOpen size={18}/>,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
              ...(isLoan ? [{ view: 'questionnaire' as View, label: 'پرسش‌نامه راهبردی', sub: `${pct}٪ تکمیل`,  icon: <ClipboardList size={18}/>, color: '#d4a843', bg: 'rgba(212,168,67,0.08)' }] : []),
            ].map(a => (
              <button
                key={String(a.view)}
                onClick={() => onNavigate(a.view)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px 18px', borderRadius: '14px', border: 'none',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                  cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                  textAlign: 'right', transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                  e.currentTarget.style.borderLeft = `3px solid ${a.color}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)'
                  e.currentTarget.style.borderLeft = 'none'
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: a.bg, color: a.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--ws-text)', fontWeight: 600, fontSize: '14px', lineHeight: 1.3 }}>{a.label}</div>
                  <div style={{ color: 'var(--ws-text-muted)', fontSize: '12px', marginTop: '2px' }}>{a.sub}</div>
                </div>
                <ArrowLeft size={14} style={{ color: 'var(--ws-text-dim)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent notes ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ws-text-dim)',
              fontFamily: 'Georgia, serif', margin: 0,
            }}>
              آخرین یادداشت‌ها
            </p>
            <button
              onClick={() => onNavigate('notes')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ws-gold)', fontSize: '11px', fontWeight: 600,
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '3px',
              }}
            >
              همه <ArrowLeft size={11} />
            </button>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
            overflow: 'hidden',
          }}>
            {recentNotes.length === 0 ? (
              <div style={{
                padding: '48px 24px', textAlign: 'center',
                color: 'var(--ws-text-dim)', fontSize: '13px',
              }}>
                هنوز یادداشتی ایجاد نشده
              </div>
            ) : recentNotes.map((n, i) => (
              <div
                key={n.id}
                onClick={() => onNavigate('notes')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 20px', cursor: 'pointer',
                  borderBottom: i < recentNotes.length - 1 ? '1px solid var(--ws-border)' : 'none',
                  transition: 'background 0.14s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ws-card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(59,130,246,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3b82f6',
                }}>
                  <FileText size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: 'var(--ws-text)', fontSize: '13px', fontWeight: 600,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {n.title || 'یادداشت بی‌عنوان'}
                  </div>
                  <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', marginTop: '2px' }}>
                    {truncate(n.content.replace(/[#*`>\-]/g, '').trim(), 55) || '—'}
                  </div>
                </div>
                <div style={{ color: 'var(--ws-text-dim)', fontSize: '10px', flexShrink: 0, direction: 'ltr' }}>
                  {fmtDate(n.updated_at)}
                </div>
              </div>
            ))}
          </div>

          {/* Members */}
          {members.length > 0 && (
            <div style={{
              marginTop: '16px', background: '#fff', borderRadius: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <span style={{ color: 'var(--ws-text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>اعضای پروژه</span>
              <div style={{ display: 'flex', flex: 1 }}>
                {members.slice(0, 5).map((m, i) => (
                  <div key={m.id} title={m.email} style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: `linear-gradient(135deg, rgba(212,168,67,0.2), rgba(59,130,246,0.15))`,
                    border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--ws-gold)', fontSize: '11px', fontWeight: 700,
                    marginLeft: i > 0 ? '-8px' : '0',
                    position: 'relative', zIndex: 10 - i,
                  }}>
                    {(m.email?.[0] || 'U').toUpperCase()}
                  </div>
                ))}
              </div>
              <span style={{ color: 'var(--ws-text)', fontWeight: 700, fontSize: '13px' }}>
                {members.length} نفر
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

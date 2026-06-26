'use client'

import { FileText, FolderOpen, Users, ClipboardList, TrendingUp, ChevronLeft } from 'lucide-react'
import { DISPLAY_NAME } from '../lib'
import type { Project, Member, Note, FileRecord, View } from '../types'

type Props = {
  project: Project
  notes: Note[]
  files: FileRecord[]
  members: Member[]
  isLoan: boolean
  totalQ: number
  completedQ: number
  pct: number
  onNavigate: (view: Extract<View, 'notes' | 'files' | 'questionnaire'>) => void
}

export default function OverviewPanel({ project, notes, files, members, isLoan, totalQ, completedQ, pct, onNavigate }: Props) {
  const stats = [
    {
      label: 'یادداشت', value: notes.length, icon: <FileText size={18} />,
      color: '#60a5fa', glow: 'rgba(96,165,250,0.12)', view: 'notes' as const,
    },
    {
      label: 'فایل', value: files.length, icon: <FolderOpen size={18} />,
      color: '#a78bfa', glow: 'rgba(167,139,250,0.12)', view: 'files' as const,
    },
    {
      label: 'اعضا', value: members.length, icon: <Users size={18} />,
      color: '#34d399', glow: 'rgba(52,211,153,0.12)', view: undefined,
    },
    ...(isLoan ? [
      {
        label: 'سؤال', value: totalQ, icon: <ClipboardList size={18} />,
        color: 'var(--ws-gold)', glow: 'var(--ws-gold-glow)', view: 'questionnaire' as const,
      },
      {
        label: 'تکمیل‌شده', value: completedQ, icon: <TrendingUp size={18} />,
        color: 'var(--ws-success)', glow: 'rgba(74,222,128,0.12)', view: 'questionnaire' as const,
      },
    ] : []),
  ]

  const actions = [
    ...(isLoan ? [{
      label: 'پرسش‌نامه راهبردی',
      desc: 'پاسخ به ۸۹ سؤال پروژه و پیگیری پیشرفت',
      view: 'questionnaire' as const,
      icon: <ClipboardList size={22} />,
      color: 'var(--ws-gold)',
    }] : []),
    {
      label: 'یادداشت‌ها',
      desc: 'مستندات، تحلیل‌ها و یادداشت‌های تیمی',
      view: 'notes' as const,
      icon: <FileText size={22} />,
      color: '#60a5fa',
    },
    {
      label: 'فایل‌ها و مدارک',
      desc: 'پیوست‌ها، اسناد و مدارک پروژه',
      view: 'files' as const,
      icon: <FolderOpen size={22} />,
      color: '#a78bfa',
    },
  ]

  return (
    <div className="ws-animate-in" style={{ padding: '40px 44px', maxWidth: '900px' }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${project.color}14 0%, ${project.color}06 60%, transparent 100%)`,
        border: `1px solid ${project.color}28`,
        borderRadius: '20px', padding: '36px 40px', marginBottom: '32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: project.color, opacity: 0.05, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Times New Roman, serif' }}>پروژه فعال</div>
          <h1 style={{ color: 'var(--ws-text)', fontSize: '28px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4, direction: 'rtl' }}>
            {DISPLAY_NAME(project.title)}
          </h1>
          {project.description && (
            <p style={{ color: 'var(--ws-text-muted)', fontSize: '14px', lineHeight: 1.8, direction: 'rtl' }}>{project.description}</p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div
            key={i}
            className="ws-stat-card"
            onClick={() => s.view && onNavigate(s.view)}
            style={{ cursor: s.view ? 'pointer' : 'default' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, borderRadius: '0 16px 0 70px', background: s.color, opacity: 0.07 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div style={{ color: 'var(--ws-text)', fontSize: '28px', fontWeight: 700, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
            <div style={{ color: 'var(--ws-text-muted)', fontSize: '12px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      {isLoan && totalQ > 0 && (
        <div className="ws-card" style={{ padding: '24px 28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', direction: 'rtl' }}>
            <span style={{ color: 'var(--ws-text)', fontSize: '14px', fontWeight: 600 }}>پیشرفت پرسش‌نامه</span>
            <span style={{ color: 'var(--ws-gold)', fontWeight: 700, fontSize: '18px' }}>{pct}٪</span>
          </div>
          <div className="ws-progress-track">
            <div className="ws-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p style={{ color: 'var(--ws-text-muted)', fontSize: '12px', marginTop: '8px', direction: 'rtl' }}>
            {completedQ} از {totalQ} سؤال تکمیل شده — {totalQ - completedQ} سؤال باقی‌مانده
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Times New Roman, serif' }}>دسترسی سریع</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {actions.map((a) => (
            <button key={a.view} onClick={() => onNavigate(a.view)} className="ws-action-card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', direction: 'rtl' }}>
                  <div style={{ color: a.color, opacity: 0.8 }}>{a.icon}</div>
                  <ChevronLeft size={16} style={{ color: 'var(--ws-text-dim)', transform: 'rotate(180deg)' }} />
                </div>
                <div style={{ color: 'var(--ws-text)', fontSize: '15px', fontWeight: 600, marginBottom: '6px', direction: 'rtl' }}>{a.label}</div>
                <div style={{ color: 'var(--ws-text-muted)', fontSize: '12px', lineHeight: 1.6, direction: 'rtl' }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

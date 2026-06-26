'use client'

import {
  LayoutDashboard, MessageSquare, FileText,
  FolderOpen, Users, ClipboardList, LogOut,
} from 'lucide-react'
import type { View } from '../types'

type Props = {
  view: View
  isLoan: boolean
  isOwner: boolean
  userInitial: string
  onSetView: (v: View) => void
  onSignOut: () => void
}

type Item = { id: View; label: string; icon: React.ReactNode; color: string }

export default function IconNav({ view, isLoan, isOwner, userInitial, onSetView, onSignOut }: Props) {
  const active = view === 'question' ? 'questionnaire' : view

  const items: Item[] = [
    { id: 'overview',  label: 'خانه',    icon: <LayoutDashboard size={19} />, color: '#d4a843' },
    { id: 'chat',      label: 'گفتگو',   icon: <MessageSquare size={19} />,   color: '#0d9488' },
    { id: 'notes',     label: 'یادداشت', icon: <FileText size={19} />,        color: '#3b82f6' },
    { id: 'files',     label: 'فایل',    icon: <FolderOpen size={19} />,      color: '#8b5cf6' },
    ...(isOwner ? [{ id: 'members' as View,      label: 'اعضا',       icon: <Users size={19} />,       color: '#16a34a' }] : []),
    ...(isLoan  ? [{ id: 'questionnaire' as View, label: 'پرسش‌نامه', icon: <ClipboardList size={19} />, color: '#d4a843' }] : []),
  ]

  return (
    <nav style={{
      width: '68px', flexShrink: 0,
      background: '#0f172a',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: '18px', paddingBottom: '14px',
      gap: '2px',
    }}>

      {/* User avatar */}
      <div style={{
        width: '38px', height: '38px', borderRadius: '11px',
        background: 'linear-gradient(135deg, rgba(212,168,67,0.28) 0%, rgba(212,168,67,0.08) 100%)',
        border: '1.5px solid rgba(212,168,67,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#d4a843', fontWeight: 800, fontSize: '16px',
        marginBottom: '22px', flexShrink: 0,
        fontFamily: 'Vazirmatn, sans-serif',
      }}>
        {userInitial}
      </div>

      {/* Nav items */}
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => onSetView(item.id)}
            title={item.label}
            style={{
              width: '48px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '5px', padding: '10px 4px',
              borderRadius: '12px', border: 'none',
              background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
              color: isActive ? item.color : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.16s',
              position: 'relative',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {/* Active dot */}
            {isActive && (
              <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                width: '3px', height: '20px', borderRadius: '2px 0 0 2px',
                background: item.color,
              }} />
            )}
            {item.icon}
            <span style={{
              fontSize: '9px', lineHeight: 1.3, direction: 'rtl',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.01em',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Sign out */}
      <button
        onClick={onSignOut}
        title="خروج"
        style={{
          width: '44px', height: '44px', borderRadius: '12px', border: 'none',
          background: 'transparent', color: 'rgba(255,255,255,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '4px', cursor: 'pointer', transition: 'all 0.16s', fontFamily: 'inherit',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = '#f43f5e'
          e.currentTarget.style.background = 'rgba(244,63,94,0.1)'
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <LogOut size={16} />
        <span style={{ fontSize: '8px' }}>خروج</span>
      </button>
    </nav>
  )
}

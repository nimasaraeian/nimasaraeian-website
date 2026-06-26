'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import type { Message, Member, Project } from '../types'

type Props = {
  project: Project
  messages: Message[]
  members: Member[]
  userId: string
  sending: boolean
  onSend: (content: string) => void
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

const fmtMsgDate = (iso: string) => {
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return fmtTime(iso)
  return (
    d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }) +
    '  ' +
    fmtTime(iso)
  )
}

export default function ChatPanel({ project, messages, members, userId, sending, onSend }: Props) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const memberMap: Record<string, string> = {}
  members.forEach((m) => {
    memberMap[m.user_id] = (m.email || '').split('@')[0] || 'کاربر'
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const content = text.trim()
    if (!content || sending) return
    onSend(content)
    setText('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Group: show sender header only when sender changes or >3 min gap
  const grouped = messages.map((msg, i) => {
    const prev = messages[i - 1]
    const sameSender = prev?.sender_id === msg.sender_id
    const gap = prev
      ? (new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) / 60000
      : 99
    return { msg, showHeader: !sameSender || gap > 3 }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', direction: 'rtl' }}>

      {/* ── Header ────────────────────────────────── */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid var(--ws-border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'rgba(96,165,250,0.1)',
          border: '1px solid rgba(96,165,250,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#60a5fa', flexShrink: 0,
        }}>
          <MessageSquare size={19} />
        </div>
        <div>
          <h2 style={{ color: 'var(--ws-text)', fontSize: '16px', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
            گفتگوی تیمی
          </h2>
          <p style={{ color: 'var(--ws-text-muted)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            {members.length} عضو · {project.title}
          </p>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────── */}
      <div
        className="ws-scroll"
        style={{
          flex: 1, overflowY: 'auto',
          padding: '20px 28px',
          display: 'flex', flexDirection: 'column', gap: '2px',
          direction: 'ltr',       // own = right, other = left
        }}
      >
        {messages.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: '14px', opacity: 0.45,
          }}>
            <MessageSquare size={44} style={{ color: 'var(--ws-text-muted)' }} />
            <p style={{ color: 'var(--ws-text-muted)', fontSize: '14px', direction: 'rtl', margin: 0 }}>
              هنوز پیامی ارسال نشده — اولین نفر باشید!
            </p>
          </div>
        )}

        {grouped.map(({ msg, showHeader }) => {
          const isOwn = msg.sender_id === userId
          const name = memberMap[msg.sender_id] || 'کاربر'
          const initial = name[0]?.toUpperCase() || 'U'

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: isOwn ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
                marginTop: showHeader ? '18px' : '2px',
              }}
            >
              {/* Avatar */}
              {showHeader ? (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: isOwn ? 'var(--ws-gold-glow)' : 'rgba(96,165,250,0.1)',
                  border: `1px solid ${isOwn ? 'var(--ws-gold-border)' : 'rgba(96,165,250,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isOwn ? 'var(--ws-gold)' : '#60a5fa',
                  fontSize: '11px', fontWeight: 700,
                }}>
                  {initial}
                </div>
              ) : (
                <div style={{ width: '30px', flexShrink: 0 }} />
              )}

              {/* Bubble */}
              <div style={{ maxWidth: '62%' }}>
                {showHeader && !isOwn && (
                  <div style={{
                    color: 'var(--ws-text-muted)', fontSize: '11px',
                    marginBottom: '4px', paddingLeft: '4px',
                    direction: 'rtl',
                  }}>
                    {name}
                  </div>
                )}
                <div style={{
                  background: isOwn ? 'var(--ws-gold-glow)' : 'var(--ws-card-high)',
                  border: `1px solid ${isOwn ? 'var(--ws-gold-border)' : 'var(--ws-border)'}`,
                  borderRadius: isOwn
                    ? '16px 4px 16px 16px'
                    : '4px 16px 16px 16px',
                  padding: '10px 14px',
                  transition: 'border-color 0.2s',
                }}>
                  <p style={{
                    color: 'var(--ws-text)', fontSize: '14px', lineHeight: 1.65,
                    margin: 0, direction: 'rtl',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </p>
                  <p style={{
                    color: 'var(--ws-text-dim)', fontSize: '10px',
                    margin: '5px 0 0',
                    textAlign: isOwn ? 'right' : 'left',
                    direction: 'ltr',
                  }}>
                    {fmtMsgDate(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ─────────────────────────────────── */}
      <div style={{
        padding: '14px 28px 18px',
        borderTop: '1px solid var(--ws-border)',
        flexShrink: 0,
        background: 'var(--ws-card-high)',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            className="ws-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="پیام خود را بنویسید... (Enter برای ارسال)"
            rows={1}
            style={{
              flex: 1, resize: 'none',
              minHeight: '44px', maxHeight: '120px',
              lineHeight: '22px',
              paddingTop: '11px', paddingBottom: '11px',
              direction: 'rtl',
              fontFamily: 'inherit',
              overflowY: 'auto',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="ws-btn ws-btn-primary"
            style={{ height: '44px', padding: '0 18px', flexShrink: 0, gap: '6px' }}
          >
            <Send size={14} />
            ارسال
          </button>
        </div>
        <p style={{ color: 'var(--ws-text-dim)', fontSize: '11px', marginTop: '6px', direction: 'rtl' }}>
          Enter برای ارسال · Shift+Enter برای خط جدید
        </p>
      </div>
    </div>
  )
}

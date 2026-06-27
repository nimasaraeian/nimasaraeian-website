'use client'

import { Plus, Trash2, ArrowRight, Eye, Edit3 } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DISPLAY_NAME, fmtDate } from '../lib'
import type { Note, Project } from '../types'

type Props = {
  project: Project
  notes: Note[]
  selNote: Note | null
  noteTitle: string
  noteContent: string
  saving: boolean
  onCreate: () => void
  onOpen: (n: Note) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onCloseEditor: () => void
  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
}

export default function NotesPanel({
  project, notes, selNote, noteTitle, noteContent, saving,
  onCreate, onOpen, onDelete, onCloseEditor, onTitleChange, onContentChange,
}: Props) {
  const [mode, setMode] = useState<'edit' | 'preview'>('preview')

  /* ── Note editor view ───────────────────── */
  if (selNote) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="ws-animate-in">

        {/* Toolbar */}
        <div style={{
          height: '52px', borderBottom: '1px solid var(--ws-border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: '12px', flexShrink: 0,
          background: 'var(--ws-sidebar)',
        }}>
          <button
            onClick={onCloseEditor}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--ws-text-muted)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', transition: 'color .2s',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'var(--ws-text)')}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'var(--ws-text-muted)')}
          >
            <ArrowRight size={15} />
            بازگشت
          </button>

          <div style={{ flex: 1 }} />

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'var(--ws-card)',
            border: '1px solid var(--ws-border)', borderRadius: '8px',
            padding: '3px', gap: '2px',
          }}>
            <button
              onClick={() => setMode('preview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '6px', border: 'none',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                background: mode === 'preview' ? 'var(--ws-border-light)' : 'none',
                color: mode === 'preview' ? 'var(--ws-text)' : 'var(--ws-text-muted)',
                transition: 'all .15s',
              }}
            >
              <Eye size={13} /> نمایش
            </button>
            <button
              onClick={() => setMode('edit')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '6px', border: 'none',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                background: mode === 'edit' ? 'var(--ws-border-light)' : 'none',
                color: mode === 'edit' ? 'var(--ws-text)' : 'var(--ws-text-muted)',
                transition: 'all .15s',
              }}
            >
              <Edit3 size={13} /> ویرایش
            </button>
          </div>

          <span style={{
            fontSize: '11px',
            color: saving ? 'var(--ws-gold)' : 'var(--ws-text-dim)',
          }}>
            {saving ? 'در حال ذخیره...' : '✓ ذخیره شد'}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--ws-bg)' }} className="ws-scroll">
          {mode === 'edit' ? (
            <div className="ws-note-editor-inner" style={{ padding: 'clamp(20px,5vw,32px) clamp(16px,6vw,48px)', maxWidth: '800px', margin: '0 auto' }}>
              <input
                value={noteTitle}
                onChange={e => onTitleChange(e.target.value)}
                placeholder="عنوان یادداشت"
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  fontSize: '24px', fontWeight: 700, color: 'var(--ws-text)',
                  background: 'transparent', fontFamily: 'inherit',
                  direction: 'rtl', marginBottom: '8px', boxSizing: 'border-box',
                }}
              />
              <textarea
                value={noteContent}
                onChange={e => onContentChange(e.target.value)}
                placeholder="شروع به نوشتن... (از Markdown پشتیبانی می‌شود)"
                style={{
                  width: '100%', minHeight: '60vh', border: 'none', outline: 'none',
                  resize: 'none', fontSize: '14px', lineHeight: 2,
                  color: 'var(--ws-text-muted)', background: 'transparent',
                  fontFamily: 'inherit', direction: 'rtl', boxSizing: 'border-box',
                }}
              />
            </div>
          ) : (
            <div className="ws-note-editor-inner" style={{ padding: 'clamp(20px,5vw,32px) clamp(16px,6vw,48px)', maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{
                color: 'var(--ws-text)', fontSize: '24px', fontWeight: 700,
                marginBottom: '6px', direction: 'rtl', textAlign: 'right',
              }}>
                {noteTitle || selNote.title}
              </h1>
              <p style={{
                color: 'var(--ws-text-dim)', fontSize: '11px',
                marginBottom: '28px', direction: 'rtl', textAlign: 'right',
              }}>
                {fmtDate(selNote.updated_at)}
              </p>
              <div className="ws-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {noteContent || '*این یادداشت خالی است*'}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Notes list view ────────────────────── */
  return (
    <div className="ws-animate-in ws-mobile-padded" style={{ padding: 'clamp(16px,4vw,32px) clamp(16px,4vw,36px)' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '28px', direction: 'rtl',
      }}>
        <div>
          <div style={{
            color: 'var(--ws-text-muted)', fontSize: '11px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: '6px', fontFamily: 'Georgia, serif',
          }}>
            یادداشت‌ها
          </div>
          <h1 style={{ color: 'var(--ws-text)', fontSize: '22px', fontWeight: 700 }}>
            {DISPLAY_NAME(project.title)}
          </h1>
        </div>
        <button onClick={onCreate} className="ws-btn ws-btn-primary">
          <Plus size={15} /> یادداشت جدید
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="ws-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📝</div>
          <p style={{ color: 'var(--ws-text-muted)', marginBottom: '20px' }}>
            هنوز یادداشتی ثبت نشده
          </p>
          <button onClick={onCreate} className="ws-btn ws-btn-primary">
            اولین یادداشت را بسازید
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
        }}>
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => { onOpen(n); setMode('preview') }}
              className="ws-note-card"
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '10px', direction: 'rtl',
              }}>
                <h3 style={{
                  color: 'var(--ws-text)', fontWeight: 600, fontSize: '14px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                }}>
                  {n.title}
                </h3>
                <button
                  onClick={e => onDelete(n.id, e)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--ws-text-dim)',
                    cursor: 'pointer', flexShrink: 0, marginRight: '8px',
                    padding: '2px', borderRadius: '4px', transition: 'color .2s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'var(--ws-danger)')}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'var(--ws-text-dim)')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <p style={{
                color: 'var(--ws-text-muted)', fontSize: '12px', lineHeight: 1.7,
                marginBottom: '14px',
                display: '-webkit-box', overflow: 'hidden',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                direction: 'rtl',
              }}>
                {n.content?.replace(/[#*`|_>]/g, '').trim() || 'خالی'}
              </p>
              <p style={{ color: 'var(--ws-text-dim)', fontSize: '11px', direction: 'rtl' }}>
                {fmtDate(n.updated_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

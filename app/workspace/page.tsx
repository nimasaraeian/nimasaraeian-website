'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { QUESTIONS, SECTIONS } from './data'
import type { QStatus } from './data'

type Project = { id: string; title: string; description: string | null; color: string; owner_id: string }
type ProjectWithRole = { role: 'owner'|'member'; project: Project }
type Note = { id: string; title: string; content: string; project_id: string; created_at: string; updated_at: string }
type FileRecord = { id: string; name: string; size: number; mime_type: string; storage_path: string; project_id: string; created_at: string }
type Member = { id: string; user_id: string; role: 'owner'|'member'; joined_at: string; email?: string }
type QAnswer = { question_id: string; answer: string; status: QStatus; note: string }
type View = 'overview'|'questionnaire'|'question'|'notes'|'files'|'members'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const IS_LOAN = (t: string) => t.includes('تسهیلات') || t.includes('آتیه') || t.includes('وام') || t.includes('atieh') || t.toLowerCase().includes('financial')
const DISPLAY_NAME = (t: string) => IS_LOAN(t) ? 'Atieh Financial' : t
const AUTOSAVE = 1200

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr('Invalid email or password')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Times New Roman, Times, serif'
    }}>
      <Link href="/" style={{
        position: 'absolute', top: 32, left: 48, color: '#555', fontSize: '13px',
        textDecoration: 'none', letterSpacing: '0.05em', transition: 'color .2s'
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}
      >
        ← nimasaraeian.com
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ color: '#fff', fontSize: '28px', fontStyle: 'italic', letterSpacing: '0.02em', marginBottom: '8px' }}>
          Nima Saraeian
        </div>
        <div style={{ color: '#444', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Workspace
        </div>
      </div>

      <form onSubmit={submit} style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: '100%', padding: '13px 16px', background: '#0f0f0f',
              border: '1px solid #222', borderRadius: '6px', color: '#fff',
              fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              transition: 'border-color .2s', boxSizing: 'border-box'
            }}
            onFocus={e => (e.target.style.borderColor = '#555')}
            onBlur={e => (e.target.style.borderColor = '#222')}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: '100%', padding: '13px 16px', background: '#0f0f0f',
              border: '1px solid #222', borderRadius: '6px', color: '#fff',
              fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              transition: 'border-color .2s', boxSizing: 'border-box'
            }}
            onFocus={e => (e.target.style.borderColor = '#555')}
            onBlur={e => (e.target.style.borderColor = '#222')}
          />
        </div>
        {err && (
          <div style={{ marginBottom: '16px', color: '#888', fontSize: '13px', textAlign: 'center' }}>
            {err}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '13px', background: '#fff', color: '#000',
            border: 'none', borderRadius: '6px', fontSize: '14px',
            fontFamily: 'inherit', letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'opacity .2s', textTransform: 'uppercase'
          }}
        >
          {loading ? '...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

// ─── Workspace App ────────────────────────────────────────────────────────────
function WorkspaceApp({ session }: { session: Session }) {
  const user = session.user
  const [projects, setProjects] = useState<ProjectWithRole[]>([])
  const [selId, setSelId] = useState<string | null>(null)
  const [view, setView] = useState<View>('overview')
  const [selQId, setSelQId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [files, setFiles] = useState<FileRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [answers, setAnswers] = useState<Record<string, QAnswer>>({})
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<QStatus | ''>('')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [selNote, setSelNote] = useState<Note | null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [saving, setSaving] = useState(false)
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selP = projects.find(p => p.project.id === selId)
  const isOwner = selP?.role === 'owner'
  const isLoan = selP ? IS_LOAN(selP.project.title) : false

  const loadProjects = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) return
    const res = await fetch('/api/workspace/projects', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      const m = (data as any[]).map(d => ({ role: d.role, project: d.projects })).filter(d => d.project)
      setProjects(m)
      if (m.length > 0 && !selId) setSelId(m[0].project.id)
    }
  }

  useEffect(() => { loadProjects() }, [])
  useEffect(() => {
    if (!selId) return
    setView('overview'); setSelNote(null); setActiveSection(null)
    loadNotes(); loadFiles(); loadMembers()
    if (isLoan) loadAnswers()
  }, [selId])
  useEffect(() => { if (selId && isLoan) loadAnswers() }, [selId, isLoan])

  const loadNotes = async () => { const { data } = await supabase.from('notes').select('*').eq('project_id', selId!).order('updated_at', { ascending: false }); if (data) setNotes(data) }
  const loadFiles = async () => { const { data } = await supabase.from('files').select('*').eq('project_id', selId!).order('created_at', { ascending: false }); if (data) setFiles(data) }
  const loadMembers = async () => {
    const { data: md } = await supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id', selId!)
    if (!md) return
    const { data: pd } = await supabase.from('profiles').select('id,email').in('id', md.map(m => m.user_id))
    const pm: Record<string, string> = {}; pd?.forEach(p => { pm[p.id] = p.email })
    setMembers(md.map(m => ({ ...m, email: pm[m.user_id] })))
  }
  const loadAnswers = async () => {
    const { data } = await supabase.from('questionnaire_answers').select('question_id,answer,status,note').eq('project_id', selId!)
    if (data) { const m: Record<string, QAnswer> = {}; data.forEach((a: any) => { m[a.question_id] = a }); setAnswers(m) }
  }

  const totalQ = QUESTIONS.length
  const completedQ = QUESTIONS.filter(q => answers[q.id]?.status === 'completed').length
  const draftQ = QUESTIONS.filter(q => answers[q.id]?.status === 'draft').length
  const pct = totalQ ? Math.round(completedQ / totalQ * 100) : 0

  const filteredQ = QUESTIONS.filter(q => {
    if (activeSection && q.section !== activeSection) return false
    if (statusFilter) { const s = answers[q.id]?.status || 'unanswered'; if (s !== statusFilter) return false }
    if (search && !q.title.includes(search)) return false
    return true
  })

  const updateAnswer = async (qId: string, field: 'answer' | 'status' | 'note', value: string) => {
    setAnswers(prev => { const cur = prev[qId] || { question_id: qId, answer: '', status: 'unanswered', note: '' }; return { ...prev, [qId]: { ...cur, [field]: value } } })
    const cur = answers[qId] || { answer: '', status: 'unanswered' as QStatus, note: '' }
    await supabase.from('questionnaire_answers').upsert({
      project_id: selId!, question_id: qId,
      answer: field === 'answer' ? value : (cur.answer || ''),
      status: field === 'status' ? value : (cur.status || 'unanswered'),
      note: field === 'note' ? value : (cur.note || ''),
      updated_by: user.id, updated_at: new Date().toISOString()
    }, { onConflict: 'project_id,question_id' })
  }

  const openNote = (n: Note) => { setSelNote(n); setNoteTitle(n.title); setNoteContent(n.content); setView('notes') }
  const handleNoteChange = (f: 'title' | 'content', v: string) => {
    if (f === 'title') setNoteTitle(v); else setNoteContent(v)
    if (autosaveRef.current) clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => { const t = f === 'title' ? v : noteTitle; const c = f === 'content' ? v : noteContent; saveNote(t, c) }, AUTOSAVE)
  }
  const saveNote = async (title: string, content: string) => { if (!selNote) return; setSaving(true); await supabase.from('notes').update({ title, content }).eq('id', selNote.id); setSaving(false); setNotes(ns => ns.map(n => n.id === selNote.id ? { ...n, title, content } : n)) }
  const createNote = async () => { const { data } = await supabase.from('notes').insert({ title: 'New Note', content: '', project_id: selId!, author_id: user.id }).select().single(); if (data) { setNotes(ns => [data, ...ns]); openNote(data) } }
  const deleteNote = async (id: string, e: React.MouseEvent) => { e.stopPropagation(); await supabase.from('notes').delete().eq('id', id); setNotes(ns => ns.filter(n => n.id !== id)); if (selNote?.id === id) setSelNote(null) }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true)
    const path = `${selId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('workspace-files').upload(path, file)
    if (!error) { const { data } = await supabase.from('files').insert({ name: file.name, size: file.size, mime_type: file.type, storage_path: path, project_id: selId!, uploader_id: user.id }).select().single(); if (data) setFiles(fs => [data, ...fs]) }
    setUploading(false); e.target.value = ''
  }
  const downloadFile = async (f: FileRecord) => { const { data } = await supabase.storage.from('workspace-files').download(f.storage_path); if (data) { const url = URL.createObjectURL(data); const a = document.createElement('a'); a.href = url; a.download = f.name; a.click(); URL.revokeObjectURL(url) } }
  const deleteFile = async (f: FileRecord, e: React.MouseEvent) => { e.stopPropagation(); await supabase.storage.from('workspace-files').remove([f.storage_path]); await supabase.from('files').delete().eq('id', f.id); setFiles(fs => fs.filter(x => x.id !== f.id)) }

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selId) return; setInviting(true); setInviteMsg('')
    try { const res = await fetch('/api/workspace/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: inviteEmail, projectId: selId, inviterId: user.id }) }); const j = await res.json(); if (j.error) setInviteMsg('Error: ' + j.error); else { setInviteMsg('Invitation sent ✓'); setInviteEmail(''); await loadMembers() } } catch { setInviteMsg('Failed to send') }
    setInviting(false)
  }

  const fmtSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })
  const fileIcon = (mime: string) => mime?.startsWith('image/') ? '▣' : mime?.includes('pdf') ? '▤' : mime?.includes('word') ? '▦' : '▪'
  const statusColor = (s: QStatus | undefined) => s === 'completed' ? '#4ade80' : s === 'draft' ? '#fbbf24' : '#333'

  // nav items
  const navItems: { id: View; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(isLoan ? [{ id: 'questionnaire' as View, label: 'Questionnaire' }] : []),
    { id: 'notes', label: 'Notes' },
    { id: 'files', label: 'Files' },
    ...(isOwner ? [{ id: 'members' as View, label: 'Members' }] : []),
  ]

  // ── Note editor ──
  if (view === 'notes' && selNote) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', fontFamily: 'Times New Roman, Times, serif' }}>
        <div style={{ height: '56px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', flexShrink: 0 }}>
          <button onClick={() => setSelNote(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
            ← Back
          </button>
          <span style={{ color: '#333', fontSize: '12px' }}>
            {DISPLAY_NAME(selP?.project.title || '')} › {selNote.title}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '12px', color: saving ? '#888' : '#333' }}>{saving ? 'Saving...' : 'Saved'}</span>
        </div>
        <input
          value={noteTitle}
          onChange={e => handleNoteChange('title', e.target.value)}
          style={{ border: 'none', outline: 'none', fontSize: '28px', fontWeight: 400, padding: '40px 48px 8px', fontFamily: 'inherit', color: '#fff', background: '#000', width: '100%', boxSizing: 'border-box' }}
          placeholder="Note title"
        />
        <div style={{ padding: '0 48px 12px', fontSize: '12px', color: '#333' }}>{fmtDate(selNote.updated_at)}</div>
        <textarea
          value={noteContent}
          onChange={e => handleNoteChange('content', e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', padding: '0 48px 48px', fontFamily: 'inherit', fontSize: '16px', lineHeight: 1.9, color: '#999', background: '#000' }}
          placeholder="Start writing..."
        />
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#000', fontFamily: 'Times New Roman, Times, serif', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: '240px', flexShrink: 0, borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Back to site */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1a1a1a' }}>
          <Link href="/" style={{ color: '#444', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}
          >
            ← nimasaraeian.com
          </Link>
          <div style={{ color: '#fff', fontSize: '14px', letterSpacing: '0.05em' }}>Workspace</div>
          <div style={{ color: '#444', fontSize: '11px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>

        {/* Projects */}
        <div style={{ padding: '16px 12px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ color: '#333', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Projects</div>
          {projects.length === 0 && (
            <div style={{ color: '#333', fontSize: '12px', padding: '8px', textAlign: 'center' }}>No projects</div>
          )}
          {projects.map(({ project, role }) => (
            <button
              key={project.id}
              onClick={() => setSelId(project.id)}
              style={{
                width: '100%', textAlign: 'left', background: selId === project.id ? '#111' : 'none',
                border: 'none', borderRadius: '4px', padding: '8px 10px', cursor: 'pointer',
                color: selId === project.id ? '#fff' : '#666', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'all .15s',
                marginBottom: '2px'
              }}
              onMouseEnter={e => { if (selId !== project.id) e.currentTarget.style.color = '#aaa' }}
              onMouseLeave={e => { if (selId !== project.id) e.currentTarget.style.color = '#666' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.color, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{DISPLAY_NAME(project.title)}</span>
              {role === 'owner' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#333' }}>owner</span>}
            </button>
          ))}

          {/* Project nav */}
          {selId && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ color: '#333', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
                {DISPLAY_NAME(selP?.project.title || '')}
              </div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setSelNote(null) }}
                  style={{
                    width: '100%', textAlign: 'left', background: (view === item.id || (item.id === 'notes' && view === 'notes')) ? '#111' : 'none',
                    border: 'none', borderRadius: '4px', padding: '7px 10px', cursor: 'pointer',
                    color: view === item.id ? '#fff' : '#555', fontSize: '13px', transition: 'all .15s', marginBottom: '1px',
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={e => { if (view !== item.id) e.currentTarget.style.color = '#aaa' }}
                  onMouseLeave={e => { if (view !== item.id) e.currentTarget.style.color = '#555' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #1a1a1a' }}>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888')}
            onMouseLeave={e => (e.currentTarget.style.color = '#333')}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#000' }}>

        {/* No project selected */}
        {!selId && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#333', fontSize: '14px', letterSpacing: '0.1em' }}>
            Select a project
          </div>
        )}

        {/* ── Overview ── */}
        {selId && view === 'overview' && (
          <div style={{ padding: '48px 48px 64px', maxWidth: '720px' }}>
            <div style={{ marginBottom: '8px', color: '#444', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Project</div>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 400, marginBottom: '16px', lineHeight: 1.3 }}>
              {DISPLAY_NAME(selP?.project.title || '')}
            </h1>
            {selP?.project.description && (
              <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, marginBottom: '40px' }}>{selP.project.description}</p>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '6px', overflow: 'hidden', marginBottom: '40px' }}>
              {[
                { label: 'Notes', value: notes.length },
                { label: 'Files', value: files.length },
                { label: 'Members', value: members.length },
                ...(isLoan ? [
                  { label: 'Questions', value: totalQ },
                  { label: 'Completed', value: completedQ },
                  { label: 'Progress', value: pct + '%' },
                ] : [])
              ].map((s, i) => (
                <div key={i} style={{ background: '#000', padding: '24px 20px' }}>
                  <div style={{ color: '#444', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ color: '#fff', fontSize: '28px', fontWeight: 300 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Progress bar if loan */}
            {isLoan && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#444', fontSize: '12px', letterSpacing: '0.1em' }}>QUESTIONNAIRE PROGRESS</span>
                  <span style={{ color: '#fff', fontSize: '12px' }}>{pct}%</span>
                </div>
                <div style={{ height: '1px', background: '#111' }}>
                  <div style={{ height: '1px', background: '#fff', width: pct + '%', transition: 'width .5s' }} />
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {isLoan && (
                <button onClick={() => setView('questionnaire')} style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
                >Open Questionnaire</button>
              )}
              <button onClick={() => setView('notes')} style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
              >View Notes</button>
              <button onClick={() => setView('files')} style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
              >View Files</button>
            </div>
          </div>
        )}

        {/* ── Questionnaire ── */}
        {selId && view === 'questionnaire' && (
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Section sidebar */}
            <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #1a1a1a', padding: '32px 0', overflowY: 'auto' }}>
              <div style={{ color: '#333', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 16px', marginBottom: '12px' }}>Sections</div>
              <button onClick={() => setActiveSection(null)} style={{ width: '100%', textAlign: 'left', background: activeSection === null ? '#111' : 'none', border: 'none', padding: '7px 16px', cursor: 'pointer', color: activeSection === null ? '#fff' : '#555', fontSize: '12px', fontFamily: 'inherit' }}>All</button>
              {SECTIONS.map(s => {
                const done = QUESTIONS.filter(q => q.section === s.id && answers[q.id]?.status === 'completed').length
                const total = QUESTIONS.filter(q => q.section === s.id).length
                return (
                  <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ width: '100%', textAlign: 'left', background: activeSection === s.id ? '#111' : 'none', border: 'none', padding: '7px 16px', cursor: 'pointer', color: activeSection === s.id ? '#fff' : '#555', fontSize: '12px', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'right', direction: 'rtl' }}>{s.title}</span>
                    <span style={{ color: '#333', fontSize: '10px', marginLeft: '8px', flexShrink: 0 }}>{done}/{total}</span>
                  </button>
                )
              })}
            </div>

            {/* Questions list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{ flex: 1, padding: '8px 12px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '4px', color: '#fff', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as QStatus | '')} style={{ padding: '8px 12px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '4px', color: '#888', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }}>
                  <option value="">All Status</option>
                  <option value="unanswered">Unanswered</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '16px' }}>{filteredQ.length} questions</div>

              {filteredQ.map(q => {
                const status = answers[q.id]?.status || 'unanswered'
                return (
                  <div key={q.id} onClick={() => { setSelQId(q.id); setView('question') }} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #111', marginBottom: '4px', transition: 'border-color .15s', background: '#000' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#111')}
                  >
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: statusColor(status as QStatus), marginTop: '6px', flexShrink: 0 }} />
                    <div style={{ flex: 1, direction: 'rtl', textAlign: 'right' }}>
                      <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>{q.title}</div>
                      <div style={{ color: '#333', fontSize: '11px', marginTop: '4px' }}>
                        {q.required && <span style={{ marginLeft: '8px', color: '#555' }}>Required</span>}
                        <span style={{ color: status === 'completed' ? '#4ade80' : status === 'draft' ? '#fbbf24' : '#444' }}>
                          {status === 'completed' ? 'Completed' : status === 'draft' ? 'Draft' : 'Unanswered'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Question detail ── */}
        {selId && view === 'question' && selQId && (() => {
          const q = QUESTIONS.find(x => x.id === selQId)!
          const ans = answers[selQId] || { answer: '', status: 'unanswered', note: '' }
          return (
            <div style={{ padding: '32px 48px', maxWidth: '760px' }}>
              <button onClick={() => setView('questionnaire')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', marginBottom: '32px', display: 'block' }}>← Back to Questionnaire</button>
              <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '12px' }}>SECTION {q.section}</div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, lineHeight: 1.6, marginBottom: '12px', direction: 'rtl', textAlign: 'right' }}>{q.title}</h2>
              {q.guidance && <p style={{ color: '#444', fontSize: '13px', lineHeight: 1.8, marginBottom: '32px', direction: 'rtl', textAlign: 'right' }}>{q.guidance}</p>}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>ANSWER</div>
                <textarea
                  value={ans.answer}
                  onChange={e => updateAnswer(selQId, 'answer', e.target.value)}
                  placeholder="Write your answer..."
                  rows={6}
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px', color: '#ccc', fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.7, direction: 'rtl', textAlign: 'right', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>NOTES</div>
                <textarea
                  value={ans.note}
                  onChange={e => updateAnswer(selQId, 'note', e.target.value)}
                  placeholder="Internal notes..."
                  rows={3}
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px', color: '#666', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.7, direction: 'rtl', textAlign: 'right', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {(['unanswered', 'draft', 'completed'] as QStatus[]).map(s => (
                  <button key={s} onClick={() => updateAnswer(selQId, 'status', s)} style={{ padding: '8px 16px', background: ans.status === s ? '#fff' : 'none', border: '1px solid ' + (ans.status === s ? '#fff' : '#222'), color: ans.status === s ? '#000' : '#555', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .15s' }}>
                    {s === 'unanswered' ? 'Unanswered' : s === 'draft' ? 'Draft' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Notes ── */}
        {selId && view === 'notes' && !selNote && (
          <div style={{ padding: '40px 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ color: '#444', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Notes</div>
                <div style={{ color: '#fff', fontSize: '22px', fontWeight: 400 }}>{DISPLAY_NAME(selP?.project.title || '')}</div>
              </div>
              <button onClick={createNote} style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
              >
                + New Note
              </button>
            </div>
            {notes.length === 0 && <div style={{ color: '#333', fontSize: '13px' }}>No notes yet</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: '#111' }}>
              {notes.map(n => (
                <div key={n.id} onClick={() => openNote(n)} style={{ background: '#000', padding: '24px', cursor: 'pointer', transition: 'background .15s', position: 'relative' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0a0a0a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#000')}
                >
                  <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                  <div style={{ color: '#333', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '16px' }}>{n.content || 'Empty'}</div>
                  <div style={{ color: '#222', fontSize: '11px' }}>{fmtDate(n.updated_at)}</div>
                  <button onClick={e => deleteNote(n.id, e)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#222', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#222')}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Files ── */}
        {selId && view === 'files' && (
          <div style={{ padding: '40px 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ color: '#444', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Files</div>
                <div style={{ color: '#fff', fontSize: '22px', fontWeight: 400 }}>{DISPLAY_NAME(selP?.project.title || '')}</div>
              </div>
              <label style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: uploading ? '#555' : '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all .2s' }}
                onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = uploading ? '#555' : '#888' }}
              >
                {uploading ? 'Uploading...' : '+ Upload File'}
                <input type="file" style={{ display: 'none' }} onChange={uploadFile} disabled={uploading} />
              </label>
            </div>
            {files.length === 0 && <div style={{ color: '#333', fontSize: '13px' }}>No files yet</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#111' }}>
              {files.map(f => (
                <div key={f.id} style={{ background: '#000', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#333', fontSize: '16px' }}>{fileIcon(f.mime_type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#ccc', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div style={{ color: '#333', fontSize: '11px', marginTop: '2px' }}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</div>
                  </div>
                  <button onClick={() => downloadFile(f)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', marginRight: '8px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                  >Download</button>
                  {isOwner && <button onClick={e => deleteFile(f, e)} style={{ background: 'none', border: 'none', color: '#222', cursor: 'pointer', fontSize: '16px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#222')}
                  >×</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Members ── */}
        {selId && view === 'members' && isOwner && (
          <div style={{ padding: '40px 48px', maxWidth: '640px' }}>
            <div style={{ color: '#444', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Members</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 400, marginBottom: '32px' }}>{DISPLAY_NAME(selP?.project.title || '')}</div>

            {/* Invite */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '12px' }}>INVITE BY EMAIL</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  style={{ flex: 1, padding: '10px 14px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px', color: '#fff', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
                />
                <button onClick={inviteMember} disabled={inviting} style={{ padding: '10px 20px', background: 'none', border: '1px solid #222', color: inviting ? '#555' : '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', transition: 'all .2s' }}>
                  {inviting ? '...' : 'Invite'}
                </button>
              </div>
              {inviteMsg && <div style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>{inviteMsg}</div>}
            </div>

            {/* Members list */}
            <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '12px' }}>CURRENT MEMBERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#111' }}>
              {members.map(m => (
                <div key={m.id} style={{ background: '#000', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#444', fontSize: '11px' }}>{(m.email || '?')[0].toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ccc', fontSize: '13px' }}>{m.email || m.user_id.slice(0, 8)}</div>
                    <div style={{ color: '#333', fontSize: '11px' }}>{m.role}</div>
                  </div>
                  {m.user_id !== user.id && (
                    <button onClick={() => { supabase.from('project_members').delete().eq('id', m.id); setMembers(ms => ms.filter(x => x.id !== m.id)) }} style={{ background: 'none', border: 'none', color: '#222', cursor: 'pointer', fontSize: '16px' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#222')}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#222', fontSize: '13px', fontFamily: 'Times New Roman, serif', letterSpacing: '0.1em' }}>...</div>
    </div>
  )
  if (!session) return <LoginPage />
  return <WorkspaceApp session={session} />
}

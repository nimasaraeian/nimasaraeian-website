'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { QUESTIONS } from '../data'
import type { QStatus } from '../data'
import {
  supabase,
  IS_LOAN,
  AUTOSAVE_MS,
  PROJECT_COLORS,
  DISPLAY_NAME,
} from '../lib'
import type {
  ProjectWithRole,
  Note,
  FileRecord,
  Member,
  QAnswer,
  Message,
  View,
} from '../types'
import Sidebar from './Sidebar'
import IconNav from './IconNav'
import OverviewPanel from './OverviewPanel'
import NotesPanel from './NotesPanel'
import FilesPanel from './FilesPanel'
import MembersPanel from './MembersPanel'
import ChatPanel from './ChatPanel'
import QuestionnairePanel from './QuestionnairePanel'
import QuestionDetailPanel from './QuestionDetailPanel'
import EmptyProjectsWelcome from './EmptyProjectsWelcome'
import LoadingScreen from './LoadingScreen'
import { LayoutDashboard, MessageSquare, FileText, FolderOpen, ClipboardList } from 'lucide-react'

export default function WorkspaceApp({ session }: { session: Session }) {
  const user = session.user

  const [projects, setProjects] = useState<ProjectWithRole[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [selId, setSelId] = useState<string | null>(null)
  const [view, setView] = useState<View>('overview')
  const [selQId, setSelQId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [files, setFiles] = useState<FileRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [answers, setAnswers] = useState<Record<string, QAnswer>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)
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
  const [showNewProject, setShowNewProject] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteTitleRef = useRef('')
  const noteContentRef = useRef('')

  const selP = projects.find((p) => p.project.id === selId)
  const isOwner = selP?.role === 'owner'
  const isLoan = selP ? IS_LOAN(selP.project.title) : false

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    const { data: { session: s } } = await supabase.auth.getSession()
    const token = s?.access_token
    if (!token) {
      setProjectsLoading(false)
      return
    }
    const res = await fetch('/api/workspace/projects', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (Array.isArray(data)) {
      const mapped = (data as { role: string; projects: ProjectWithRole['project'] }[])
        .map((d) => ({ role: d.role as 'owner' | 'member', project: d.projects }))
        .filter((d) => d.project) as ProjectWithRole[]
      setProjects(mapped)
      if (mapped.length > 0) {
        setSelId((prev) => prev ?? mapped[0].project.id)
      }
    }
    setProjectsLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const loadNotes = useCallback(async () => {
    if (!selId) return
    const { data } = await supabase.from('notes').select('*').eq('project_id', selId).order('updated_at', { ascending: false })
    if (data) setNotes(data)
  }, [selId])

  const loadFiles = useCallback(async () => {
    if (!selId) return
    const { data } = await supabase.from('files').select('*').eq('project_id', selId).order('created_at', { ascending: false })
    if (data) setFiles(data)
  }, [selId])

  const loadMembers = useCallback(async () => {
    if (!selId) return
    const { data: md } = await supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id', selId)
    if (!md) return
    const { data: pd } = await supabase.from('profiles').select('id,email').in('id', md.map((m) => m.user_id))
    const pm: Record<string, string> = {}
    pd?.forEach((p) => { pm[p.id] = p.email })
    setMembers(md.map((m) => ({ ...m, email: pm[m.user_id] })))
  }, [selId])

  const loadAnswers = useCallback(async () => {
    if (!selId) return
    const { data } = await supabase
      .from('questionnaire_answers')
      .select('question_id,answer,status,note')
      .eq('project_id', selId)
    if (data) {
      const m: Record<string, QAnswer> = {}
      data.forEach((a: QAnswer) => { m[a.question_id] = a })
      setAnswers(m)
    }
  }, [selId])

  const loadMessages = useCallback(async () => {
    if (!selId) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', selId)
      .order('created_at', { ascending: true })
      .limit(200)
    if (data) setMessages(data)
  }, [selId])

  useEffect(() => {
    if (!selId) return
    setView('overview')
    setSelNote(null)
    setActiveSection(null)
    setMessages([])
    setAnswers({})
    loadNotes()
    loadFiles()
    loadMembers()
    loadMessages()
    if (isLoan) loadAnswers()
  }, [selId, isLoan, loadNotes, loadFiles, loadMembers, loadAnswers, loadMessages])

  // Real-time: receive new messages live
  useEffect(() => {
    if (!selId) return
    const channel = supabase
      .channel(`messages-${selId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${selId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selId])

  const selectProject = (id: string) => {
    setSelId(id)
    setSelQId(null)
  }

  const setNavView = (v: View) => {
    setView(v)
    setSelNote(null)
    setSelQId(null)
  }

  const createProject = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
    const { data, error } = await supabase
      .from('projects')
      .insert({ title: newTitle.trim(), description: null, color, owner_id: user.id })
      .select()
      .single()
    if (!error && data) {
      const entry: ProjectWithRole = { role: 'owner', project: data }
      setProjects((prev) => [...prev, entry])
      setSelId(data.id)
      setShowNewProject(false)
      setNewTitle('')
    }
    setCreating(false)
  }

  const totalQ = QUESTIONS.length
  const completedQ = QUESTIONS.filter((q) => answers[q.id]?.status === 'completed').length
  const pct = totalQ ? Math.round((completedQ / totalQ) * 100) : 0

  const updateAnswer = async (qId: string, field: 'answer' | 'status' | 'note', value: string) => {
    const cur = answers[qId] || { question_id: qId, answer: '', status: 'unanswered' as QStatus, note: '' }
    const next: QAnswer = { ...cur, [field]: value }
    setAnswers((prev) => ({ ...prev, [qId]: next }))
    await supabase.from('questionnaire_answers').upsert(
      {
        project_id: selId!,
        question_id: qId,
        answer: next.answer,
        status: next.status,
        note: next.note,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,question_id' }
    )
  }

  const openNote = (n: Note) => {
    setSelNote(n)
    setNoteTitle(n.title)
    setNoteContent(n.content)
    noteTitleRef.current = n.title
    noteContentRef.current = n.content
    setView('notes')
  }

  const saveNote = async (title: string, content: string) => {
    if (!selNote) return
    setSaving(true)
    await supabase.from('notes').update({ title, content }).eq('id', selNote.id)
    setSaving(false)
    setNotes((ns) => ns.map((n) => (n.id === selNote.id ? { ...n, title, content } : n)))
  }

  const handleNoteChange = (field: 'title' | 'content', value: string) => {
    if (field === 'title') {
      setNoteTitle(value)
      noteTitleRef.current = value
    } else {
      setNoteContent(value)
      noteContentRef.current = value
    }
    if (autosaveRef.current) clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      saveNote(noteTitleRef.current, noteContentRef.current)
    }, AUTOSAVE_MS)
  }

  const createNote = async () => {
    const { data } = await supabase
      .from('notes')
      .insert({ title: 'یادداشت جدید', content: '', project_id: selId!, author_id: user.id })
      .select()
      .single()
    if (data) {
      setNotes((ns) => [data, ...ns])
      openNote(data)
    }
  }

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await supabase.from('notes').delete().eq('id', id)
    setNotes((ns) => ns.filter((n) => n.id !== id))
    if (selNote?.id === id) setSelNote(null)
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${selId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('workspace-files').upload(path, file)
    if (!error) {
      const { data } = await supabase
        .from('files')
        .insert({
          name: file.name,
          size: file.size,
          mime_type: file.type,
          storage_path: path,
          project_id: selId!,
          uploader_id: user.id,
        })
        .select()
        .single()
      if (data) setFiles((fs) => [data, ...fs])
    }
    setUploading(false)
    e.target.value = ''
  }

  const downloadFile = async (f: FileRecord) => {
    const { data } = await supabase.storage.from('workspace-files').download(f.storage_path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = f.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const deleteFile = async (f: FileRecord, e: React.MouseEvent) => {
    e.stopPropagation()
    await supabase.storage.from('workspace-files').remove([f.storage_path])
    await supabase.from('files').delete().eq('id', f.id)
    setFiles((fs) => fs.filter((x) => x.id !== f.id))
  }

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selId) return
    setInviting(true)
    setInviteMsg('')
    try {
      const res = await fetch('/api/workspace/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, projectId: selId, inviterId: user.id }),
      })
      const j = await res.json()
      if (j.error) setInviteMsg('خطا: ' + j.error)
      else {
        setInviteMsg('دعوت‌نامه ارسال شد ✓')
        setInviteEmail('')
        await loadMembers()
      }
    } catch {
      setInviteMsg('ارسال ناموفق بود')
    }
    setInviting(false)
  }

  const sendMessage = async (content: string) => {
    if (!selId) return
    setSending(true)
    const { data } = await supabase
      .from('messages')
      .insert({ project_id: selId, sender_id: user.id, content })
      .select()
      .single()
    if (data) setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]))
    setSending(false)
  }

  if (projectsLoading) return <LoadingScreen />

  const hasProjects = projects.length > 0 && selId && selP

  const userInitial = (user.email?.[0] || 'N').toUpperCase()

  const viewLabels: Record<string, string> = {
    overview: 'نمای کلی', chat: 'گفتگو', notes: 'یادداشت‌ها',
    files: 'فایل‌ها', members: 'اعضا', questionnaire: 'پرسش‌نامه', question: 'پرسش‌نامه',
  }
  const mobileNavItems = [
    { id: 'overview' as View,       label: 'خانه',    Icon: LayoutDashboard, color: '#d4a843' },
    { id: 'chat' as View,           label: 'گفتگو',   Icon: MessageSquare,   color: '#0d9488' },
    { id: 'notes' as View,          label: 'یادداشت', Icon: FileText,        color: '#3b82f6' },
    { id: 'files' as View,          label: 'فایل',    Icon: FolderOpen,      color: '#8b5cf6' },
    ...(isLoan ? [{ id: 'questionnaire' as View, label: 'پرسش‌نامه', Icon: ClipboardList, color: '#d4a843' }] : []),
  ]
  const mobileActiveView = view === 'question' ? 'questionnaire' : view

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Mobile sticky header ────────────────── */}
      <div className="ws-mobile-header">
        <div style={{ minWidth: 0, flex: 1 }}>
          {projects.length > 1 ? (
            <select
              value={selId || ''}
              onChange={(e) => selectProject(e.target.value)}
              style={{
                fontFamily: 'Vazirmatn, inherit', fontSize: '15px', fontWeight: 700,
                color: 'var(--ws-text)', background: 'transparent',
                border: 'none', outline: 'none', cursor: 'pointer',
                direction: 'rtl', maxWidth: '200px', padding: 0,
              }}
            >
              {projects.map(({ project }) => (
                <option key={project.id} value={project.id}>{DISPLAY_NAME(project.title)}</option>
              ))}
            </select>
          ) : (
            <div className="ws-mobile-header-title">
              {selP ? DISPLAY_NAME(selP.project.title) : 'Workspace'}
            </div>
          )}
          {selP && <div className="ws-mobile-header-sub">{viewLabels[view] || ''}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {selP && (
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: selP.project.color }} />
          )}
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1.5px solid #fbbf24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#92400e', fontWeight: 800, fontSize: '14px',
          }}>
            {userInitial}
          </div>
        </div>
      </div>

      {/* ── Three-column (desktop) / Full-screen (mobile) ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <main className="flex-1 min-h-0 overflow-hidden bg-[var(--ws-bg)] flex flex-col">
        {!hasProjects ? (
          <EmptyProjectsWelcome
            showNewProject={showNewProject}
            newTitle={newTitle}
            creating={creating}
            onToggleNewProject={() => setShowNewProject(true)}
            onCancelNewProject={() => setShowNewProject(false)}
            onNewTitleChange={setNewTitle}
            onCreateProject={createProject}
          />
        ) : view === 'overview' ? (
          <div className="flex-1 overflow-y-auto ws-main-scrollbar ws-mobile-padded">
            <OverviewPanel
              project={selP.project}
              notes={notes}
              files={files}
              members={members}
              messages={messages}
              isLoan={isLoan}
              totalQ={totalQ}
              completedQ={completedQ}
              pct={pct}
              onNavigate={(v) => setNavView(v)}
            />
          </div>
        ) : view === 'notes' ? (
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <NotesPanel
              project={selP.project}
              notes={notes}
              selNote={selNote}
              noteTitle={noteTitle}
              noteContent={noteContent}
              saving={saving}
              onCreate={createNote}
              onOpen={openNote}
              onDelete={deleteNote}
              onCloseEditor={() => setSelNote(null)}
              onTitleChange={(v) => handleNoteChange('title', v)}
              onContentChange={(v) => handleNoteChange('content', v)}
            />
          </div>
        ) : view === 'chat' ? (
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ChatPanel
              project={selP.project}
              messages={messages}
              members={members}
              userId={user.id}
              sending={sending}
              onSend={sendMessage}
            />
          </div>
        ) : view === 'files' ? (
          <div className="flex-1 overflow-y-auto ws-main-scrollbar ws-mobile-padded">
            <FilesPanel
              project={selP.project}
              files={files}
              uploading={uploading}
              isOwner={!!isOwner}
              onUpload={uploadFile}
              onDownload={downloadFile}
              onDelete={deleteFile}
            />
          </div>
        ) : view === 'members' && isOwner ? (
          <div className="flex-1 overflow-y-auto ws-main-scrollbar ws-mobile-padded">
            <MembersPanel
              project={selP.project}
              members={members}
              session={session}
              inviteEmail={inviteEmail}
              inviting={inviting}
              inviteMsg={inviteMsg}
              onInviteEmailChange={setInviteEmail}
              onInvite={inviteMember}
              onRemoveMember={async (id) => {
                await supabase.from('project_members').delete().eq('id', id)
                setMembers((ms) => ms.filter((x) => x.id !== id))
              }}
            />
          </div>
        ) : view === 'questionnaire' && isLoan ? (
          <div className="flex-1 min-h-0 overflow-hidden ws-mobile-padded">
            <QuestionnairePanel
              answers={answers}
              activeSection={activeSection}
              statusFilter={statusFilter}
              search={search}
              onSectionChange={setActiveSection}
              onStatusFilterChange={setStatusFilter}
              onSearchChange={setSearch}
              onOpenQuestion={(id) => {
                setSelQId(id)
                setView('question')
              }}
            />
          </div>
        ) : view === 'question' && selQId && isLoan ? (
          <div className="flex-1 min-h-0 overflow-hidden ws-mobile-padded">
            <QuestionDetailPanel
              questionId={selQId}
              answer={
                answers[selQId] || {
                  question_id: selQId,
                  answer: '',
                  status: 'unanswered',
                  note: '',
                }
              }
              onBack={() => setView('questionnaire')}
              onNext={(nextId) => setSelQId(nextId)}
              onUpdate={(field, value) => updateAnswer(selQId, field, value)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto ws-main-scrollbar">
            <OverviewPanel
              project={selP.project}
              notes={notes}
              files={files}
              members={members}
              messages={messages}
              isLoan={isLoan}
              totalQ={totalQ}
              completedQ={completedQ}
              pct={pct}
              onNavigate={(v) => setNavView(v)}
            />
          </div>
        )}
        </main>

        {/* Desktop sidebar + icon nav — hidden on mobile */}
        <div className="ws-desktop-only" style={{ display: 'flex' }}>
          <Sidebar
            session={session}
            projects={projects}
            selId={selId}
            showNewProject={showNewProject}
            newTitle={newTitle}
            creating={creating}
            onSelectProject={selectProject}
            onToggleNewProject={() => setShowNewProject((v) => !v)}
            onNewTitleChange={setNewTitle}
            onCreateProject={createProject}
          />

          <IconNav
            view={view}
            isLoan={isLoan}
            isOwner={!!isOwner}
            userInitial={userInitial}
            onSetView={setNavView}
            onSignOut={() => supabase.auth.signOut()}
          />
        </div>
      </div>

      {/* ── Mobile bottom navigation ────────────── */}
      {hasProjects && (
        <nav className="ws-bottom-nav">
          {mobileNavItems.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              className={`ws-bottom-nav-item${mobileActiveView === id ? ' active' : ''}`}
              onClick={() => setNavView(id)}
              style={mobileActiveView === id ? { color } : undefined}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

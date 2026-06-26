'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, type Project, type Note, type FileRecord } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const COLORS = ['#b8922a', '#2a7ab8', '#2ab87a', '#b82a2a', '#7a2ab8', '#2ab8b8']

// ─── Auth Screen ────────────────────────────────────────────────────────────

function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Vazirmatn, sans-serif',
      background: '#0a1628',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        .ws-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 10px;
          color: #fff !important;
          font-size: 0.95rem;
          font-family: Vazirmatn, sans-serif;
          direction: rtl;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-text-fill-color: #fff;
          pointer-events: all !important;
          position: relative;
          z-index: 1;
        }
        .ws-input::placeholder { color: rgba(255,255,255,0.35); }
        .ws-input:focus { border-color: #b8922a !important; background: rgba(255,255,255,0.1) !important; }
        .ws-input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #1a2d4a inset !important; -webkit-text-fill-color: #fff !important; }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-20px) rotate(5deg);} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(15px) rotate(-3deg);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:none;} }
      `}</style>

      {/* Background decorations */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,146,42,0.15) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,122,184,0.12) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '10%', width: 2, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(184,146,42,0.4), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: 60, height: 60, border: '1px solid rgba(184,146,42,0.2)', borderRadius: 12, transform: 'rotate(15deg)', pointerEvents: 'none' }} />

      {/* Left panel - branding (desktop) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 4rem', position: 'relative' }}>
        <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #b8922a, #d4aa45)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>N</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: 0.5 }}>نیما سرائیان</span>
          </div>

          <h2 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.4, margin: '0 0 1rem' }}>
            فضای کار<br />
            <span style={{ color: '#b8922a' }}>راهبردی</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: 320 }}>
            پلتفرم مشترک برای مدیریت پروژه‌ها، یادداشت‌ها و اسناد محرمانه
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['مدیریت پروژه‌های مشاوره', 'اشتراک‌گذاری اسناد امن', 'یادداشت‌برداری تیمی'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b8922a', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div style={{ width: '100%', maxWidth: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', animation: 'fadeUp 0.5s ease forwards' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '2.5rem',
          }}>
            <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
              {mode === 'login' ? 'خوش آمدید' : 'ایجاد حساب'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 2rem' }}>
              {mode === 'login' ? 'با ایمیل و رمز عبور وارد شوید' : 'اطلاعات حساب خود را وارد کنید'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 500 }}>ایمیل</label>
                <input
                  className="ws-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 500 }}>رمز عبور</label>
                <input
                  className="ws-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, padding: '0.65rem 0.85rem', color: '#ff7c6e', fontSize: '0.8rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                marginTop: '0.5rem',
                padding: '0.9rem',
                background: loading ? 'rgba(184,146,42,0.5)' : 'linear-gradient(135deg, #b8922a, #d4aa45)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Vazirmatn, sans-serif',
                transition: 'opacity 0.2s',
                width: '100%',
              }}>
                {loading ? '...' : mode === 'login' ? 'ورود به فضای کار' : 'ایجاد حساب'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                {mode === 'login' ? 'حساب ندارید؟ ' : 'حساب دارید؟ '}
              </span>
              <button onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}
                style={{ background: 'none', border: 'none', color: '#b8922a', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit', padding: 0 }}>
                {mode === 'login' ? 'ثبت‌نام کنید' : 'وارد شوید'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Workspace ──────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f2ee' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0d8c8', borderTopColor: '#b8922a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!session) return <AuthScreen />

  return <Dashboard session={session} />
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ session }: { session: Session }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [files, setFiles] = useState<FileRecord[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [newProjectModal, setNewProjectModal] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)

  const userId = session.user.id

  // Load projects
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProjects(data)
  }

  // Load notes + files when project selected
  useEffect(() => {
    if (!selected) return
    setLoadingNotes(true)
    Promise.all([
      supabase.from('notes').select('*').eq('project_id', selected.id).order('updated_at', { ascending: false }),
      supabase.from('files').select('*').eq('project_id', selected.id).order('created_at', { ascending: false }),
    ]).then(([notesRes, filesRes]) => {
      if (notesRes.data) setNotes(notesRes.data)
      if (filesRes.data) setFiles(filesRes.data)
      setLoadingNotes(false)
    })
  }, [selected])

  const createProject = async (title: string, description: string, color: string) => {
    const { data } = await supabase.from('projects').insert({
      title, description, color, owner_id: userId
    }).select().single()
    if (data) {
      setProjects(p => [data, ...p])
      setSelected(data)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('پروژه حذف شود؟')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(p => p.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const createNote = async () => {
    if (!selected) return
    const { data } = await supabase.from('notes').insert({
      title: 'یادداشت جدید',
      content: '',
      project_id: selected.id,
      author_id: userId,
    }).select().single()
    if (data) {
      setNotes(n => [data, ...n])
      setActiveNote(data)
    }
  }

  const saveNote = async (note: Note) => {
    await supabase.from('notes').update({
      title: note.title,
      content: note.content,
    }).eq('id', note.id)
    setNotes(n => n.map(x => x.id === note.id ? { ...x, title: note.title, content: note.content } : x))
  }

  const deleteNote = async (id: string) => {
    if (!confirm('یادداشت حذف شود؟')) return
    await supabase.from('notes').delete().eq('id', id)
    setNotes(n => n.filter(x => x.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f2ee', fontFamily: 'Vazirmatn, sans-serif' }} dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #d4c9b0; border-radius: 10px; }
        .note-card:hover { background: #f0ece4 !important; }
        .project-item:hover { background: rgba(255,255,255,0.12) !important; cursor: pointer; }
        .file-row:hover { background: #f0ece4 !important; }
        .icon-btn:hover { background: rgba(0,0,0,0.06) !important; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: '#0d1b2a', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', color: '#b8922a', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>☰</button>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>فضای کار مشترک</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#a0a8b4', fontSize: '0.78rem' }}>{session.user.email}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 6, cursor: 'pointer' }}>خروج</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: 240, background: '#162233', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto', animation: 'fadeIn 0.15s ease' }}>
            <div style={{ padding: '1rem 0.85rem 0.5rem' }}>
              <button onClick={() => setNewProjectModal(true)} style={{ width: '100%', background: '#b8922a', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                + پروژه جدید
              </button>
            </div>
            <div style={{ padding: '0.5rem 0.5rem', fontSize: '0.7rem', color: '#5a7080', fontWeight: 700, letterSpacing: 1 }}>پروژه‌ها</div>
            {projects.length === 0 && (
              <div style={{ padding: '1rem', color: '#5a7080', fontSize: '0.8rem', textAlign: 'center' }}>هنوز پروژه‌ای نیست</div>
            )}
            {projects.map(p => (
              <div key={p.id} className="project-item"
                onClick={() => { setSelected(p); setActiveNote(null) }}
                style={{ padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderRadius: 8, margin: '0 0.35rem', background: selected?.id === p.id ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'background 0.15s' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ color: '#e0e8f0', fontSize: '0.84rem', fontWeight: selected?.id === p.id ? 700 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Project panel */}
          {selected && !activeNote && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeIn 0.15s ease' }}>
              {/* Project header */}
              <div style={{ padding: '1.25rem 1.5rem 1rem', background: '#fff', borderBottom: '1px solid #ede9e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: selected.color }} />
                  <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0d1b2a' }}>{selected.title}</h2>
                  {selected.description && <span style={{ fontSize: '0.78rem', color: '#888' }}>{selected.description}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setShareModal(true)} style={{ ...btnOutlineStyle, fontSize: '0.78rem' }}>اشتراک‌گذاری</button>
                  <button onClick={() => deleteProject(selected.id)} style={{ background: 'none', border: '1px solid #f5c6c6', color: '#c0392b', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>حذف</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
                {/* Notes section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#555' }}>یادداشت‌ها</h3>
                    <button onClick={createNote} style={{ ...btnGoldStyle, padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>+ جدید</button>
                  </div>

                  {loadingNotes ? (
                    <div style={{ color: '#aaa', fontSize: '0.82rem' }}>در حال بارگذاری...</div>
                  ) : notes.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', textAlign: 'center', color: '#aaa', fontSize: '0.82rem', border: '2px dashed #e8e0d0' }}>
                      اولین یادداشت را بسازید
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      {notes.map(n => (
                        <div key={n.id} className="note-card"
                          onClick={() => setActiveNote(n)}
                          style={{ background: '#fff', borderRadius: 10, padding: '1rem', cursor: 'pointer', border: '1px solid #ede9e0', transition: 'background 0.15s' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0d1b2a', marginBottom: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title || 'بدون عنوان'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#999', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                            {n.content || 'خالی...'}
                          </div>
                          <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#bbb' }}>
                            {new Date(n.updated_at).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Files section */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#555' }}>فایل‌ها</h3>
                    <FileUploader projectId={selected.id} userId={userId} onUpload={f => setFiles(prev => [f, ...prev])} />
                  </div>

                  {files.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', textAlign: 'center', color: '#aaa', fontSize: '0.82rem', border: '2px dashed #e8e0d0' }}>
                      فایلی آپلود نشده
                    </div>
                  ) : (
                    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #ede9e0', overflow: 'hidden' }}>
                      {files.map((f, i) => (
                        <div key={f.id} className="file-row"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < files.length - 1 ? '1px solid #f0ece4' : 'none', transition: 'background 0.15s' }}>
                          <span style={{ fontSize: 18 }}>{fileIcon(f.mime_type)}</span>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{formatSize(f.size)}</div>
                          </div>
                          <button onClick={() => downloadFile(f)} style={{ background: 'none', border: '1px solid #e0d8c8', borderRadius: 6, padding: '0.25rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer', color: '#666', fontFamily: 'inherit' }}>دانلود</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Note editor */}
          {activeNote && (
            <NoteEditor
              note={activeNote}
              onSave={(updated) => { saveNote(updated); setActiveNote(updated) }}
              onDelete={() => deleteNote(activeNote.id)}
              onBack={() => setActiveNote(null)}
            />
          )}

          {/* Empty state */}
          {!selected && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>📁</div>
              <div style={{ fontSize: '0.9rem' }}>یک پروژه انتخاب کنید</div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {newProjectModal && <NewProjectModal onCreate={createProject} onClose={() => setNewProjectModal(false)} />}
      {shareModal && selected && <ShareModal project={selected} onClose={() => setShareModal(false)} />}
    </div>
  )
}

// ─── Note Editor ─────────────────────────────────────────────────────────────

function NoteEditor({ note, onSave, onDelete, onBack }: {
  note: Note
  onSave: (n: Note) => void
  onDelete: () => void
  onBack: () => void
}) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [saved, setSaved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (newTitle: string, newContent: string) => {
    setTitle(newTitle)
    setContent(newContent)
    setSaved(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSave({ ...note, title: newTitle, content: newContent })
      setSaved(true)
    }, 1200)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', animation: 'fadeIn 0.15s ease' }}>
      {/* Editor toolbar */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #ede9e0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', padding: '0.25rem 0.5rem', borderRadius: 6 }}>← بازگشت</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.75rem', color: saved ? '#27ae60' : '#bbb', transition: 'color 0.3s' }}>{saved ? '✓ ذخیره شد' : 'در حال تایپ...'}</span>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>حذف</button>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={e => handleChange(e.target.value, content)}
        placeholder="عنوان یادداشت..."
        style={{ border: 'none', outline: 'none', padding: '1.5rem 1.5rem 0.5rem', fontSize: '1.35rem', fontWeight: 700, color: '#0d1b2a', fontFamily: 'Vazirmatn, sans-serif', background: 'transparent', direction: 'rtl' }}
      />

      {/* Content */}
      <textarea
        value={content}
        onChange={e => handleChange(title, e.target.value)}
        placeholder="یادداشت خود را اینجا بنویسید..."
        style={{ flex: 1, border: 'none', outline: 'none', padding: '0.75rem 1.5rem 1.5rem', fontSize: '0.95rem', lineHeight: 2, color: '#333', fontFamily: 'Vazirmatn, sans-serif', resize: 'none', background: 'transparent', direction: 'rtl' }}
      />
    </div>
  )
}

// ─── File Uploader ────────────────────────────────────────────────────────────

function FileUploader({ projectId, userId, onUpload }: {
  projectId: string
  userId: string
  onUpload: (f: FileRecord) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const path = `${userId}/${projectId}/${Date.now()}_${file.name}`
      const { error: storageError } = await supabase.storage.from('workspace-files').upload(path, file)
      if (storageError) throw storageError

      const { data } = await supabase.from('files').insert({
        name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: path,
        project_id: projectId,
        uploader_id: userId,
      }).select().single()

      if (data) onUpload(data)
    } catch (err) {
      alert('خطا در آپلود فایل')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{ ...btnGoldStyle, padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
        {uploading ? 'در حال آپلود...' : '+ آپلود'}
      </button>
    </>
  )
}

// ─── New Project Modal ────────────────────────────────────────────────────────

function NewProjectModal({ onCreate, onClose }: {
  onCreate: (title: string, desc: string, color: string) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim(), desc.trim(), color)
    onClose()
  }

  return (
    <Modal onClose={onClose} title="پروژه جدید">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <input placeholder="نام پروژه *" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} autoFocus />
        <input placeholder="توضیح کوتاه (اختیاری)" value={desc} onChange={e => setDesc(e.target.value)} style={inputStyle} />
        <div>
          <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>رنگ پروژه</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: color === c ? '3px solid #0d1b2a' : '3px solid transparent', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} style={btnOutlineStyle}>انصراف</button>
          <button type="submit" style={btnGoldStyle}>ساختن پروژه</button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'editor' | 'viewer'>('editor')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const { data: userData } = await supabase.auth.admin?.listUsers?.() || { data: null }
      // Simple approach: invite via Supabase auth
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
      if (error) throw error
      setStatus('دعوت‌نامه ارسال شد ✓')
      setEmail('')
    } catch {
      setStatus('لطفاً آدرس ایمیل را بررسی کنید')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title={`اشتراک‌گذاری: ${project.title}`}>
      <p style={{ fontSize: '0.82rem', color: '#888', marginTop: 0 }}>
        با ارسال ایمیل، همکار شما می‌تواند وارد workspace شود و به این پروژه دسترسی داشته باشد.
      </p>
      <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input type="email" placeholder="ایمیل همکار" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <select value={role} onChange={e => setRole(e.target.value as 'editor' | 'viewer')} style={inputStyle}>
          <option value="editor">ویرایشگر — می‌تواند ویرایش کند</option>
          <option value="viewer">بیننده — فقط می‌تواند ببیند</option>
        </select>
        {status && <p style={{ fontSize: '0.8rem', color: status.includes('✓') ? '#27ae60' : '#e74c3c', margin: 0 }}>{status}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={btnOutlineStyle}>بستن</button>
          <button type="submit" disabled={loading} style={btnGoldStyle}>{loading ? 'در حال ارسال...' : 'ارسال دعوت'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Generic Modal ────────────────────────────────────────────────────────────

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', width: '100%', maxWidth: 420, animation: 'fadeIn 0.15s ease', direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0d1b2a' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function downloadFile(f: FileRecord) {
  const { data } = await supabase.storage.from('workspace-files').download(f.storage_path)
  if (!data) return
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = f.name
  a.click()
  URL.revokeObjectURL(url)
}

function fileIcon(mime: string) {
  if (!mime) return '📄'
  if (mime.startsWith('image/')) return '🖼️'
  if (mime.includes('pdf')) return '📕'
  if (mime.includes('word') || mime.includes('document')) return '📝'
  if (mime.includes('excel') || mime.includes('sheet')) return '📊'
  if (mime.includes('zip') || mime.includes('rar')) return '🗜️'
  return '📄'
}

function formatSize(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  border: '1px solid #e0d8c8',
  borderRadius: 8,
  padding: '0.6rem 0.85rem',
  fontSize: '0.88rem',
  fontFamily: 'Vazirmatn, sans-serif',
  outline: 'none',
  direction: 'rtl',
  width: '100%',
  background: '#faf9f7',
}

const btnGoldStyle: React.CSSProperties = {
  background: '#b8922a',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '0.5rem 1.1rem',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer',
  fontFamily: 'Vazirmatn, sans-serif',
  whiteSpace: 'nowrap',
}

const btnOutlineStyle: React.CSSProperties = {
  background: 'none',
  color: '#555',
  border: '1px solid #e0d8c8',
  borderRadius: 8,
  padding: '0.5rem 1rem',
  fontWeight: 600,
  fontSize: '0.84rem',
  cursor: 'pointer',
  fontFamily: 'Vazirmatn, sans-serif',
  whiteSpace: 'nowrap',
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

// ─── Types ──────────────────────────────────────────────────────────────────

type Project = {
  id: string; title: string; description: string | null
  color: string; owner_id: string; created_at: string
}
type ProjectWithRole = { role: 'owner' | 'member'; project: Project }
type Note = {
  id: string; title: string; content: string
  project_id: string; author_id: string; created_at: string; updated_at: string
}
type FileRecord = {
  id: string; name: string; size: number; mime_type: string
  storage_path: string; project_id: string; uploader_id: string; created_at: string
}
type Member = { id: string; user_id: string; role: 'owner' | 'member'; joined_at: string; email?: string }

// ─── Supabase ────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = ['#b8922a', '#2a4a7a', '#2a7a52', '#7a2a2a', '#5a2a7a', '#2a6a7a']
const AUTOSAVE = 1200

// ─── Auth Screen ─────────────────────────────────────────────────────────────

function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError(error.message)
        else setSuccess('ایمیل تأیید ارسال شد. صندوق ورودی خود را بررسی کنید.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Vazirmatn, sans-serif', background: '#0a1628', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        .ws-inp { width:100%; padding:.85rem 1rem; background:rgba(255,255,255,.07)!important; border:1px solid rgba(255,255,255,.15)!important; border-radius:10px; color:#fff!important; font-size:.95rem; font-family:Vazirmatn,sans-serif; direction:ltr; text-align:left; outline:none; transition:border-color .2s,background .2s; box-sizing:border-box; -webkit-text-fill-color:#fff; pointer-events:all!important; }
        .ws-inp::placeholder { color:rgba(255,255,255,.35); }
        .ws-inp:focus { border-color:#b8922a!important; background:rgba(255,255,255,.1)!important; }
        .ws-inp:-webkit-autofill { -webkit-box-shadow:0 0 0 30px #1a2d4a inset!important; -webkit-text-fill-color:#fff!important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(15px)} }
      `}</style>

      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(184,146,42,.15) 0%,transparent 70%)', animation:'float1 8s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(42,74,122,.15) 0%,transparent 70%)', animation:'float2 10s ease-in-out infinite', pointerEvents:'none' }} />

      {/* Branding panel */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'3rem 4rem', position:'relative' }}>
        <div style={{ animation:'fadeUp .6s ease forwards' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'3rem' }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg,#b8922a,#d4aa45)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:18 }}>N</span>
            </div>
            <span style={{ color:'#fff', fontWeight:700, fontSize:'1rem' }}>نیما سرائیان</span>
          </div>
          <h2 style={{ color:'#fff', fontSize:'2.2rem', fontWeight:800, lineHeight:1.4, margin:'0 0 1rem' }}>
            فضای کار<br /><span style={{ color:'#b8922a' }}>راهبردی</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.9rem', lineHeight:1.8, maxWidth:320 }}>
            پلتفرم مشترک برای مدیریت پروژه‌ها، یادداشت‌ها و اسناد محرمانه
          </p>
          <div style={{ marginTop:'3rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            {['دسترسی مبتنی بر نقش برای هر پروژه','دعوت همکاران با ایمیل','یادداشت‌برداری و آپلود فایل تیمی'].map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#b8922a', flexShrink:0 }} />
                <span style={{ color:'rgba(255,255,255,.6)', fontSize:'.85rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login panel */}
      <div style={{ width:'100%', maxWidth:460, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', zIndex:2 }}>
        <div style={{ width:'100%', animation:'fadeUp .5s ease forwards' }}>
          <div style={{ background:'rgba(255,255,255,.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:'2.5rem' }}>
            <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:700, margin:'0 0 .4rem' }}>
              {mode === 'login' ? 'خوش آمدید' : 'ایجاد حساب'}
            </h1>
            <p style={{ color:'rgba(255,255,255,.4)', fontSize:'.82rem', margin:'0 0 2rem' }}>
              {mode === 'login' ? 'با ایمیل و رمز عبور وارد شوید' : 'اطلاعات حساب خود را وارد کنید'}
            </p>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div>
                <label style={{ display:'block', color:'rgba(255,255,255,.6)', fontSize:'.78rem', marginBottom:'.4rem', fontWeight:500 }}>ایمیل</label>
                <input className="ws-inp" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div>
                <label style={{ display:'block', color:'rgba(255,255,255,.6)', fontSize:'.78rem', marginBottom:'.4rem', fontWeight:500 }}>رمز عبور</label>
                <input className="ws-inp" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              </div>

              {mode === 'login' && (
                <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', userSelect:'none' }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width:16, height:16, accentColor:'#b8922a', cursor:'pointer' }} />
                  <span style={{ color:'rgba(255,255,255,.5)', fontSize:'.82rem' }}>مرا به خاطر بسپار</span>
                </label>
              )}

              {error && <div style={{ background:'rgba(192,57,43,.15)', border:'1px solid rgba(192,57,43,.3)', borderRadius:8, padding:'.65rem .85rem', color:'#ff7c6e', fontSize:'.8rem' }}>{error}</div>}
              {success && <div style={{ background:'rgba(42,184,122,.15)', border:'1px solid rgba(42,184,122,.3)', borderRadius:8, padding:'.65rem .85rem', color:'#4ade80', fontSize:'.8rem' }}>{success}</div>}

              <button type="submit" disabled={loading} style={{ marginTop:'.5rem', padding:'.9rem', background:loading ? 'rgba(184,146,42,.5)' : 'linear-gradient(135deg,#b8922a,#d4aa45)', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:'.95rem', cursor:loading ? 'not-allowed' : 'pointer', fontFamily:'Vazirmatn,sans-serif', width:'100%' }}>
                {loading ? '...' : mode === 'login' ? 'ورود به فضای کار' : 'ایجاد حساب'}
              </button>
            </form>

            <div style={{ marginTop:'1.5rem', textAlign:'center', borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'1.25rem' }}>
              <span style={{ color:'rgba(255,255,255,.35)', fontSize:'.8rem' }}>{mode === 'login' ? 'حساب ندارید؟ ' : 'حساب دارید؟ '}</span>
              <button onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }} style={{ background:'none', border:'none', color:'#b8922a', cursor:'pointer', fontWeight:600, fontSize:'.8rem', fontFamily:'inherit', padding:0 }}>
                {mode === 'login' ? 'ثبت‌نام کنید' : 'وارد شوید'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ session }: { session: Session }) {
  const user = session.user

  const [projects, setProjects] = useState<ProjectWithRole[]>([])
  const [selProjectId, setSelProjectId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [selNote, setSelNote] = useState<Note | null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState<FileRecord[]>([])
  const [uploading, setUploading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [creating, setCreating] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selProject = projects.find(p => p.project.id === selProjectId)
  const isOwner = selProject?.role === 'owner'

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadProjects = async () => {
    const { data } = await supabase
      .from('project_members')
      .select('role, projects(id,title,description,color,owner_id,created_at)')
      .eq('user_id', user.id)
    if (data) {
      const mapped = (data as unknown as { role: 'owner'|'member'; projects: Project }[])
        .map(d => ({ role: d.role, project: d.projects }))
        .filter(d => d.project)
      setProjects(mapped)
      if (mapped.length > 0 && !selProjectId) setSelProjectId(mapped[0].project.id)
    }
  }

  useEffect(() => { loadProjects() }, [])

  useEffect(() => {
    if (!selProjectId) return
    loadNotes(); loadFiles(); loadMembers()
    setSelNote(null)
  }, [selProjectId])

  const loadNotes = async () => {
    const { data } = await supabase.from('notes').select('*').eq('project_id', selProjectId!).order('updated_at', { ascending: false })
    if (data) setNotes(data)
  }

  const loadFiles = async () => {
    const { data } = await supabase.from('files').select('*').eq('project_id', selProjectId!).order('created_at', { ascending: false })
    if (data) setFiles(data)
  }

  const loadMembers = async () => {
    const { data: memberData } = await supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id', selProjectId!)
    if (!memberData) return
    const userIds = memberData.map(m => m.user_id)
    const { data: profileData } = await supabase.from('profiles').select('id,email').in('id', userIds)
    const profileMap: Record<string, string> = {}
    profileData?.forEach(p => { profileMap[p.id] = p.email })
    setMembers(memberData.map(m => ({ ...m, email: profileMap[m.user_id] })))
  }

  // ── Notes ─────────────────────────────────────────────────────────────────

  const openNote = (note: Note) => { setSelNote(note); setNoteTitle(note.title); setNoteContent(note.content) }

  const handleNoteChange = (field: 'title' | 'content', val: string) => {
    if (field === 'title') setNoteTitle(val); else setNoteContent(val)
    if (autosaveRef.current) clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      const t = field === 'title' ? val : noteTitle
      const c = field === 'content' ? val : noteContent
      saveNote(t, c)
    }, AUTOSAVE)
  }

  const saveNote = async (title: string, content: string) => {
    if (!selNote) return
    setSaving(true)
    await supabase.from('notes').update({ title, content }).eq('id', selNote.id)
    setSaving(false)
    setNotes(ns => ns.map(n => n.id === selNote.id ? { ...n, title, content } : n))
  }

  const createNote = async () => {
    const { data } = await supabase.from('notes').insert({ title:'یادداشت جدید', content:'', project_id:selProjectId!, author_id:user.id }).select().single()
    if (data) { setNotes(ns => [data, ...ns]); openNote(data) }
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(ns => ns.filter(n => n.id !== id))
    if (selNote?.id === id) setSelNote(null)
  }

  // ── Files ─────────────────────────────────────────────────────────────────

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const path = `${selProjectId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('workspace-files').upload(path, file)
    if (!error) {
      const { data } = await supabase.from('files').insert({ name:file.name, size:file.size, mime_type:file.type, storage_path:path, project_id:selProjectId!, uploader_id:user.id }).select().single()
      if (data) setFiles(fs => [data, ...fs])
    }
    setUploading(false); e.target.value = ''
  }

  const downloadFile = async (f: FileRecord) => {
    const { data } = await supabase.storage.from('workspace-files').download(f.storage_path)
    if (data) { const url = URL.createObjectURL(data); const a = document.createElement('a'); a.href = url; a.download = f.name; a.click(); URL.revokeObjectURL(url) }
  }

  const deleteFile = async (f: FileRecord) => {
    await supabase.storage.from('workspace-files').remove([f.storage_path])
    await supabase.from('files').delete().eq('id', f.id)
    setFiles(fs => fs.filter(x => x.id !== f.id))
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  const createProject = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const { data } = await supabase.from('projects').insert({ title:newTitle, color:newColor, owner_id:user.id }).select().single()
    if (data) { await loadProjects(); setSelProjectId(data.id); setShowNewProject(false); setNewTitle('') }
    setCreating(false)
  }

  // ── Members ───────────────────────────────────────────────────────────────

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selProjectId) return
    setInviting(true); setInviteMsg('')
    try {
      const res = await fetch('/api/workspace/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, projectId: selProjectId, inviterId: user.id }),
      })
      const json = await res.json()
      if (json.error) setInviteMsg('خطا: ' + json.error)
      else { setInviteMsg('دعوت‌نامه ارسال شد ✓'); setInviteEmail(''); await loadMembers() }
    } catch { setInviteMsg('خطا در ارسال') }
    setInviting(false)
  }

  const removeMember = async (memberId: string, userId: string) => {
    if (userId === user.id) return
    await supabase.from('project_members').delete().eq('id', memberId)
    setMembers(ms => ms.filter(m => m.id !== memberId))
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const fmtSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b/1024).toFixed(1) + ' KB' : (b/1048576).toFixed(1) + ' MB'
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fa-IR')
  const fileIcon = (mime: string) => mime?.startsWith('image/') ? '🖼' : mime?.includes('pdf') ? '📄' : mime?.includes('word') ? '📝' : '📎'

  // ── Note Editor view ──────────────────────────────────────────────────────

  if (selNote) {
    return (
      <div dir="rtl" style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#fff', fontFamily:'Vazirmatn,sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');`}</style>
        <div style={{ height:52, borderBottom:'1px solid #eee', display:'flex', alignItems:'center', padding:'0 1.25rem', gap:'.75rem', background:'#fafafa' }}>
          <button onClick={() => setSelNote(null)} style={{ background:'none', border:'none', cursor:'pointer', padding:'.35rem .6rem', borderRadius:6, color:'#555', fontSize:'.9rem', fontFamily:'Vazirmatn,sans-serif' }}>← برگشت</button>
          <span style={{ fontSize:'.8rem', color:'#bbb' }}>›</span>
          <span style={{ fontSize:'.8rem', color:'#999' }}>{selProject?.project.title}</span>
          <div style={{ flex:1 }} />
          <span style={{ fontSize:'.72rem', color:saving ? '#b8922a' : '#ccc' }}>{saving ? 'در حال ذخیره...' : '✓ ذخیره شد'}</span>
        </div>
        <input value={noteTitle} onChange={e => handleNoteChange('title', e.target.value)}
          style={{ border:'none', outline:'none', fontSize:'1.7rem', fontWeight:700, padding:'1.5rem 2.5rem .5rem', fontFamily:'Vazirmatn,sans-serif', color:'#0d1b2a', direction:'rtl', width:'100%', boxSizing:'border-box' }}
          placeholder="عنوان یادداشت" />
        <textarea value={noteContent} onChange={e => handleNoteChange('content', e.target.value)}
          style={{ flex:1, border:'none', outline:'none', resize:'none', padding:'.5rem 2.5rem 2.5rem', fontFamily:'Vazirmatn,sans-serif', fontSize:'1rem', lineHeight:2, color:'#333', direction:'rtl', width:'100%', boxSizing:'border-box' }}
          placeholder="شروع به نوشتن کنید..." />
      </div>
    )
  }

  // ── Main Dashboard view ───────────────────────────────────────────────────

  return (
    <div dir="rtl" style={{ height:'100vh', display:'flex', fontFamily:'Vazirmatn,sans-serif', background:'#f6f7f9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        .ws-si { padding:.55rem .8rem; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:.55rem; transition:background .15s; }
        .ws-si:hover { background:rgba(255,255,255,.08); }
        .ws-si.active { background:rgba(255,255,255,.13); }
        .ws-btn { padding:.5rem .9rem; border-radius:8px; border:none; cursor:pointer; font-family:Vazirmatn,sans-serif; font-size:.8rem; font-weight:600; transition:opacity .15s; }
        .ws-btn:hover { opacity:.85; }
        .ws-btn:disabled { opacity:.5; cursor:not-allowed; }
        .ws-card { background:#fff; border-radius:12px; border:1px solid #eee; padding:1rem; cursor:pointer; transition:box-shadow .15s,border-color .15s; }
        .ws-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); border-color:#e0e0e0; }
        .ws-il { padding:.6rem .85rem; border:1px solid #e0e0e0; border-radius:8px; font-family:Vazirmatn,sans-serif; font-size:.85rem; direction:rtl; outline:none; background:#fff; width:100%; box-sizing:border-box; }
        .ws-il:focus { border-color:#b8922a; }
        .ws-del { background:none; border:none; cursor:pointer; color:#ddd; font-size:1.1rem; padding:.2rem; transition:color .15s; }
        .ws-del:hover { color:#e74c3c; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width:240, background:'#0d1b2a', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'1.1rem .85rem', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.55rem' }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#b8922a,#d4aa45)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:14 }}>N</span>
            </div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:'.82rem' }}>فضای کار</div>
              <div style={{ color:'rgba(255,255,255,.35)', fontSize:'.68rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
            </div>
          </div>
        </div>

        <div style={{ flex:1, padding:'.6rem .4rem', overflowY:'auto' }}>
          <div style={{ color:'rgba(255,255,255,.3)', fontSize:'.67rem', fontWeight:600, padding:'0 .45rem .45rem', letterSpacing:.5, textTransform:'uppercase' }}>پروژه‌ها</div>
          {projects.map(({ project, role }) => (
            <div key={project.id} className={`ws-si${selProjectId === project.id ? ' active' : ''}`} onClick={() => { setSelProjectId(project.id); setShowMembers(false) }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:project.color, flexShrink:0 }} />
              <span style={{ color:'#fff', fontSize:'.83rem', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{project.title}</span>
              {role === 'owner' && <span style={{ fontSize:'.58rem', background:'rgba(184,146,42,.2)', color:'#d4aa45', padding:'.1rem .35rem', borderRadius:4, flexShrink:0 }}>مالک</span>}
            </div>
          ))}
          <button onClick={() => setShowNewProject(true)} style={{ width:'100%', marginTop:'.5rem', padding:'.55rem .8rem', background:'none', border:'1px dashed rgba(255,255,255,.12)', borderRadius:8, color:'rgba(255,255,255,.35)', cursor:'pointer', fontFamily:'Vazirmatn,sans-serif', fontSize:'.78rem', textAlign:'right' }}>
            + پروژه جدید
          </button>
        </div>

        <div style={{ padding:'.6rem', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          <button onClick={() => supabase.auth.signOut()} style={{ width:'100%', padding:'.55rem', background:'rgba(255,255,255,.04)', border:'none', borderRadius:8, color:'rgba(255,255,255,.4)', cursor:'pointer', fontFamily:'Vazirmatn,sans-serif', fontSize:'.78rem' }}>
            خروج از حساب
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {selProject ? (
          <>
            {/* Top bar */}
            <div style={{ height:54, borderBottom:'1px solid #eee', display:'flex', alignItems:'center', padding:'0 1.5rem', gap:'.75rem', background:'#fff', flexShrink:0 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:selProject.project.color, flexShrink:0 }} />
              <h1 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'#0d1b2a' }}>{selProject.project.title}</h1>
              <div style={{ flex:1 }} />
              {isOwner && (
                <button onClick={() => setShowMembers(!showMembers)} className="ws-btn" style={{ background:showMembers ? '#0d1b2a' : '#f0f0f0', color:showMembers ? '#fff' : '#555' }}>
                  اعضا {members.length > 0 ? `(${members.length})` : ''}
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
              {/* Notes & Files */}
              <div style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>

                {/* Notes */}
                <div style={{ marginBottom:'2rem' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                    <h2 style={{ margin:0, fontSize:'.88rem', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:.5 }}>یادداشت‌ها</h2>
                    <button onClick={createNote} className="ws-btn" style={{ background:'#0d1b2a', color:'#fff' }}>+ یادداشت جدید</button>
                  </div>
                  {notes.length === 0 ? (
                    <div style={{ background:'#fff', borderRadius:12, border:'1px dashed #e0e0e0', padding:'2.5rem', textAlign:'center', color:'#bbb', fontSize:'.85rem' }}>
                      یادداشتی وجود ندارد — یکی بسازید
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'.75rem' }}>
                      {notes.map(note => (
                        <div key={note.id} className="ws-card" onClick={() => openNote(note)} style={{ position:'relative' }}>
                          <div style={{ fontWeight:600, fontSize:'.88rem', color:'#0d1b2a', marginBottom:'.35rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{note.title}</div>
                          <div style={{ fontSize:'.75rem', color:'#aaa', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.6 }}>{note.content || 'بدون محتوا'}</div>
                          <div style={{ fontSize:'.68rem', color:'#ccc', marginTop:'.75rem' }}>{fmtDate(note.updated_at)}</div>
                          <button className="ws-del" onClick={e => { e.stopPropagation(); deleteNote(note.id) }} style={{ position:'absolute', top:'.5rem', left:'.5rem' }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Files */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                    <h2 style={{ margin:0, fontSize:'.88rem', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:.5 }}>فایل‌ها</h2>
                    <label style={{ background:'#0d1b2a', color:'#fff', padding:'.5rem .9rem', borderRadius:8, cursor:'pointer', fontSize:'.8rem', fontWeight:600 }}>
                      {uploading ? 'آپلود...' : '+ آپلود فایل'}
                      <input type="file" onChange={uploadFile} style={{ display:'none' }} disabled={uploading} />
                    </label>
                  </div>
                  {files.length === 0 ? (
                    <div style={{ background:'#fff', borderRadius:12, border:'1px dashed #e0e0e0', padding:'2.5rem', textAlign:'center', color:'#bbb', fontSize:'.85rem' }}>
                      فایلی آپلود نشده
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                      {files.map(f => (
                        <div key={f.id} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.75rem 1rem', background:'#fff', borderRadius:10, border:'1px solid #eee' }}>
                          <div style={{ width:36, height:36, background:'#f5f5f5', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                            {fileIcon(f.mime_type)}
                          </div>
                          <div style={{ flex:1, overflow:'hidden' }}>
                            <div style={{ fontWeight:600, fontSize:'.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                            <div style={{ fontSize:'.7rem', color:'#bbb' }}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</div>
                          </div>
                          <button onClick={() => downloadFile(f)} className="ws-btn" style={{ background:'#f0f0f0', color:'#555' }}>دانلود</button>
                          <button className="ws-del" onClick={() => deleteFile(f)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Members panel */}
              {isOwner && showMembers && (
                <div style={{ width:270, borderRight:'1px solid #eee', background:'#fff', padding:'1.25rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem', flexShrink:0 }}>
                  <h3 style={{ margin:0, fontSize:'.9rem', fontWeight:700, color:'#0d1b2a' }}>اعضای پروژه</h3>

                  {/* Invite */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                    <label style={{ fontSize:'.75rem', color:'#888', fontWeight:500 }}>دعوت همکار</label>
                    <input className="ws-il" type="email" placeholder="ایمیل همکار" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                    <button onClick={inviteMember} disabled={inviting || !inviteEmail.trim()} className="ws-btn" style={{ background:'#b8922a', color:'#fff' }}>
                      {inviting ? 'در حال ارسال...' : 'ارسال دعوت‌نامه'}
                    </button>
                    {inviteMsg && <p style={{ margin:0, fontSize:'.73rem', color:inviteMsg.startsWith('خطا') ? '#e74c3c' : '#27ae60' }}>{inviteMsg}</p>}
                  </div>

                  {/* Members list */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
                    <label style={{ fontSize:'.75rem', color:'#888', fontWeight:500 }}>لیست اعضا</label>
                    {members.map(m => (
                      <div key={m.id} style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.6rem .75rem', background:'#f8f9fa', borderRadius:8 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:m.role === 'owner' ? '#b8922a' : '#0d1b2a', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'.7rem', fontWeight:700, flexShrink:0 }}>
                          {(m.email || 'U')[0].toUpperCase()}
                        </div>
                        <div style={{ flex:1, overflow:'hidden' }}>
                          <div style={{ fontSize:'.76rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.email || m.user_id}</div>
                          <div style={{ fontSize:'.65rem', color:'#aaa' }}>{m.role === 'owner' ? 'مالک' : 'عضو'}</div>
                        </div>
                        {m.role !== 'owner' && (
                          <button className="ws-del" onClick={() => removeMember(m.id, m.user_id)}>×</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
            <div style={{ fontSize:'2.5rem' }}>📁</div>
            <p style={{ color:'#aaa', fontSize:'.9rem', margin:0 }}>پروژه‌ای انتخاب نشده</p>
            <button onClick={() => setShowNewProject(true)} className="ws-btn" style={{ background:'#0d1b2a', color:'#fff', padding:'.65rem 1.25rem' }}>ایجاد اولین پروژه</button>
          </div>
        )}
      </div>

      {/* New project modal */}
      {showNewProject && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }} onClick={() => setShowNewProject(false)}>
          <div style={{ background:'#fff', borderRadius:16, padding:'2rem', width:380, direction:'rtl' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin:'0 0 1.25rem', fontSize:'1.1rem', fontWeight:700, color:'#0d1b2a' }}>پروژه جدید</h2>
            <input className="ws-il" placeholder="نام پروژه" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ marginBottom:'1rem' }} autoFocus />
            <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.25rem' }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setNewColor(c)} style={{ width:28, height:28, borderRadius:'50%', background:c, cursor:'pointer', border:newColor === c ? '3px solid #0d1b2a' : '3px solid transparent', transition:'border .15s' }} />
              ))}
            </div>
            <div style={{ display:'flex', gap:'.75rem' }}>
              <button onClick={() => setShowNewProject(false)} className="ws-btn" style={{ flex:1, background:'#f0f0f0', color:'#555' }}>انصراف</button>
              <button onClick={createProject} disabled={creating || !newTitle.trim()} className="ws-btn" style={{ flex:1, background:'#b8922a', color:'#fff' }}>
                {creating ? '...' : 'ایجاد پروژه'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a1628' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(184,146,42,.3)', borderTop:'3px solid #b8922a', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return session ? <Dashboard session={session} /> : <AuthScreen />
}

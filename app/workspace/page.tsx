'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

// ─── Types ──────────────────────────────────────────────────────────────────
type Project = { id: string; title: string; description: string | null; color: string; owner_id: string; created_at: string }
type ProjectWithRole = { role: 'owner' | 'member'; project: Project }
type Note = { id: string; title: string; content: string; project_id: string; author_id: string; created_at: string; updated_at: string }
type FileRecord = { id: string; name: string; size: number; mime_type: string; storage_path: string; project_id: string; uploader_id: string; created_at: string }
type Member = { id: string; user_id: string; role: 'owner' | 'member'; joined_at: string; email?: string }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const COLORS = ['#b8922a','#3b6cb7','#2e8b6e','#c0392b','#7d3c98','#1a7a8a','#d35400','#2c3e50']
const AUTOSAVE = 1200

// ─── Global Styles ───────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Vazirmatn,sans-serif;background:#f0f2f5}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:10px}
.si{display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;border-radius:10px;cursor:pointer;transition:all .2s;border:none;background:none;width:100%;text-align:right;font-family:Vazirmatn,sans-serif}
.si:hover{background:rgba(255,255,255,.08)}
.si.act{background:rgba(184,146,42,.15);border-right:3px solid #b8922a}
.tab{padding:.55rem 1.1rem;border:none;background:none;cursor:pointer;font-family:Vazirmatn,sans-serif;font-size:.85rem;font-weight:600;color:#888;border-bottom:2px solid transparent;transition:all .2s}
.tab.act{color:#b8922a;border-bottom-color:#b8922a}
.tab:hover{color:#555}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:8px;border:none;cursor:pointer;font-family:Vazirmatn,sans-serif;font-size:.82rem;font-weight:600;transition:all .2s}
.btn:hover{opacity:.88;transform:translateY(-1px)}
.btn:active{transform:translateY(0)}
.btn-gold{background:linear-gradient(135deg,#b8922a,#d4aa45);color:#fff}
.btn-dark{background:#0d1b2a;color:#fff}
.btn-light{background:#f0f0f0;color:#444}
.btn-ghost{background:transparent;border:1px solid #e0e0e0;color:#555}
.btn-ghost:hover{background:#f5f5f5}
.btn-danger{background:#fee2e2;color:#c0392b;border:1px solid #fecaca}
.btn-danger:hover{background:#fecaca}
.card{background:#fff;border-radius:14px;border:1px solid #eaeaea;transition:all .25s;overflow:hidden}
.card:hover{box-shadow:0 8px 24px rgba(0,0,0,.09);transform:translateY(-2px)}
.inp{padding:.65rem .9rem;border:1.5px solid #e0e0e0;border-radius:9px;font-family:Vazirmatn,sans-serif;font-size:.88rem;direction:rtl;outline:none;transition:border-color .2s;width:100%;background:#fff}
.inp:focus{border-color:#b8922a;box-shadow:0 0 0 3px rgba(184,146,42,.1)}
.ws-auth-inp{width:100%;padding:.85rem 1rem;background:rgba(255,255,255,.07)!important;border:1.5px solid rgba(255,255,255,.15)!important;border-radius:10px;color:#fff!important;font-size:.95rem;font-family:Vazirmatn,sans-serif;direction:ltr;text-align:left;outline:none;transition:all .2s;-webkit-text-fill-color:#fff;pointer-events:all!important}
.ws-auth-inp::placeholder{color:rgba(255,255,255,.35)}
.ws-auth-inp:focus{border-color:#b8922a!important;background:rgba(255,255,255,.1)!important;box-shadow:0 0 0 3px rgba(184,146,42,.2)!important}
.ws-auth-inp:-webkit-autofill{-webkit-box-shadow:0 0 0 30px #1a2d4a inset!important;-webkit-text-fill-color:#fff!important}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
`

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [success, setSuccess] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('')
    try {
      if (mode === 'login') { const {error} = await supabase.auth.signInWithPassword({email,password}); if(error) setError(error.message) }
      else { const {error} = await supabase.auth.signUp({email,password}); if(error) setError(error.message); else setSuccess('ایمیل تأیید ارسال شد.') }
    } finally { setLoading(false) }
  }

  return (
    <div dir="rtl" style={{minHeight:'100vh',display:'flex',fontFamily:'Vazirmatn,sans-serif',background:'linear-gradient(135deg,#0a1628 0%,#0d2040 50%,#0a1628 100%)',position:'relative',overflow:'hidden'}}>
      <style>{G}</style>
      <div style={{position:'absolute',top:-120,right:-120,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(184,146,42,.12) 0%,transparent 70%)',animation:'float 9s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-100,left:-100,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,108,183,.1) 0%,transparent 70%)',animation:'float 12s ease-in-out infinite reverse',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'30%',left:'20%',width:1,height:200,background:'linear-gradient(to bottom,transparent,rgba(184,146,42,.3),transparent)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'15%',right:'20%',width:50,height:50,border:'1px solid rgba(184,146,42,.15)',borderRadius:10,transform:'rotate(15deg)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'25%',left:'15%',width:30,height:30,border:'1px solid rgba(184,146,42,.1)',borderRadius:6,transform:'rotate(30deg)',pointerEvents:'none'}}/>

      {/* Left branding */}
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'3rem 5rem',position:'relative'}}>
        <div style={{animation:'fadeUp .7s ease forwards'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'3.5rem'}}>
            <div style={{width:44,height:44,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(184,146,42,.4)'}}>
              <span style={{color:'#fff',fontWeight:800,fontSize:20,letterSpacing:-1}}>N</span>
            </div>
            <div><div style={{color:'#fff',fontWeight:700,fontSize:'1rem',letterSpacing:.3}}>نیما سرائیان</div><div style={{color:'rgba(255,255,255,.4)',fontSize:'.72rem'}}>Strategic Workspace</div></div>
          </div>
          <h2 style={{color:'#fff',fontSize:'2.4rem',fontWeight:800,lineHeight:1.4,marginBottom:'1.2rem'}}>فضای کار<br/><span style={{color:'#d4aa45'}}>راهبردی</span></h2>
          <p style={{color:'rgba(255,255,255,.45)',fontSize:'.88rem',lineHeight:1.9,maxWidth:340,marginBottom:'3rem'}}>پلتفرم اختصاصی مدیریت پروژه‌های مشاوره، یادداشت‌های تیمی و اسناد محرمانه</p>
          {[['📁','مدیریت پروژه‌های چندنفره با دسترسی جداگانه'],['✉️','دعوت همکاران با ایمیل به هر پروژه'],['📝','یادداشت‌برداری تیمی با ذخیره خودکار'],['📎','آپلود و اشتراک فایل‌های پروژه']].map(([i,t],k)=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:'.9rem',marginBottom:'.75rem'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'rgba(184,146,42,.12)',border:'1px solid rgba(184,146,42,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>{i}</div>
              <span style={{color:'rgba(255,255,255,.55)',fontSize:'.83rem'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div style={{width:'100%',maxWidth:480,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',position:'relative',zIndex:2}}>
        <div style={{width:'100%',animation:'fadeUp .5s .1s ease both'}}>
          <div style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:22,padding:'2.5rem',boxShadow:'0 32px 64px rgba(0,0,0,.3)'}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <div style={{width:48,height:48,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',boxShadow:'0 8px 20px rgba(184,146,42,.35)'}}>
                <span style={{color:'#fff',fontWeight:800,fontSize:22}}>N</span>
              </div>
              <h1 style={{color:'#fff',fontSize:'1.35rem',fontWeight:700,marginBottom:'.35rem'}}>{mode==='login'?'خوش آمدید':'ایجاد حساب کاربری'}</h1>
              <p style={{color:'rgba(255,255,255,.35)',fontSize:'.8rem'}}>{mode==='login'?'ورود به فضای کار راهبردی':'اطلاعات خود را وارد کنید'}</p>
            </div>

            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <label style={{display:'block',color:'rgba(255,255,255,.5)',fontSize:'.75rem',marginBottom:'.4rem',fontWeight:500}}>ایمیل</label>
                <input className="ws-auth-inp" type="email" placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
              </div>
              <div>
                <label style={{display:'block',color:'rgba(255,255,255,.5)',fontSize:'.75rem',marginBottom:'.4rem',fontWeight:500}}>رمز عبور</label>
                <input className="ws-auth-inp" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete={mode==='login'?'current-password':'new-password'}/>
              </div>
              {error&&<div style={{background:'rgba(192,57,43,.15)',border:'1px solid rgba(192,57,43,.3)',borderRadius:8,padding:'.65rem .85rem',color:'#ff8a75',fontSize:'.8rem'}}>{error}</div>}
              {success&&<div style={{background:'rgba(46,184,110,.15)',border:'1px solid rgba(46,184,110,.3)',borderRadius:8,padding:'.65rem .85rem',color:'#4ade80',fontSize:'.8rem'}}>{success}</div>}
              <button type="submit" disabled={loading} className="btn btn-gold" style={{width:'100%',justifyContent:'center',padding:'.85rem',fontSize:'.95rem',borderRadius:10,marginTop:'.25rem',opacity:loading?.6:1}}>
                {loading?'...':mode==='login'?'ورود به فضای کار':'ایجاد حساب'}
              </button>
            </form>

            <div style={{marginTop:'1.5rem',textAlign:'center',borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:'1.25rem'}}>
              <span style={{color:'rgba(255,255,255,.3)',fontSize:'.8rem'}}>{mode==='login'?'حساب ندارید؟ ':'حساب دارید؟ '}</span>
              <button onClick={()=>{setMode(m=>m==='login'?'signup':'login');setError('');setSuccess('')}} style={{background:'none',border:'none',color:'#d4aa45',cursor:'pointer',fontWeight:600,fontSize:'.8rem',fontFamily:'inherit',padding:0}}>{mode==='login'?'ثبت‌نام کنید':'وارد شوید'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({session}:{session:Session}) {
  const user = session.user
  const [projects, setProjects] = useState<ProjectWithRole[]>([])
  const [selId, setSelId] = useState<string|null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [files, setFiles] = useState<FileRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [activeTab, setActiveTab] = useState<'notes'|'files'|'members'>('notes')
  const [selNote, setSelNote] = useState<Note|null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [showNewProj, setShowNewProj] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const autosaveRef = useRef<ReturnType<typeof setTimeout>|null>(null)
  const selP = projects.find(p=>p.project.id===selId)
  const isOwner = selP?.role==='owner'

  const loadProjects = async () => {
    const {data} = await supabase.from('project_members').select('role,projects(id,title,description,color,owner_id,created_at)').eq('user_id',user.id)
    if(data){const m=(data as any[]).map(d=>({role:d.role,project:d.projects})).filter(d=>d.project);setProjects(m);if(m.length>0&&!selId)setSelId(m[0].project.id)}
  }
  useEffect(()=>{loadProjects()},[])
  useEffect(()=>{if(!selId)return;loadNotes();loadFiles();loadMembers();setSelNote(null);setActiveTab('notes')},[selId])

  const loadNotes = async()=>{const{data}=await supabase.from('notes').select('*').eq('project_id',selId!).order('updated_at',{ascending:false});if(data)setNotes(data)}
  const loadFiles = async()=>{const{data}=await supabase.from('files').select('*').eq('project_id',selId!).order('created_at',{ascending:false});if(data)setFiles(data)}
  const loadMembers = async()=>{
    const{data:md}=await supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id',selId!)
    if(!md)return
    const ids=md.map(m=>m.user_id)
    const{data:pd}=await supabase.from('profiles').select('id,email').in('id',ids)
    const pm:Record<string,string>={}; pd?.forEach(p=>{pm[p.id]=p.email})
    setMembers(md.map(m=>({...m,email:pm[m.user_id]})))
  }

  const openNote=(note:Note)=>{setSelNote(note);setNoteTitle(note.title);setNoteContent(note.content)}
  const handleNoteChange=(field:'title'|'content',val:string)=>{
    if(field==='title')setNoteTitle(val);else setNoteContent(val)
    if(autosaveRef.current)clearTimeout(autosaveRef.current)
    autosaveRef.current=setTimeout(()=>{const t=field==='title'?val:noteTitle;const c=field==='content'?val:noteContent;saveNote(t,c)},AUTOSAVE)
  }
  const saveNote=async(title:string,content:string)=>{if(!selNote)return;setSaving(true);await supabase.from('notes').update({title,content}).eq('id',selNote.id);setSaving(false);setNotes(ns=>ns.map(n=>n.id===selNote.id?{...n,title,content}:n))}
  const createNote=async()=>{const{data}=await supabase.from('notes').insert({title:'یادداشت جدید',content:'',project_id:selId!,author_id:user.id}).select().single();if(data){setNotes(ns=>[data,...ns]);openNote(data)}}
  const deleteNote=async(id:string,e:React.MouseEvent)=>{e.stopPropagation();await supabase.from('notes').delete().eq('id',id);setNotes(ns=>ns.filter(n=>n.id!==id));if(selNote?.id===id)setSelNote(null)}

  const uploadFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];if(!file)return;setUploading(true)
    const path=`${selId}/${Date.now()}_${file.name}`
    const{error}=await supabase.storage.from('workspace-files').upload(path,file)
    if(!error){const{data}=await supabase.from('files').insert({name:file.name,size:file.size,mime_type:file.type,storage_path:path,project_id:selId!,uploader_id:user.id}).select().single();if(data)setFiles(fs=>[data,...fs])}
    setUploading(false);e.target.value=''
  }
  const downloadFile=async(f:FileRecord)=>{const{data}=await supabase.storage.from('workspace-files').download(f.storage_path);if(data){const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=f.name;a.click();URL.revokeObjectURL(url)}}
  const deleteFile=async(f:FileRecord,e:React.MouseEvent)=>{e.stopPropagation();await supabase.storage.from('workspace-files').remove([f.storage_path]);await supabase.from('files').delete().eq('id',f.id);setFiles(fs=>fs.filter(x=>x.id!==f.id))}

  const createProject=async()=>{if(!newTitle.trim())return;setCreating(true);const{data}=await supabase.from('projects').insert({title:newTitle,description:newDesc||null,color:newColor,owner_id:user.id}).select().single();if(data){await loadProjects();setSelId(data.id);setShowNewProj(false);setNewTitle('');setNewDesc('')};setCreating(false)}
  const inviteMember=async()=>{
    if(!inviteEmail.trim()||!selId)return;setInviting(true);setInviteMsg('')
    try{const res=await fetch('/api/workspace/invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:inviteEmail,projectId:selId,inviterId:user.id})});const j=await res.json();if(j.error)setInviteMsg('خطا: '+j.error);else{setInviteMsg('دعوت‌نامه ارسال شد ✓');setInviteEmail('');await loadMembers()}}catch{setInviteMsg('خطا در ارسال')}
    setInviting(false)
  }
  const removeMember=async(memberId:string,userId:string)=>{if(userId===user.id)return;await supabase.from('project_members').delete().eq('id',memberId);setMembers(ms=>ms.filter(m=>m.id!==memberId))}

  const fmtSize=(b:number)=>b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB'
  const fmtDate=(d:string)=>new Date(d).toLocaleDateString('fa-IR',{month:'short',day:'numeric'})
  const fmtDateFull=(d:string)=>new Date(d).toLocaleDateString('fa-IR',{year:'numeric',month:'long',day:'numeric'})
  const fileIcon=(mime:string)=>mime?.startsWith('image/')?'🖼️':mime?.includes('pdf')?'📄':mime?.includes('word')?'📝':mime?.includes('excel')||mime?.includes('sheet')?'📊':mime?.includes('zip')||mime?.includes('rar')?'🗜️':'📎'
  const colorToGradient=(c:string)=>`linear-gradient(135deg,${c}ee,${c}99)`

  // ── Note Editor ───────────────────────────────────────────────────────────
  if(selNote){return(
    <div dir="rtl" style={{height:'100vh',display:'flex',flexDirection:'column',background:'#fff',fontFamily:'Vazirmatn,sans-serif'}}>
      <style>{G}</style>
      <div style={{height:56,borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',padding:'0 1.5rem',gap:'1rem',background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,.05)'}}>
        <button onClick={()=>setSelNote(null)} className="btn btn-ghost" style={{gap:'.5rem'}}>
          <span style={{fontSize:'1rem'}}>←</span> برگشت
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'.5rem',color:'#bbb',fontSize:'.82rem'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:selP?.project.color}}/>
          <span>{selP?.project.title}</span>
          <span>›</span>
          <span style={{color:'#888'}}>{selNote.title}</span>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:.5,fontSize:'.75rem',color:saving?'#b8922a':'#ccc'}}>
          {saving&&<span style={{width:6,height:6,borderRadius:'50%',background:'#b8922a',display:'inline-block',animation:'pulse 1s infinite'}}/>}
          {saving?'در حال ذخیره...':'✓ ذخیره شد'}
        </div>
      </div>
      <input value={noteTitle} onChange={e=>handleNoteChange('title',e.target.value)} style={{border:'none',outline:'none',fontSize:'1.8rem',fontWeight:700,padding:'2rem 3rem .75rem',fontFamily:'Vazirmatn,sans-serif',color:'#0d1b2a',direction:'rtl',width:'100%'}} placeholder="عنوان یادداشت"/>
      <div style={{padding:'0 3rem .5rem',fontSize:'.78rem',color:'#ccc'}}>{fmtDateFull(selNote.updated_at)}</div>
      <textarea value={noteContent} onChange={e=>handleNoteChange('content',e.target.value)} style={{flex:1,border:'none',outline:'none',resize:'none',padding:'.5rem 3rem 3rem',fontFamily:'Vazirmatn,sans-serif',fontSize:'1.02rem',lineHeight:2.1,color:'#444',direction:'rtl',width:'100%'}} placeholder="شروع به نوشتن کنید..."/>
    </div>
  )}

  // ── Main Dashboard ────────────────────────────────────────────────────────
  return(
    <div dir="rtl" style={{height:'100vh',display:'flex',fontFamily:'Vazirmatn,sans-serif',background:'#f0f2f5',overflow:'hidden'}}>
      <style>{G}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{width:260,background:'#0d1b2a',display:'flex',flexDirection:'column',flexShrink:0,boxShadow:'2px 0 12px rgba(0,0,0,.15)'}}>
        {/* Logo */}
        <div style={{padding:'1.25rem 1rem 1rem',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <div style={{width:36,height:36,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(184,146,42,.3)'}}>
              <span style={{color:'#fff',fontWeight:800,fontSize:16}}>N</span>
            </div>
            <div style={{overflow:'hidden'}}>
              <div style={{color:'#fff',fontWeight:700,fontSize:'.88rem',letterSpacing:.2}}>فضای کار</div>
              <div style={{color:'rgba(255,255,255,.3)',fontSize:'.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
            </div>
          </div>
        </div>

        {/* Projects list */}
        <div style={{flex:1,overflowY:'auto',padding:'.75rem .5rem'}}>
          <div style={{padding:'.25rem .4rem .6rem',color:'rgba(255,255,255,.25)',fontSize:'.66rem',fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>پروژه‌ها</div>
          {projects.map(({project,role})=>(
            <button key={project.id} className={`si${selId===project.id?' act':''}`} onClick={()=>setSelId(project.id)}>
              <div style={{width:9,height:9,borderRadius:'50%',background:project.color,flexShrink:0,boxShadow:`0 0 6px ${project.color}88`}}/>
              <span style={{color:selId===project.id?'#fff':'rgba(255,255,255,.7)',fontSize:'.84rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:selId===project.id?600:400}}>{project.title}</span>
              {role==='owner'&&<span style={{fontSize:'.58rem',background:'rgba(184,146,42,.2)',color:'#d4aa45',padding:'.1rem .4rem',borderRadius:4,flexShrink:0,border:'1px solid rgba(184,146,42,.3)'}}>مالک</span>}
            </button>
          ))}

          <button onClick={()=>setShowNewProj(true)} style={{width:'100%',marginTop:'.5rem',padding:'.6rem .85rem',background:'none',border:'1.5px dashed rgba(255,255,255,.1)',borderRadius:10,color:'rgba(255,255,255,.3)',cursor:'pointer',fontFamily:'Vazirmatn,sans-serif',fontSize:'.8rem',textAlign:'right',transition:'all .2s'}}
            onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(184,146,42,.4)';e.currentTarget.style.color='rgba(184,146,42,.8)'}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.1)';e.currentTarget.style.color='rgba(255,255,255,.3)'}}>
            + پروژه جدید
          </button>
        </div>

        {/* User / Logout */}
        <div style={{padding:'.75rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <button onClick={()=>supabase.auth.signOut()} style={{width:'100%',padding:'.6rem',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)',borderRadius:8,color:'rgba(255,255,255,.35)',cursor:'pointer',fontFamily:'Vazirmatn,sans-serif',fontSize:'.78rem',transition:'all .2s'}}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(192,57,43,.15)';e.currentTarget.style.color='#ff8a75'}}
            onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.color='rgba(255,255,255,.35)'}}>
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {!selP ? (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.5rem',background:'#f0f2f5'}}>
            <div style={{width:80,height:80,borderRadius:20,background:'linear-gradient(135deg,#e8eaf0,#d5d8e0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem'}}>📁</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'1.1rem',fontWeight:700,color:'#333',marginBottom:'.4rem'}}>پروژه‌ای انتخاب نشده</div>
              <div style={{fontSize:'.85rem',color:'#aaa'}}>یک پروژه از منو انتخاب کن یا پروژه جدید بساز</div>
            </div>
            <button onClick={()=>setShowNewProj(true)} className="btn btn-dark">+ ایجاد پروژه جدید</button>
          </div>
        ) : (
          <>
            {/* Project Header */}
            <div style={{background:colorToGradient(selP.project.color),padding:'1.75rem 2rem 0',flexShrink:0,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-40,left:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,.07)',pointerEvents:'none'}}/>
              <div style={{position:'absolute',bottom:-60,right:60,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,.05)',pointerEvents:'none'}}/>
              <div style={{position:'relative',zIndex:1}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem'}}>
                  <div>
                    <div style={{color:'rgba(255,255,255,.6)',fontSize:'.75rem',marginBottom:'.3rem',fontWeight:500}}>پروژه</div>
                    <h1 style={{color:'#fff',fontSize:'1.5rem',fontWeight:800,textShadow:'0 2px 8px rgba(0,0,0,.2)',marginBottom:'.35rem'}}>{selP.project.title}</h1>
                    {selP.project.description&&<p style={{color:'rgba(255,255,255,.65)',fontSize:'.83rem',lineHeight:1.7}}>{selP.project.description}</p>}
                  </div>
                  <div style={{display:'flex',gap:'.5rem',alignItems:'center'}}>
                    <span style={{background:'rgba(255,255,255,.15)',backdropFilter:'blur(8px)',color:'#fff',padding:'.3rem .7rem',borderRadius:20,fontSize:'.72rem',fontWeight:600,border:'1px solid rgba(255,255,255,.2)'}}>
                      {isOwner?'مالک پروژه':'عضو پروژه'}
                    </span>
                  </div>
                </div>
                {/* Stats row */}
                <div style={{display:'flex',gap:'1.5rem',marginBottom:'1rem'}}>
                  {[['📝',notes.length,'یادداشت'],['📎',files.length,'فایل'],['👥',members.length,'عضو']].map(([icon,count,label])=>(
                    <div key={label as string} style={{display:'flex',alignItems:'center',gap:'.4rem'}}>
                      <span style={{fontSize:'.9rem'}}>{icon}</span>
                      <span style={{color:'#fff',fontWeight:700,fontSize:'.88rem'}}>{count}</span>
                      <span style={{color:'rgba(255,255,255,.55)',fontSize:'.78rem'}}>{label}</span>
                    </div>
                  ))}
                </div>
                {/* Tabs */}
                <div style={{display:'flex',gap:'.25rem',borderBottom:'none',marginTop:'.5rem'}}>
                  {(['notes','files',...(isOwner?['members']:[])]).map(id=>{
                    const labels:Record<string,string>={notes:'📝 یادداشت‌ها',files:'📎 فایل‌ها',members:'👥 اعضا'}
                    return(
                    <button key={id} onClick={()=>setActiveTab(id as typeof activeTab)} style={{padding:'.6rem 1.2rem',border:'none',background:activeTab===id?'rgba(255,255,255,.18)':'transparent',color:activeTab===id?'#fff':'rgba(255,255,255,.55)',borderRadius:'8px 8px 0 0',cursor:'pointer',fontFamily:'Vazirmatn,sans-serif',fontSize:'.82rem',fontWeight:activeTab===id?700:500,transition:'all .2s',backdropFilter:activeTab===id?'blur(8px)':'none'}}>
                      {labels[id]}
                    </button>
                  )})}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div style={{flex:1,overflowY:'auto',padding:'1.5rem 2rem',background:'#f0f2f5'}}>

              {/* ── NOTES TAB ── */}
              {activeTab==='notes'&&(
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <div style={{fontSize:'.82rem',color:'#888'}}>{notes.length} یادداشت</div>
                    <button onClick={createNote} className="btn btn-dark">+ یادداشت جدید</button>
                  </div>
                  {notes.length===0?(
                    <div style={{textAlign:'center',padding:'4rem 2rem',color:'#bbb'}}>
                      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📝</div>
                      <div style={{fontSize:'.95rem',fontWeight:600,color:'#888',marginBottom:'.4rem'}}>هنوز یادداشتی وجود ندارد</div>
                      <div style={{fontSize:'.82rem'}}>اولین یادداشت را بسازید</div>
                    </div>
                  ):(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1rem'}}>
                      {notes.map(note=>(
                        <div key={note.id} className="card" onClick={()=>openNote(note)} style={{cursor:'pointer',position:'relative'}}>
                          <div style={{height:5,background:colorToGradient(selP.project.color)}}/>
                          <div style={{padding:'1rem 1rem .85rem'}}>
                            <div style={{fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',marginBottom:'.5rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:'1.5rem'}}>{note.title}</div>
                            <div style={{fontSize:'.78rem',color:'#999',lineHeight:1.7,overflow:'hidden',maxHeight:'3.78rem',minHeight:'3.78rem'}}>{note.content||'بدون محتوا'}</div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'.85rem',paddingTop:'.7rem',borderTop:'1px solid #f5f5f5'}}>
                              <span style={{fontSize:'.68rem',color:'#ccc'}}>{fmtDate(note.updated_at)}</span>
                              <button onClick={e=>deleteNote(note.id,e)} className="btn btn-danger" style={{padding:'.25rem .55rem',fontSize:'.72rem',borderRadius:6}}>حذف</button>
                            </div>
                          </div>
                          <button onClick={e=>{e.stopPropagation();openNote(note)}} style={{position:'absolute',top:'.75rem',left:'.75rem',background:'none',border:'none',cursor:'pointer',color:'#ccc',fontSize:'.9rem',padding:'.2rem',transition:'color .15s'}}
                            onMouseOver={e=>e.currentTarget.style.color='#888'} onMouseOut={e=>e.currentTarget.style.color='#ccc'}>✏️</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── FILES TAB ── */}
              {activeTab==='files'&&(
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <div style={{fontSize:'.82rem',color:'#888'}}>{files.length} فایل</div>
                    <label className="btn btn-dark" style={{cursor:'pointer'}}>
                      {uploading?<><span style={{animation:'spin .8s linear infinite',display:'inline-block'}}>⟳</span> آپلود...</>:<>+ آپلود فایل</>}
                      <input type="file" onChange={uploadFile} style={{display:'none'}} disabled={uploading}/>
                    </label>
                  </div>
                  {files.length===0?(
                    <div style={{textAlign:'center',padding:'4rem 2rem',color:'#bbb'}}>
                      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📎</div>
                      <div style={{fontSize:'.95rem',fontWeight:600,color:'#888',marginBottom:'.4rem'}}>هنوز فایلی آپلود نشده</div>
                      <div style={{fontSize:'.82rem'}}>فایل‌های پروژه را اینجا آپلود کنید</div>
                    </div>
                  ):(
                    <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                      {files.map(f=>(
                        <div key={f.id} className="card" style={{cursor:'default'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.25rem'}}>
                            <div style={{width:44,height:44,borderRadius:10,background:`${selP.project.color}15`,border:`1px solid ${selP.project.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
                              {fileIcon(f.mime_type)}
                            </div>
                            <div style={{flex:1,overflow:'hidden'}}>
                              <div style={{fontWeight:600,fontSize:'.88rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'.2rem'}}>{f.name}</div>
                              <div style={{fontSize:'.72rem',color:'#bbb'}}>{fmtSize(f.size)} · {fmtDateFull(f.created_at)}</div>
                            </div>
                            <div style={{display:'flex',gap:'.5rem',flexShrink:0}}>
                              <button onClick={()=>downloadFile(f)} className="btn btn-ghost" style={{padding:'.4rem .8rem',fontSize:'.78rem'}}>دانلود</button>
                              <button onClick={e=>deleteFile(f,e)} className="btn btn-danger" style={{padding:'.4rem .75rem',fontSize:'.78rem'}}>حذف</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── MEMBERS TAB ── */}
              {activeTab==='members'&&isOwner&&(
                <div style={{maxWidth:600}}>
                  {/* Invite card */}
                  <div className="card" style={{marginBottom:'1.25rem',cursor:'default'}}>
                    <div style={{padding:'1.25rem'}}>
                      <div style={{fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',marginBottom:'.35rem'}}>دعوت همکار جدید</div>
                      <div style={{fontSize:'.78rem',color:'#aaa',marginBottom:'1rem'}}>همکار شما یک ایمیل دعوت دریافت می‌کند و فقط به این پروژه دسترسی خواهد داشت</div>
                      <div style={{display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                        <input className="inp" type="email" placeholder="ایمیل همکار را وارد کنید..." value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} style={{flex:1}}
                          onKeyDown={e=>e.key==='Enter'&&inviteMember()}/>
                        <button onClick={inviteMember} disabled={inviting||!inviteEmail.trim()} className="btn btn-gold" style={{flexShrink:0}}>
                          {inviting?'...':'ارسال دعوت'}
                        </button>
                      </div>
                      {inviteMsg&&<div style={{marginTop:'.75rem',padding:'.6rem .85rem',borderRadius:8,background:inviteMsg.startsWith('خطا')?'#fee2e2':'#dcfce7',color:inviteMsg.startsWith('خطا')?'#c0392b':'#15803d',fontSize:'.8rem'}}>{inviteMsg}</div>}
                    </div>
                  </div>

                  {/* Members list */}
                  <div style={{fontWeight:700,fontSize:'.82rem',color:'#888',marginBottom:'.75rem',textTransform:'uppercase',letterSpacing:.5}}>اعضای فعلی ({members.length})</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                    {members.map(m=>(
                      <div key={m.id} className="card" style={{cursor:'default'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.9rem 1.25rem'}}>
                          <div style={{width:40,height:40,borderRadius:'50%',background:m.role==='owner'?colorToGradient(selP.project.color):'linear-gradient(135deg,#e8eaf0,#d5d8e0)',display:'flex',alignItems:'center',justifyContent:'center',color:m.role==='owner'?'#fff':'#888',fontWeight:700,fontSize:'1rem',flexShrink:0,boxShadow:m.role==='owner'?`0 4px 12px ${selP.project.color}44`:'none'}}>
                            {(m.email||'U')[0].toUpperCase()}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:600,fontSize:'.88rem',color:'#1a1a2e',marginBottom:'.15rem'}}>{m.email||m.user_id}</div>
                            <div style={{fontSize:'.72rem',color:'#bbb'}}>{m.role==='owner'?'مالک پروژه':'عضو'} · از {fmtDate(m.joined_at)}</div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
                            <span style={{padding:'.25rem .65rem',borderRadius:20,fontSize:'.7rem',fontWeight:600,background:m.role==='owner'?`${selP.project.color}20`:'#f5f5f5',color:m.role==='owner'?selP.project.color:'#888',border:`1px solid ${m.role==='owner'?selP.project.color+'40':'#e0e0e0'}`}}>
                              {m.role==='owner'?'مالک':'عضو'}
                            </span>
                            {m.role!=='owner'&&<button onClick={()=>removeMember(m.id,m.user_id)} className="btn btn-danger" style={{padding:'.3rem .65rem',fontSize:'.75rem'}}>حذف</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── New Project Modal ─────────────────────────────────────────────── */}
      {showNewProj&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,backdropFilter:'blur(4px)'}} onClick={()=>setShowNewProj(false)}>
          <div style={{background:'#fff',borderRadius:18,padding:'2rem',width:420,direction:'rtl',boxShadow:'0 32px 64px rgba(0,0,0,.2)',animation:'fadeUp .25s ease'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:800,fontSize:'1.15rem',color:'#0d1b2a',marginBottom:'1.5rem'}}>پروژه جدید</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
              <div>
                <label style={{display:'block',fontSize:'.78rem',fontWeight:600,color:'#555',marginBottom:'.4rem'}}>نام پروژه *</label>
                <input className="inp" placeholder="مثلاً: پروژه تسهیلات بانکی" value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus onKeyDown={e=>e.key==='Enter'&&createProject()}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'.78rem',fontWeight:600,color:'#555',marginBottom:'.4rem'}}>توضیحات (اختیاری)</label>
                <input className="inp" placeholder="توضیح کوتاهی از این پروژه..." value={newDesc} onChange={e=>setNewDesc(e.target.value)}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'.78rem',fontWeight:600,color:'#555',marginBottom:'.6rem'}}>رنگ پروژه</label>
                <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
                  {COLORS.map(c=>(
                    <div key={c} onClick={()=>setNewColor(c)} style={{width:32,height:32,borderRadius:'50%',background:c,cursor:'pointer',border:newColor===c?`3px solid #0d1b2a`:'3px solid transparent',transition:'all .2s',boxShadow:newColor===c?`0 0 0 2px ${c}66`:'none'}}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:'.75rem',marginTop:'1.75rem'}}>
              <button onClick={()=>setShowNewProj(false)} className="btn btn-ghost" style={{flex:1,justifyContent:'center'}}>انصراف</button>
              <button onClick={createProject} disabled={creating||!newTitle.trim()} className="btn btn-gold" style={{flex:1,justifyContent:'center'}}>{creating?'...':'ایجاد پروژه'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [session, setSession] = useState<Session|null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setLoading(false)})
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session))
    return()=>subscription.unsubscribe()
  },[])
  if(loading)return(
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a1628'}}>
      <style>{G}</style>
      <div style={{width:40,height:40,border:'3px solid rgba(184,146,42,.25)',borderTop:'3px solid #b8922a',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
    </div>
  )
  return session?<Dashboard session={session}/>:<AuthScreen/>
}

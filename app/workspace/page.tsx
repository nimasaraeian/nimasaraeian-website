'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import { QUESTIONS, SECTIONS } from './data'
import type { QStatus } from './data'

// ─── Types ───────────────────────────────────────────────────────────────────
type Project = { id: string; title: string; description: string | null; color: string; owner_id: string }
type ProjectWithRole = { role: 'owner'|'member'; project: Project }
type Note = { id: string; title: string; content: string; project_id: string; created_at: string; updated_at: string }
type FileRecord = { id: string; name: string; size: number; mime_type: string; storage_path: string; project_id: string; created_at: string }
type Member = { id: string; user_id: string; role: 'owner'|'member'; joined_at: string; email?: string }
type QAnswer = { question_id: string; answer: string; status: QStatus; note: string }
type View = 'dashboard'|'questionnaire'|'question'|'notes'|'files'|'members'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const COLORS = ['#b8922a','#3b6cb7','#2e8b6e','#c0392b','#7d3c98','#1a7a8a','#d35400','#2c3e50']
const AUTOSAVE = 1200
const IS_LOAN_PROJECT = (title: string) => title.includes('تسهیلات') || title.includes('آتیه') || title.includes('وام')

// ─── Global Styles ────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:Vazirmatn,sans-serif}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:10px}
.nav-item{display:flex;align-items:center;gap:.6rem;padding:.55rem .85rem;border-radius:9px;cursor:pointer;border:none;background:none;width:100%;text-align:right;font-family:Vazirmatn,sans-serif;font-size:.82rem;color:rgba(255,255,255,.55);transition:all .18s}
.nav-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
.nav-item.active{background:rgba(184,146,42,.18);color:#fff;font-weight:600;border-right:3px solid #b8922a}
.nav-lbl{font-size:.62rem;font-weight:700;color:rgba(255,255,255,.22);letter-spacing:1.3px;text-transform:uppercase;padding:.45rem .85rem .25rem;margin-top:.35rem}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.48rem .95rem;border-radius:8px;border:none;cursor:pointer;font-family:Vazirmatn,sans-serif;font-size:.8rem;font-weight:600;transition:all .18s}
.btn:hover{opacity:.88;transform:translateY(-1px)}
.btn-gold{background:linear-gradient(135deg,#b8922a,#d4aa45);color:#fff}
.btn-dark{background:#0d1b2a;color:#fff}
.btn-ghost{background:transparent;border:1px solid #e0e0e0;color:#555}
.btn-ghost:hover{background:#f5f5f5}
.btn-danger{background:#fee2e2;color:#c0392b;border:1px solid #fecaca}
.card{background:#fff;border-radius:13px;border:1px solid #eaeaea;overflow:hidden}
.card-h{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.1rem;border-bottom:1px solid #f0f0f0}
.card-title{font-weight:700;font-size:.88rem;color:#1a1a2e}
.stat-card{background:#fff;border-radius:12px;border:1px solid #eaeaea;padding:.9rem 1.1rem}
.stat-lbl{font-size:.72rem;color:#aaa;font-weight:500;margin-bottom:.3rem}
.stat-val{font-size:1.5rem;font-weight:800;color:#1a1a2e;line-height:1}
.stat-val.green{color:#16a34a}.stat-val.red{color:#dc2626}.stat-val.orange{color:#d97706}.stat-val.gold{color:#b8922a}
.inp{padding:.62rem .9rem;border:1.5px solid #e0e0e0;border-radius:9px;font-family:Vazirmatn,sans-serif;font-size:.86rem;direction:rtl;outline:none;transition:border-color .2s;width:100%;background:#fff}
.inp:focus{border-color:#b8922a;box-shadow:0 0 0 3px rgba(184,146,42,.1)}
.q-row{display:flex;align-items:flex-start;gap:.85rem;padding:.85rem 1rem;border-radius:10px;cursor:pointer;border:1px solid #eaeaea;background:#fff;margin-bottom:.55rem;transition:all .18s;text-align:right}
.q-row:hover{border-color:#b8922a;box-shadow:0 2px 10px rgba(184,146,42,.1)}
.q-row.completed{border-right:3px solid #16a34a}
.q-row.draft{border-right:3px solid #d97706}
.q-row.unanswered{border-right:3px solid #e0e0e0}
.badge{display:inline-flex;align-items:center;padding:.2rem .55rem;border-radius:20px;font-size:.67rem;font-weight:600;gap:.25rem}
.badge-completed{background:#dcfce7;color:#16a34a}
.badge-draft{background:#fef3c7;color:#d97706}
.badge-unanswered{background:#f3f4f6;color:#9ca3af}
.badge-high{background:#fee2e2;color:#dc2626}
.badge-medium{background:#fef3c7;color:#d97706}
.badge-low{background:#f0f9ff;color:#0369a1}
.badge-required{background:#fce7f3;color:#be185d}
.prog-wrap{height:8px;background:#f0f0f0;border-radius:20px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,#b8922a,#d4aa45);border-radius:20px;transition:width .5s ease}
.section-item{display:flex;align-items:center;justify-content:space-between;padding:.6rem .85rem;border-radius:9px;cursor:pointer;transition:all .15s;gap:.75rem}
.section-item:hover{background:#f5f5f5}
.section-item.active{background:rgba(184,146,42,.08);border-right:2px solid #b8922a}
.section-num{width:24px;height:24px;border-radius:7px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:#666;flex-shrink:0}
.section-num.gold{background:#b8922a;color:#fff}
.ws-auth-inp{width:100%;padding:.85rem 1rem;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;color:#fff;font-size:.95rem;font-family:Vazirmatn,sans-serif;direction:ltr;text-align:left;outline:none;transition:all .2s}
.ws-auth-inp::placeholder{color:rgba(255,255,255,.35)}
.ws-auth-inp:focus{border-color:#b8922a;background:rgba(255,255,255,.1);box-shadow:0 0 0 3px rgba(184,146,42,.2)}
.ws-auth-inp:-webkit-autofill{-webkit-box-shadow:0 0 0 30px #1a2d4a inset;-webkit-text-fill-color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
`

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const [email,setEmail]=useState('');const [pw,setPw]=useState('')
  const [loading,setLoading]=useState(false);const [err,setErr]=useState('');const [ok,setOk]=useState('')
  const [mode,setMode]=useState<'login'|'signup'>('login')

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);setErr('');setOk('')
    if(mode==='login'){const{error}=await supabase.auth.signInWithPassword({email,password:pw});if(error)setErr(error.message)}
    else{const{error}=await supabase.auth.signUp({email,password:pw});if(error)setErr(error.message);else setOk('ایمیل تأیید ارسال شد.')}
    setLoading(false)
  }

  return(
    <div dir="rtl" style={{minHeight:'100vh',display:'flex',fontFamily:'Vazirmatn,sans-serif',background:'linear-gradient(135deg,#0a1628 0%,#0d2040 60%,#0a1628 100%)',position:'relative',overflow:'hidden'}}>
      <style>{G}</style>
      <div style={{position:'absolute',top:-100,right:-100,width:450,height:450,borderRadius:'50%',background:'radial-gradient(circle,rgba(184,146,42,.1) 0%,transparent 70%)',animation:'float 10s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'3rem 5rem',position:'relative'}}>
        <div style={{animation:'fadeUp .7s ease forwards'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'3rem'}}>
            <div style={{width:42,height:42,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(184,146,42,.4)'}}>
              <span style={{color:'#fff',fontWeight:800,fontSize:19}}>N</span>
            </div>
            <div>
              <div style={{color:'#fff',fontWeight:700,fontSize:'.9rem'}}>نیما سرائیان</div>
              <div style={{color:'rgba(255,255,255,.35)',fontSize:'.7rem'}}>Strategic Workspace</div>
            </div>
          </div>
          <h2 style={{color:'#fff',fontSize:'2.2rem',fontWeight:800,lineHeight:1.45,marginBottom:'1rem'}}>فضای کار<br/><span style={{color:'#d4aa45'}}>راهبردی</span></h2>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:'.85rem',lineHeight:1.9,maxWidth:320,marginBottom:'2.5rem'}}>پلتفرم اختصاصی مدیریت پروژه‌های مشاوره، پرسش‌نامه راهبردی و مستندات تیمی</p>
          {[['▦','پرسش‌نامه راهبردی ۸۹ سوالی با ردیابی پیشرفت'],['⊟','مدیریت مدارک و اسناد پروژه'],['✎','یادداشت‌های تیمی با ذخیره خودکار'],['◉','دسترسی چندکاربره با دعوت ایمیل']].map(([i,t],k)=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'.65rem'}}>
              <div style={{width:30,height:30,borderRadius:8,background:'rgba(184,146,42,.1)',border:'1px solid rgba(184,146,42,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.82rem',flexShrink:0,color:'#d4aa45'}}>{i}</div>
              <span style={{color:'rgba(255,255,255,.5)',fontSize:'.81rem'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{width:'100%',maxWidth:460,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',zIndex:2}}>
        <div style={{width:'100%',animation:'fadeUp .5s .1s ease both'}}>
          <div style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:'2.4rem',boxShadow:'0 32px 60px rgba(0,0,0,.3)'}}>
            <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
              <div style={{width:46,height:46,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto .9rem',boxShadow:'0 6px 18px rgba(184,146,42,.35)'}}>
                <span style={{color:'#fff',fontWeight:800,fontSize:20}}>N</span>
              </div>
              <h1 style={{color:'#fff',fontSize:'1.28rem',fontWeight:700,marginBottom:'.3rem'}}>{mode==='login'?'خوش آمدید':'ایجاد حساب کاربری'}</h1>
              <p style={{color:'rgba(255,255,255,.3)',fontSize:'.78rem'}}>{mode==='login'?'ورود به فضای کار راهبردی':'اطلاعات خود را وارد کنید'}</p>
            </div>
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:.9+'rem'}}>
              <div>
                <label style={{display:'block',color:'rgba(255,255,255,.45)',fontSize:'.73rem',marginBottom:'.35rem',fontWeight:500}}>ایمیل</label>
                <input className="ws-auth-inp" type="email" placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
              </div>
              <div>
                <label style={{display:'block',color:'rgba(255,255,255,.45)',fontSize:'.73rem',marginBottom:'.35rem',fontWeight:500}}>رمز عبور</label>
                <input className="ws-auth-inp" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} required autoComplete={mode==='login'?'current-password':'new-password'}/>
              </div>
              {err&&<div style={{background:'rgba(220,38,38,.15)',border:'1px solid rgba(220,38,38,.3)',borderRadius:8,padding:'.6rem .85rem',color:'#fca5a5',fontSize:'.78rem'}}>{err}</div>}
              {ok&&<div style={{background:'rgba(22,163,74,.15)',border:'1px solid rgba(22,163,74,.3)',borderRadius:8,padding:'.6rem .85rem',color:'#86efac',fontSize:'.78rem'}}>{ok}</div>}
              <button type="submit" disabled={loading} className="btn btn-gold" style={{width:'100%',justifyContent:'center',padding:'.82rem',fontSize:'.92rem',borderRadius:10,marginTop:'.2rem',opacity:loading?.55:1}}>
                {loading?'...':mode==='login'?'ورود به فضای کار':'ایجاد حساب'}
              </button>
            </form>
            <div style={{marginTop:'1.35rem',textAlign:'center',borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:'1.1rem'}}>
              <span style={{color:'rgba(255,255,255,.28)',fontSize:'.78rem'}}>{mode==='login'?'حساب ندارید؟ ':'حساب دارید؟ '}</span>
              <button onClick={()=>{setMode(m=>m==='login'?'signup':'login');setErr('');setOk('')}} style={{background:'none',border:'none',color:'#d4aa45',cursor:'pointer',fontWeight:600,fontSize:'.78rem',fontFamily:'inherit',padding:0}}>{mode==='login'?'ثبت‌نام':'ورود'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({session}:{session:Session}){
  const user=session.user
  const [projects,setProjects]=useState<ProjectWithRole[]>([])
  const [selId,setSelId]=useState<string|null>(null)
  const [view,setView]=useState<View>('dashboard')
  const [selQId,setSelQId]=useState<string|null>(null)
  // data
  const [notes,setNotes]=useState<Note[]>([])
  const [files,setFiles]=useState<FileRecord[]>([])
  const [members,setMembers]=useState<Member[]>([])
  const [answers,setAnswers]=useState<Record<string,QAnswer>>({})
  // ui state
  const [activeSection,setActiveSection]=useState<number|null>(null)
  const [statusFilter,setStatusFilter]=useState<QStatus|''>('')
  const [search,setSearch]=useState('')
  const [uploading,setUploading]=useState(false)
  const [inviteEmail,setInviteEmail]=useState('');const [inviting,setInviting]=useState(false);const [inviteMsg,setInviteMsg]=useState('')
  const [showNewProj,setShowNewProj]=useState(false)
  const [newTitle,setNewTitle]=useState('');const [newDesc,setNewDesc]=useState('');const [newColor,setNewColor]=useState(COLORS[0])
  const [creating,setCreating]=useState(false)
  // note editor
  const [selNote,setSelNote]=useState<Note|null>(null)
  const [noteTitle,setNoteTitle]=useState('');const [noteContent,setNoteContent]=useState('')
  const [saving,setSaving]=useState(false)
  const autosaveRef=useRef<ReturnType<typeof setTimeout>|null>(null)

  const selP=projects.find(p=>p.project.id===selId)
  const isOwner=selP?.role==='owner'
  const isLoan=selP?IS_LOAN_PROJECT(selP.project.title):false

  const loadProjects=async()=>{
    const{data:{session}}=await supabase.auth.getSession()
    const token=session?.access_token
    if(!token)return
    const res=await fetch('/api/workspace/projects',{headers:{Authorization:`Bearer ${token}`}})
    const data=await res.json()
    if(Array.isArray(data)&&data.length>0){
      const m=(data as any[]).map(d=>({role:d.role,project:d.projects})).filter(d=>d.project)
      setProjects(m);if(m.length>0&&!selId)setSelId(m[0].project.id)
    }
  }
  useEffect(()=>{loadProjects()},[])
  useEffect(()=>{if(!selId)return;setView('dashboard');setSelNote(null);setActiveSection(null);loadNotes();loadFiles();loadMembers();if(isLoan)loadAnswers()},[selId])
  useEffect(()=>{if(selId&&isLoan)loadAnswers()},[selId,isLoan])

  const loadNotes=async()=>{const{data}=await supabase.from('notes').select('*').eq('project_id',selId!).order('updated_at',{ascending:false});if(data)setNotes(data)}
  const loadFiles=async()=>{const{data}=await supabase.from('files').select('*').eq('project_id',selId!).order('created_at',{ascending:false});if(data)setFiles(data)}
  const loadMembers=async()=>{
    const{data:md}=await supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id',selId!)
    if(!md)return
    const{data:pd}=await supabase.from('profiles').select('id,email').in('id',md.map(m=>m.user_id))
    const pm:Record<string,string>={};pd?.forEach(p=>{pm[p.id]=p.email})
    setMembers(md.map(m=>({...m,email:pm[m.user_id]})))
  }
  const loadAnswers=async()=>{
    const{data}=await supabase.from('questionnaire_answers').select('question_id,answer,status,note').eq('project_id',selId!)
    if(data){const m:Record<string,QAnswer>={};data.forEach((a:any)=>{m[a.question_id]=a});setAnswers(m)}
  }

  // ── Stats ──
  const totalQ=QUESTIONS.length
  const completedQ=QUESTIONS.filter(q=>answers[q.id]?.status==='completed').length
  const draftQ=QUESTIONS.filter(q=>answers[q.id]?.status==='draft').length
  const highUnanswered=QUESTIONS.filter(q=>q.priority==='high'&&!answers[q.id]?.status||answers[q.id]?.status==='unanswered').length
  const pct=totalQ?Math.round(completedQ/totalQ*100):0

  // ── Filtered questions ──
  const filteredQ=QUESTIONS.filter(q=>{
    if(activeSection&&q.section!==activeSection)return false
    if(statusFilter){const s=answers[q.id]?.status||'unanswered';if(s!==statusFilter)return false}
    if(search&&!q.title.includes(search))return false
    return true
  })

  // ── Answer update ──
  const updateAnswer=async(qId:string,field:'answer'|'status'|'note',value:string)=>{
    setAnswers(prev=>{const cur=prev[qId]||{question_id:qId,answer:'',status:'unanswered',note:''};return{...prev,[qId]:{...cur,[field]:value}}})
    const cur=answers[qId]||{answer:'',status:'unanswered',note:''}
    await supabase.from('questionnaire_answers').upsert({project_id:selId!,question_id:qId,...cur,[field]:value,updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:'project_id,question_id'})
  }

  // ── Notes ──
  const openNote=(n:Note)=>{setSelNote(n);setNoteTitle(n.title);setNoteContent(n.content)}
  const handleNoteChange=(f:'title'|'content',v:string)=>{
    if(f==='title')setNoteTitle(v);else setNoteContent(v)
    if(autosaveRef.current)clearTimeout(autosaveRef.current)
    autosaveRef.current=setTimeout(()=>{const t=f==='title'?v:noteTitle;const c=f==='content'?v:noteContent;saveNote(t,c)},AUTOSAVE)
  }
  const saveNote=async(title:string,content:string)=>{if(!selNote)return;setSaving(true);await supabase.from('notes').update({title,content}).eq('id',selNote.id);setSaving(false);setNotes(ns=>ns.map(n=>n.id===selNote.id?{...n,title,content}:n))}
  const createNote=async()=>{const{data}=await supabase.from('notes').insert({title:'یادداشت جدید',content:'',project_id:selId!,author_id:user.id}).select().single();if(data){setNotes(ns=>[data,...ns]);openNote(data)}}
  const deleteNote=async(id:string,e:React.MouseEvent)=>{e.stopPropagation();await supabase.from('notes').delete().eq('id',id);setNotes(ns=>ns.filter(n=>n.id!==id));if(selNote?.id===id)setSelNote(null)}

  // ── Files ──
  const uploadFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];if(!file)return;setUploading(true)
    const path=`${selId}/${Date.now()}_${file.name}`
    const{error}=await supabase.storage.from('workspace-files').upload(path,file)
    if(!error){const{data}=await supabase.from('files').insert({name:file.name,size:file.size,mime_type:file.type,storage_path:path,project_id:selId!,uploader_id:user.id}).select().single();if(data)setFiles(fs=>[data,...fs])}
    setUploading(false);e.target.value=''
  }
  const downloadFile=async(f:FileRecord)=>{const{data}=await supabase.storage.from('workspace-files').download(f.storage_path);if(data){const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=f.name;a.click();URL.revokeObjectURL(url)}}
  const deleteFile=async(f:FileRecord,e:React.MouseEvent)=>{e.stopPropagation();await supabase.storage.from('workspace-files').remove([f.storage_path]);await supabase.from('files').delete().eq('id',f.id);setFiles(fs=>fs.filter(x=>x.id!==f.id))}

  // ── Project creation ──
  const createProject=async()=>{if(!newTitle.trim())return;setCreating(true);const{data}=await supabase.from('projects').insert({title:newTitle,description:newDesc||null,color:newColor,owner_id:user.id}).select().single();if(data){await loadProjects();setSelId(data.id);setShowNewProj(false);setNewTitle('');setNewDesc('')};setCreating(false)}
  const inviteMember=async()=>{
    if(!inviteEmail.trim()||!selId)return;setInviting(true);setInviteMsg('')
    try{const res=await fetch('/api/workspace/invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:inviteEmail,projectId:selId,inviterId:user.id})});const j=await res.json();if(j.error)setInviteMsg('خطا: '+j.error);else{setInviteMsg('دعوت‌نامه ارسال شد ✓');setInviteEmail('');await loadMembers()}}catch{setInviteMsg('خطا در ارسال')}
    setInviting(false)
  }
  const removeMember=async(memberId:string,userId:string)=>{if(userId===user.id)return;await supabase.from('project_members').delete().eq('id',memberId);setMembers(ms=>ms.filter(m=>m.id!==memberId))}

  const fmtSize=(b:number)=>b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB'
  const fmtDate=(d:string)=>new Date(d).toLocaleDateString('fa-IR',{month:'short',day:'numeric'})
  const fileIcon=(mime:string)=>mime?.startsWith('image/')?'🖼️':mime?.includes('pdf')?'📄':mime?.includes('word')?'📝':mime?.includes('excel')||mime?.includes('sheet')?'📊':'📎'
  const statusLabel=(s:QStatus|undefined)=>s==='completed'?'تکمیل‌شده':s==='draft'?'پیش‌نویس':'بدون پاسخ'
  const prioLabel=(p:string)=>p==='high'?'بالا':p==='medium'?'متوسط':'پایین'

  // ─────────────────────────────────────────────────────────────────────────────
  // NOTE EDITOR
  if(selNote){return(
    <div dir="rtl" style={{height:'100vh',display:'flex',flexDirection:'column',background:'#fff',fontFamily:'Vazirmatn,sans-serif'}}>
      <style>{G}</style>
      <div style={{height:52,borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',padding:'0 1.5rem',gap:'.85rem',flexShrink:0}}>
        <button onClick={()=>setSelNote(null)} className="btn btn-ghost" style={{gap:'.4rem',fontSize:'.8rem'}}>← برگشت</button>
        <div style={{color:'#ccc',fontSize:'.75rem',display:'flex',alignItems:'center',gap:'.4rem'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:selP?.project.color}}/>
          {selP?.project.title} › {selNote.title}
        </div>
        <div style={{flex:1}}/>
        <div style={{fontSize:'.72rem',color:saving?'#b8922a':'#ccc'}}>{saving?'در حال ذخیره...':'✓ ذخیره شد'}</div>
      </div>
      <input value={noteTitle} onChange={e=>handleNoteChange('title',e.target.value)} style={{border:'none',outline:'none',fontSize:'1.7rem',fontWeight:700,padding:'1.75rem 3rem .6rem',fontFamily:'Vazirmatn,sans-serif',color:'#0d1b2a',direction:'rtl',width:'100%'}} placeholder="عنوان یادداشت"/>
      <div style={{padding:'0 3rem .5rem',fontSize:'.75rem',color:'#ccc'}}>{fmtDate(selNote.updated_at)}</div>
      <textarea value={noteContent} onChange={e=>handleNoteChange('content',e.target.value)} style={{flex:1,border:'none',outline:'none',resize:'none',padding:'.5rem 3rem 3rem',fontFamily:'Vazirmatn,sans-serif',fontSize:'1rem',lineHeight:2.1,color:'#444',direction:'rtl'}} placeholder="شروع به نوشتن کنید..."/>
    </div>
  )}

  // ─────────────────────────────────────────────────────────────────────────────
  // QUESTION DETAIL
  const selQ=QUESTIONS.find(q=>q.id===selQId)
  if(view==='question'&&selQ){
    const ans=answers[selQ.id]||{answer:'',status:'unanswered',note:''}
    return(
      <div dir="rtl" style={{height:'100vh',display:'flex',flexDirection:'column',background:'#f8f9fb',fontFamily:'Vazirmatn,sans-serif'}}>
        <style>{G}</style>
        <div style={{height:52,borderBottom:'1px solid #eaeaea',background:'#fff',display:'flex',alignItems:'center',padding:'0 1.5rem',gap:'.85rem',flexShrink:0}}>
          <button onClick={()=>setView('questionnaire')} className="btn btn-ghost" style={{fontSize:'.8rem'}}>← برگشت به پرسش‌نامه</button>
          <div style={{color:'#ccc',fontSize:'.75rem'}}>سوال {selQ.id}</div>
          <div style={{flex:1}}/>
          <span className={`badge badge-${ans.status||'unanswered'}`}>{statusLabel(ans.status as QStatus)}</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'2rem 3rem'}}>
          <div style={{maxWidth:780,margin:'0 auto'}}>
            <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
              <span className={`badge badge-${selQ.priority}`}>{prioLabel(selQ.priority)}</span>
              {selQ.required&&<span className="badge badge-required">الزامی</span>}
              <span style={{fontSize:'.72rem',color:'#aaa',marginRight:'auto'}}>بخش {selQ.section}: {SECTIONS.find(s=>s.id===selQ.section)?.title}</span>
            </div>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#0d1b2a',marginBottom:'1rem',lineHeight:1.65}}>{selQ.title}</h2>
            <div style={{background:'rgba(184,146,42,.06)',border:'1px solid rgba(184,146,42,.15)',borderRadius:10,padding:'.85rem 1rem',marginBottom:'1.5rem'}}>
              <div style={{fontSize:'.72rem',fontWeight:700,color:'#b8922a',marginBottom:'.3rem'}}>راهنما</div>
              <div style={{fontSize:'.82rem',color:'#666',lineHeight:1.8}}>{selQ.guidance}</div>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontWeight:700,fontSize:'.82rem',color:'#333',marginBottom:'.5rem'}}>پاسخ</label>
              <textarea value={ans.answer} onChange={e=>updateAnswer(selQ.id,'answer',e.target.value)} style={{width:'100%',minHeight:180,padding:'1rem',border:'1.5px solid #e0e0e0',borderRadius:10,fontFamily:'Vazirmatn,sans-serif',fontSize:'.9rem',lineHeight:1.9,direction:'rtl',outline:'none',resize:'vertical'}} onFocus={e=>e.target.style.borderColor='#b8922a'} onBlur={e=>e.target.style.borderColor='#e0e0e0'} placeholder="پاسخ خود را اینجا بنویسید..."/>
            </div>
            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',fontWeight:700,fontSize:'.82rem',color:'#333',marginBottom:'.5rem'}}>یادداشت داخلی</label>
              <textarea value={ans.note} onChange={e=>updateAnswer(selQ.id,'note',e.target.value)} style={{width:'100%',minHeight:80,padding:'.85rem',border:'1.5px solid #e0e0e0',borderRadius:10,fontFamily:'Vazirmatn,sans-serif',fontSize:'.85rem',lineHeight:1.8,direction:'rtl',outline:'none',resize:'vertical',background:'#fafafa'}} placeholder="یادداشت محرمانه یا توضیحات اضافه..." onFocus={e=>e.target.style.borderColor='#b8922a'} onBlur={e=>e.target.style.borderColor='#e0e0e0'}/>
            </div>
            <div style={{display:'flex',gap:'.65rem',flexWrap:'wrap'}}>
              {(['unanswered','draft','completed'] as QStatus[]).map(s=>(
                <button key={s} onClick={()=>updateAnswer(selQ.id,'status',s)} className={`btn ${ans.status===s?'btn-gold':'btn-ghost'}`} style={{padding:'.5rem 1rem',fontSize:'.8rem'}}>
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN LAYOUT
  return(
    <div dir="rtl" style={{height:'100vh',display:'flex',fontFamily:'Vazirmatn,sans-serif',background:'#f0f2f5',overflow:'hidden'}}>
      <style>{G}</style>

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside style={{width:252,background:'#0d1b2a',display:'flex',flexDirection:'column',flexShrink:0,boxShadow:'2px 0 12px rgba(0,0,0,.15)',overflowY:'auto'}}>
        {/* Brand */}
        <div style={{padding:'1.1rem .9rem 1rem',borderBottom:'1px solid rgba(255,255,255,.05)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'.7rem'}}>
            <div style={{width:34,height:34,background:'linear-gradient(135deg,#b8922a,#d4aa45)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 3px 10px rgba(184,146,42,.3)'}}>
              <span style={{color:'#fff',fontWeight:800,fontSize:15}}>N</span>
            </div>
            <div style={{overflow:'hidden'}}>
              <div style={{color:'#fff',fontWeight:700,fontSize:'.82rem'}}>فضای کار راهبردی</div>
              <div style={{color:'rgba(255,255,255,.28)',fontSize:'.64rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
            </div>
          </div>
        </div>

        {/* Project list */}
        <div style={{padding:'.6rem .5rem .25rem',flexShrink:0}}>
          <div className="nav-lbl">پروژه‌ها</div>
          {projects.map(({project,role})=>(
            <button key={project.id} className={`nav-item${selId===project.id?' active':''}`} onClick={()=>{setSelId(project.id);setView('dashboard')}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:project.color,flexShrink:0,boxShadow:`0 0 5px ${project.color}88`}}/>
              <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{project.title}</span>
              {role==='owner'&&<span style={{fontSize:'.56rem',background:'rgba(184,146,42,.2)',color:'#d4aa45',padding:'.1rem .35rem',borderRadius:3,flexShrink:0}}>مالک</span>}
            </button>
          ))}
          <button onClick={()=>setShowNewProj(true)} style={{width:'100%',margin:'.35rem 0 .15rem',padding:'.5rem .85rem',background:'none',border:'1.5px dashed rgba(255,255,255,.1)',borderRadius:9,color:'rgba(255,255,255,.28)',cursor:'pointer',fontFamily:'Vazirmatn,sans-serif',fontSize:'.76rem',textAlign:'right',transition:'all .18s'}}
            onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(184,146,42,.4)';e.currentTarget.style.color='rgba(184,146,42,.8)'}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.1)';e.currentTarget.style.color='rgba(255,255,255,.28)'}}>
            + پروژه جدید
          </button>
        </div>

        {/* Project Navigation */}
        {selP&&(
          <div style={{padding:'.15rem .5rem .5rem',borderTop:'1px solid rgba(255,255,255,.05)',marginTop:'.35rem',flexShrink:0}}>
            <div className="nav-lbl">پروژه جاری</div>
            <button className={`nav-item${view==='dashboard'?' active':''}`} onClick={()=>setView('dashboard')}>
              <span style={{fontSize:'.82rem'}}>▦</span> داشبورد پروژه
            </button>
            {isLoan&&(
              <button className={`nav-item${view==='questionnaire'||view==='question'?' active':''}`} onClick={()=>setView('questionnaire')}>
                <span style={{fontSize:'.82rem'}}>≡</span> پرسش‌نامه راهبردی
                {pct>0&&<span style={{marginRight:'auto',fontSize:'.6rem',background:'rgba(184,146,42,.2)',color:'#d4aa45',padding:'.1rem .4rem',borderRadius:3}}>{pct}٪</span>}
              </button>
            )}
            <button className={`nav-item${view==='notes'?' active':''}`} onClick={()=>setView('notes')}>
              <span style={{fontSize:'.82rem'}}>✎</span> یادداشت‌ها
              <span style={{marginRight:'auto',fontSize:'.6rem',color:'rgba(255,255,255,.25)'}}>{notes.length}</span>
            </button>
            <button className={`nav-item${view==='files'?' active':''}`} onClick={()=>setView('files')}>
              <span style={{fontSize:'.82rem'}}>⊟</span> مدارک و مستندات
              <span style={{marginRight:'auto',fontSize:'.6rem',color:'rgba(255,255,255,.25)'}}>{files.length}</span>
            </button>
            {isOwner&&(
              <button className={`nav-item${view==='members'?' active':''}`} onClick={()=>setView('members')}>
                <span style={{fontSize:'.82rem'}}>◉</span> اعضای پروژه
                <span style={{marginRight:'auto',fontSize:'.6rem',color:'rgba(255,255,255,.25)'}}>{members.length}</span>
              </button>
            )}
          </div>
        )}

        {/* Logout */}
        <div style={{flex:1}}/>
        <div style={{padding:'.75rem',borderTop:'1px solid rgba(255,255,255,.05)',flexShrink:0}}>
          <button onClick={()=>supabase.auth.signOut()} style={{width:'100%',padding:'.55rem',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)',borderRadius:8,color:'rgba(255,255,255,.3)',cursor:'pointer',fontFamily:'Vazirmatn,sans-serif',fontSize:'.76rem',transition:'all .18s'}}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(220,38,38,.15)';e.currentTarget.style.color='#fca5a5'}}
            onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.color='rgba(255,255,255,.3)'}}>
            خروج از سیستم
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {!selP?(
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.25rem'}}>
            <div style={{fontSize:'3rem'}}>📁</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontWeight:700,color:'#333',marginBottom:'.3rem'}}>پروژه‌ای انتخاب نشده</div>
              <div style={{fontSize:'.83rem',color:'#aaa'}}>از منوی سمت راست یک پروژه انتخاب کنید</div>
            </div>
            <button onClick={()=>setShowNewProj(true)} className="btn btn-dark">+ پروژه جدید</button>
          </div>
        ):(
          <>
            {/* Project header band */}
            <div style={{background:`linear-gradient(135deg,${selP.project.color}ee,${selP.project.color}99)`,padding:'1.25rem 1.75rem .7rem',flexShrink:0,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-50,left:-50,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,.07)',pointerEvents:'none'}}/>
              <div style={{position:'relative',zIndex:1}}>
                <div style={{color:'rgba(255,255,255,.55)',fontSize:'.7rem',marginBottom:'.2rem',fontWeight:500}}>پروژه جاری</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <h1 style={{color:'#fff',fontSize:'1.25rem',fontWeight:800,textShadow:'0 2px 6px rgba(0,0,0,.15)'}}>{selP.project.title}</h1>
                  <div style={{display:'flex',gap:'.85rem',fontSize:'.75rem',color:'rgba(255,255,255,.7)'}}>
                    {isLoan&&<span>{pct}٪ تکمیل</span>}
                    <span>{notes.length} یادداشت</span>
                    <span>{files.length} فایل</span>
                    <span>{members.length} عضو</span>
                  </div>
                </div>
                {isLoan&&(
                  <div style={{marginTop:'.6rem'}}>
                    <div className="prog-wrap" style={{height:5}}>
                      <div className="prog-fill" style={{width:`${pct}%`}}/>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content area */}
            <div style={{flex:1,overflowY:'auto',padding:'1.4rem 1.75rem'}}>

              {/* ── DASHBOARD VIEW ── */}
              {view==='dashboard'&&(
                <div>
                  {/* Stats grid */}
                  {isLoan&&(
                    <>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:'.75rem',marginBottom:'1.25rem'}}>
                        {[['کل سوالات',totalQ,''],['تکمیل‌شده',completedQ,'green'],['پیش‌نویس',draftQ,'orange'],['اولویت‌بالا بی‌پاسخ',highUnanswered,'red'],['یادداشت‌ها',notes.length,''],['مدارک',files.length,''],['اعضا',members.length,''],['پیشرفت کلی',pct+'٪','gold']].map(([l,v,c])=>(
                          <div key={l as string} className="stat-card">
                            <div className="stat-lbl">{l}</div>
                            <div className={`stat-val ${c}`}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Progress card */}
                      <div className="card" style={{marginBottom:'1.25rem',borderTop:`3px solid ${selP.project.color}`}}>
                        <div style={{padding:'1rem 1.25rem'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.7rem'}}>
                            <div>
                              <div style={{fontWeight:700,fontSize:'.9rem',color:'#1a1a2e'}}>پیشرفت کلی پرونده</div>
                              <div style={{fontSize:'.75rem',color:'#aaa',marginTop:'.2rem'}}>{completedQ} سوال تکمیل‌شده از {totalQ} سوال</div>
                            </div>
                            <div style={{fontSize:'1.85rem',fontWeight:800,color:selP.project.color}}>{pct}٪</div>
                          </div>
                          <div className="prog-wrap"><div className="prog-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${selP.project.color},${selP.project.color}99)`}}/></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Module cards */}
                  <div className="card">
                    <div className="card-h"><div className="card-title">بخش‌های پروژه</div></div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'.75rem',padding:'1rem'}}>
                      {[
                        isLoan?{icon:'≡',title:'پرسش‌نامه راهبردی',sub:`${totalQ} سوال · ${pct}٪ تکمیل`,action:()=>setView('questionnaire')}:null,
                        {icon:'✎',title:'یادداشت‌ها',sub:`${notes.length} یادداشت`,action:()=>setView('notes')},
                        {icon:'⊟',title:'مدارک و مستندات',sub:`${files.length} فایل`,action:()=>setView('files')},
                        isOwner?{icon:'◉',title:'اعضای پروژه',sub:`${members.length} عضو`,action:()=>setView('members')}:null,
                      ].filter(Boolean).map((m:any)=>(
                        <div key={m.title} onClick={m.action} style={{border:'1px solid #eaeaea',borderRadius:11,padding:'.9rem',cursor:'pointer',transition:'all .2s'}}
                          onMouseOver={e=>{e.currentTarget.style.borderColor=selP.project.color;e.currentTarget.style.boxShadow=`0 4px 14px ${selP.project.color}22`}}
                          onMouseOut={e=>{e.currentTarget.style.borderColor='#eaeaea';e.currentTarget.style.boxShadow='none'}}>
                          <div style={{fontSize:'1.4rem',marginBottom:'.5rem',color:selP.project.color}}>{m.icon}</div>
                          <div style={{fontWeight:700,fontSize:'.85rem',color:'#1a1a2e',marginBottom:'.25rem'}}>{m.title}</div>
                          <div style={{fontSize:'.72rem',color:'#aaa'}}>{m.sub}</div>
                          <div style={{fontSize:'.72rem',color:selP.project.color,marginTop:'.6rem',fontWeight:600}}>باز کردن ←</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action items */}
                  {isLoan&&(highUnanswered>0||draftQ>0||files.length===0)&&(
                    <div className="card" style={{marginTop:'1rem'}}>
                      <div className="card-h"><div className="card-title">اقدامات پیشنهادی</div></div>
                      <div style={{padding:'.75rem 1rem',display:'flex',flexDirection:'column',gap:'.5rem'}}>
                        {highUnanswered>0&&(
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.65rem .85rem',background:'#fee2e2',borderRadius:9}}>
                            <div style={{display:'flex',gap:'.6rem',alignItems:'center'}}><span>⚠</span><span style={{fontSize:'.82rem'}}>{highUnanswered} سوال اولویت‌بالا پاسخ ندارد</span></div>
                            <button className="btn btn-ghost" style={{fontSize:'.75rem',padding:'.35rem .7rem'}} onClick={()=>{setView('questionnaire');setStatusFilter('unanswered')}}>رفع نواقص</button>
                          </div>
                        )}
                        {draftQ>0&&(
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.65rem .85rem',background:'#fef3c7',borderRadius:9}}>
                            <div style={{display:'flex',gap:'.6rem',alignItems:'center'}}><span>◑</span><span style={{fontSize:'.82rem'}}>{draftQ} پاسخ در حالت پیش‌نویس هستند</span></div>
                            <button className="btn btn-ghost" style={{fontSize:'.75rem',padding:'.35rem .7rem'}} onClick={()=>{setView('questionnaire');setStatusFilter('draft')}}>بررسی</button>
                          </div>
                        )}
                        {files.length===0&&(
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.65rem .85rem',background:'#e0f2fe',borderRadius:9}}>
                            <div style={{display:'flex',gap:'.6rem',alignItems:'center'}}><span>⊟</span><span style={{fontSize:'.82rem'}}>هیچ مدرکی بارگذاری نشده است</span></div>
                            <button className="btn btn-ghost" style={{fontSize:'.75rem',padding:'.35rem .7rem'}} onClick={()=>setView('files')}>بارگذاری مدارک</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── QUESTIONNAIRE VIEW ── */}
              {(view==='questionnaire')&&isLoan&&(
                <div>
                  {/* Header */}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'.5rem'}}>
                    <div>
                      <h2 style={{fontWeight:800,fontSize:'1.05rem',color:'#1a1a2e'}}>پرسش‌نامه راهبردی</h2>
                      <div style={{fontSize:'.75rem',color:'#aaa',marginTop:'.2rem'}}>{completedQ} از {totalQ} تکمیل‌شده · {pct}٪</div>
                    </div>
                    <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
                      <input className="inp" placeholder="جستجو در سوالات..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:200}}/>
                      <select className="inp" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as QStatus|'')} style={{width:'auto'}}>
                        <option value="">همه وضعیت‌ها</option>
                        <option value="unanswered">بدون پاسخ</option>
                        <option value="draft">پیش‌نویس</option>
                        <option value="completed">تکمیل‌شده</option>
                      </select>
                      {(activeSection||statusFilter||search)&&<button onClick={()=>{setActiveSection(null);setStatusFilter('');setSearch('')}} className="btn btn-ghost" style={{fontSize:'.78rem'}}>× پاک</button>}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{marginBottom:'1.1rem'}}>
                    <div className="prog-wrap"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'1rem',alignItems:'start'}}>
                    {/* Sections sidebar */}
                    <div className="card" style={{position:'sticky',top:0}}>
                      <div style={{padding:'.65rem .75rem .4rem'}}>
                        <div style={{fontSize:'.68rem',fontWeight:700,color:'#aaa',letterSpacing:.8,marginBottom:'.35rem'}}>بخش‌ها ({SECTIONS.length})</div>
                        <div className={`section-item${!activeSection?' active':''}`} onClick={()=>setActiveSection(null)}>
                          <div style={{display:'flex',alignItems:'center',gap:'.55rem'}}>
                            <div className="section-num gold">∑</div>
                            <span style={{fontSize:'.78rem',fontWeight:600,color:'#333'}}>همه سوالات</span>
                          </div>
                          <span style={{fontSize:'.68rem',color:'#b8922a',fontWeight:700}}>{totalQ}</span>
                        </div>
                        {SECTIONS.map(sec=>{
                          const secQs=QUESTIONS.filter(q=>q.section===sec.id)
                          const done=secQs.filter(q=>answers[q.id]?.status==='completed').length
                          const pctSec=secQs.length?Math.round(done/secQs.length*100):0
                          return(
                            <div key={sec.id} className={`section-item${activeSection===sec.id?' active':''}`} onClick={()=>setActiveSection(sec.id)}>
                              <div style={{display:'flex',alignItems:'center',gap:'.55rem',flex:1,overflow:'hidden'}}>
                                <div className="section-num">{sec.id}</div>
                                <span style={{fontSize:'.75rem',color:'#333',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sec.title}</span>
                              </div>
                              <span style={{fontSize:'.65rem',color:done>0?'#16a34a':'#aaa',fontWeight:700,flexShrink:0}}>{done}/{secQs.length}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Questions list */}
                    <div>
                      <div style={{fontSize:'.75rem',color:'#aaa',marginBottom:'.6rem',fontWeight:600}}>{filteredQ.length} سوال</div>
                      {filteredQ.length===0?(
                        <div style={{textAlign:'center',padding:'3rem',color:'#ccc'}}>
                          <div style={{fontSize:'2rem',marginBottom:'.75rem'}}>≡</div>
                          <div style={{fontWeight:700,color:'#888',marginBottom:'.3rem'}}>سوالی یافت نشد</div>
                          <div style={{fontSize:'.82rem'}}>فیلترها را تغییر دهید</div>
                        </div>
                      ):filteredQ.map(q=>{
                        const s=answers[q.id]?.status||'unanswered'
                        return(
                          <div key={q.id} className={`q-row ${s}`} onClick={()=>{setSelQId(q.id);setView('question')}}>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:600,fontSize:'.86rem',color:'#1a1a2e',marginBottom:'.4rem',lineHeight:1.5}}>{q.title}</div>
                              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',alignItems:'center'}}>
                                <span className={`badge badge-${s}`}>{statusLabel(s as QStatus)}</span>
                                <span className={`badge badge-${q.priority}`}>{prioLabel(q.priority)}</span>
                                {q.required&&<span className="badge badge-required">الزامی</span>}
                                <span style={{fontSize:'.65rem',color:'#ccc',marginRight:'auto'}}>س {q.id}</span>
                              </div>
                            </div>
                            <div style={{color:'#ccc',fontSize:'.9rem',flexShrink:0}}>←</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── NOTES VIEW ── */}
              {view==='notes'&&(
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                    <div style={{fontWeight:800,fontSize:'1rem',color:'#1a1a2e'}}>یادداشت‌ها <span style={{color:'#aaa',fontWeight:400,fontSize:'.82rem'}}>({notes.length})</span></div>
                    <button onClick={createNote} className="btn btn-dark">+ یادداشت جدید</button>
                  </div>
                  {notes.length===0?(
                    <div style={{textAlign:'center',padding:'3rem',color:'#ccc'}}>
                      <div style={{fontSize:'2.5rem',marginBottom:'.75rem'}}>✎</div>
                      <div style={{fontWeight:700,color:'#888',marginBottom:'.3rem'}}>هنوز یادداشتی وجود ندارد</div>
                    </div>
                  ):(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:'1rem'}}>
                      {notes.map(note=>(
                        <div key={note.id} className="card" onClick={()=>openNote(note)} style={{cursor:'pointer',transition:'all .2s'}}
                          onMouseOver={e=>{e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.09)';e.currentTarget.style.transform='translateY(-2px)'}}
                          onMouseOut={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none'}}>
                          <div style={{height:4,background:`linear-gradient(90deg,${selP.project.color},${selP.project.color}88)`}}/>
                          <div style={{padding:'1rem'}}>
                            <div style={{fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',marginBottom:'.45rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{note.title}</div>
                            <div style={{fontSize:'.75rem',color:'#aaa',lineHeight:1.7,overflow:'hidden',maxHeight:'3.4rem'}}>{note.content||'بدون محتوا'}</div>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'.75rem',paddingTop:'.65rem',borderTop:'1px solid #f5f5f5'}}>
                              <span style={{fontSize:'.67rem',color:'#ccc'}}>{fmtDate(note.updated_at)}</span>
                              <button onClick={e=>deleteNote(note.id,e)} className="btn btn-danger" style={{padding:'.2rem .5rem',fontSize:'.7rem'}}>حذف</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── FILES VIEW ── */}
              {view==='files'&&(
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                    <div style={{fontWeight:800,fontSize:'1rem',color:'#1a1a2e'}}>مدارک و مستندات <span style={{color:'#aaa',fontWeight:400,fontSize:'.82rem'}}>({files.length})</span></div>
                    <label className="btn btn-dark" style={{cursor:'pointer'}}>{uploading?'آپلود...':'+ آپلود فایل'}<input type="file" onChange={uploadFile} style={{display:'none'}} disabled={uploading}/></label>
                  </div>
                  {files.length===0?(
                    <div style={{textAlign:'center',padding:'3rem',color:'#ccc'}}>
                      <div style={{fontSize:'2.5rem',marginBottom:'.75rem'}}>⊟</div>
                      <div style={{fontWeight:700,color:'#888'}}>هنوز فایلی آپلود نشده</div>
                    </div>
                  ):(
                    <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                      {files.map(f=>(
                        <div key={f.id} className="card" style={{cursor:'default'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'.9rem',padding:'.9rem 1.1rem'}}>
                            <div style={{width:40,height:40,borderRadius:9,background:`${selP.project.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{fileIcon(f.mime_type)}</div>
                            <div style={{flex:1,overflow:'hidden'}}>
                              <div style={{fontWeight:600,fontSize:'.85rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div>
                              <div style={{fontSize:'.7rem',color:'#bbb'}}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</div>
                            </div>
                            <div style={{display:'flex',gap:'.5rem'}}>
                              <button onClick={()=>downloadFile(f)} className="btn btn-ghost" style={{padding:'.38rem .75rem',fontSize:'.76rem'}}>دانلود</button>
                              <button onClick={e=>deleteFile(f,e)} className="btn btn-danger" style={{padding:'.38rem .7rem',fontSize:'.76rem'}}>حذف</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── MEMBERS VIEW ── */}
              {view==='members'&&isOwner&&(
                <div style={{maxWidth:580}}>
                  <div style={{fontWeight:800,fontSize:'1rem',color:'#1a1a2e',marginBottom:'1rem'}}>اعضای پروژه</div>
                  <div className="card" style={{marginBottom:'1rem'}}>
                    <div style={{padding:'1.1rem'}}>
                      <div style={{fontWeight:700,fontSize:'.85rem',color:'#1a1a2e',marginBottom:'.25rem'}}>دعوت همکار جدید</div>
                      <div style={{fontSize:'.75rem',color:'#aaa',marginBottom:'.85rem'}}>همکار شما یک ایمیل دعوت دریافت می‌کند و فقط به این پروژه دسترسی خواهد داشت</div>
                      <div style={{display:'flex',gap:'.65rem'}}>
                        <input className="inp" type="email" placeholder="ایمیل همکار..." value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} style={{flex:1}} onKeyDown={e=>e.key==='Enter'&&inviteMember()}/>
                        <button onClick={inviteMember} disabled={inviting||!inviteEmail.trim()} className="btn btn-gold" style={{flexShrink:0}}>{inviting?'...':'ارسال دعوت'}</button>
                      </div>
                      {inviteMsg&&<div style={{marginTop:'.65rem',padding:'.55rem .8rem',borderRadius:8,background:inviteMsg.startsWith('خطا')?'#fee2e2':'#dcfce7',color:inviteMsg.startsWith('خطا')?'#dc2626':'#16a34a',fontSize:'.78rem'}}>{inviteMsg}</div>}
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.55rem'}}>
                    {members.map(m=>(
                      <div key={m.id} className="card">
                        <div style={{display:'flex',alignItems:'center',gap:'.85rem',padding:'.85rem 1.1rem'}}>
                          <div style={{width:36,height:36,borderRadius:'50%',background:m.role==='owner'?selP.project.color:'#e8eaf0',display:'flex',alignItems:'center',justifyContent:'center',color:m.role==='owner'?'#fff':'#888',fontWeight:700,fontSize:'.9rem',flexShrink:0}}>
                            {(m.email||'U')[0].toUpperCase()}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:600,fontSize:'.84rem',color:'#1a1a2e'}}>{m.email||m.user_id}</div>
                            <div style={{fontSize:'.7rem',color:'#bbb'}}>{m.role==='owner'?'مالک':'عضو'} · از {fmtDate(m.joined_at)}</div>
                          </div>
                          {m.role!=='owner'&&<button onClick={()=>removeMember(m.id,m.user_id)} className="btn btn-danger" style={{fontSize:'.74rem',padding:'.3rem .65rem'}}>حذف</button>}
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

      {/* ── NEW PROJECT MODAL ─────────────────────────────────────────────── */}
      {showNewProj&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,backdropFilter:'blur(4px)'}} onClick={()=>setShowNewProj(false)}>
          <div style={{background:'#fff',borderRadius:16,padding:'2rem',width:400,direction:'rtl',boxShadow:'0 32px 64px rgba(0,0,0,.2)',animation:'fadeUp .2s ease'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:800,fontSize:'1.05rem',color:'#0d1b2a',marginBottom:'1.35rem'}}>پروژه جدید</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
              <div><label style={{display:'block',fontSize:'.76rem',fontWeight:600,color:'#555',marginBottom:'.35rem'}}>نام پروژه *</label>
                <input className="inp" placeholder="نام پروژه..." value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus onKeyDown={e=>e.key==='Enter'&&createProject()}/></div>
              <div><label style={{display:'block',fontSize:'.76rem',fontWeight:600,color:'#555',marginBottom:'.35rem'}}>توضیحات (اختیاری)</label>
                <input className="inp" placeholder="توضیح کوتاه..." value={newDesc} onChange={e=>setNewDesc(e.target.value)}/></div>
              <div><label style={{display:'block',fontSize:'.76rem',fontWeight:600,color:'#555',marginBottom:'.5rem'}}>رنگ پروژه</label>
                <div style={{display:'flex',gap:'.45rem',flexWrap:'wrap'}}>
                  {COLORS.map(c=><div key={c} onClick={()=>setNewColor(c)} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:newColor===c?`3px solid #0d1b2a`:'3px solid transparent',transition:'all .15s'}}/>)}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:'.65rem',marginTop:'1.5rem'}}>
              <button onClick={()=>setShowNewProj(false)} className="btn btn-ghost" style={{flex:1,justifyContent:'center'}}>انصراف</button>
              <button onClick={createProject} disabled={creating||!newTitle.trim()} className="btn btn-gold" style={{flex:1,justifyContent:'center'}}>{creating?'...':'ایجاد پروژه'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function WorkspacePage(){
  const [session,setSession]=useState<Session|null>(null)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setLoading(false)})
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session))
    return()=>subscription.unsubscribe()
  },[])
  if(loading)return(<div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a1628'}}><style>{G}</style><div style={{width:36,height:36,border:'3px solid rgba(184,146,42,.25)',borderTop:'3px solid #b8922a',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>)
  return session?<Dashboard session={session}/>:<AuthScreen/>
}

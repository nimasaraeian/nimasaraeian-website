'use client'

import { Upload, Download, Trash2, FileImage, FileText, File } from 'lucide-react'
import { DISPLAY_NAME, fmtDate, fmtSize } from '../lib'
import type { FileRecord, Project } from '../types'

type Props = {
  project: Project
  files: FileRecord[]
  uploading: boolean
  isOwner: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDownload: (f: FileRecord) => void
  onDelete: (f: FileRecord, e: React.MouseEvent) => void
}

function fileIcon(mime: string) {
  if (mime?.startsWith('image/')) return { icon: <FileImage size={18} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' }
  if (mime?.includes('pdf')) return { icon: <FileText size={18} />, color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
  if (mime?.includes('word') || mime?.includes('document')) return { icon: <FileText size={18} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' }
  if (mime?.includes('excel') || mime?.includes('sheet')) return { icon: <FileText size={18} />, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' }
  return { icon: <File size={18} />, color: 'var(--ws-gold)', bg: 'var(--ws-gold-glow)' }
}

export default function FilesPanel({ project, files, uploading, isOwner, onUpload, onDownload, onDelete }: Props) {
  return (
    <div className="ws-animate-in" style={{ padding: '40px 44px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', direction: 'rtl' }}>
        <div>
          <div style={{ color: 'var(--ws-text-muted)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Times New Roman, serif' }}>فایل‌ها و مدارک</div>
          <h1 style={{ color: 'var(--ws-text)', fontSize: '22px', fontWeight: 700 }}>{DISPLAY_NAME(project.title)}</h1>
        </div>
        <label className="ws-btn ws-btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
          <Upload size={15} />
          {uploading ? 'در حال آپلود...' : 'آپلود فایل'}
          <input type="file" style={{ display: 'none' }} onChange={onUpload} disabled={uploading} />
        </label>
      </div>

      {files.length === 0 ? (
        <label className="ws-card" style={{ display: 'block', padding: '60px', textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s' }}
          onMouseEnter={(e: React.MouseEvent<HTMLLabelElement>) => (e.currentTarget.style.borderColor = 'var(--ws-gold-border)')}
          onMouseLeave={(e: React.MouseEvent<HTMLLabelElement>) => (e.currentTarget.style.borderColor = 'var(--ws-border)')}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📁</div>
          <p style={{ color: 'var(--ws-text-muted)', marginBottom: '8px' }}>هنوز فایلی آپلود نشده</p>
          <p style={{ color: 'var(--ws-gold)', fontSize: '13px' }}>برای آپلود کلیک کنید</p>
          <input type="file" style={{ display: 'none' }} onChange={onUpload} disabled={uploading} />
        </label>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {files.map((f) => {
            const fi = fileIcon(f.mime_type)
            return (
              <div key={f.id} className="ws-file-row">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: fi.bg, color: fi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {fi.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0, direction: 'rtl' }}>
                  <p style={{ color: 'var(--ws-text)', fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <p style={{ color: 'var(--ws-text-muted)', fontSize: '11px', marginTop: '2px' }}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</p>
                </div>
                <button onClick={() => onDownload(f)} className="ws-btn ws-btn-ghost" style={{ fontSize: '12px', padding: '7px 14px' }}>
                  <Download size={13} />دانلود
                </button>
                {isOwner && (
                  <button onClick={e => onDelete(f, e)} style={{ background: 'none', border: 'none', color: 'var(--ws-text-dim)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all .2s' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = 'var(--ws-text-dim)'; e.currentTarget.style.background = 'none' }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

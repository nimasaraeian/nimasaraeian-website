'use client'

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center',
      background: 'var(--ws-bg)',
      flexDirection: 'column', gap: '16px',
    }}>
      {/* Spinner */}
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid var(--ws-border)',
        borderTop: '3px solid var(--ws-gold)',
        borderRadius: '50%',
        animation: 'ws-spin 0.8s linear infinite',
      }} />
      <span style={{ color: 'var(--ws-text-muted)', fontSize: '13px' }}>
        در حال بارگذاری...
      </span>
      <style>{`@keyframes ws-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

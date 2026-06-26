import './workspace.css'

export const metadata = {
  title: 'فضای کار | نیما سرائیان',
  robots: 'noindex, nofollow',
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ws-root fixed inset-0 z-[200] overflow-hidden bg-[var(--ws-bg)]">
      {children}
    </div>
  )
}

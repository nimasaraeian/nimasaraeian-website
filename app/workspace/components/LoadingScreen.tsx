'use client'

export default function LoadingScreen() {
  return (
    <div className="flex h-full bg-[var(--ws-surface)]">
      {/* Sidebar skeleton */}
      <div className="w-[280px] flex-shrink-0 bg-[var(--ws-navy)] p-5 space-y-4 hidden md:block">
        <div className="ws-skeleton h-12 w-full opacity-20" />
        <div className="ws-skeleton h-8 w-3/4 opacity-20" />
        <div className="space-y-2 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ws-skeleton h-10 w-full opacity-20" />
          ))}
        </div>
      </div>

      {/* Main skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="ws-skeleton h-8 w-48" />
        <div className="ws-skeleton h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ws-skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Mascot } from './Mascot'

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center px-4 h-14"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        overflow: 'visible',
      }}
    >
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-app-primary">GymTracker</span>
        <Mascot />
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function HouseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-white">GymTracker</span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 ${
              pathname === '/'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/10 border-white/20 text-gray-400 hover:bg-white/15 hover:text-white'
            }`}
            aria-label="Accueil"
          >
            <HouseIcon />
          </Link>
          <Link
            href="/progression"
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 ${
              pathname === '/progression'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/10 border-white/20 text-gray-400 hover:bg-white/15 hover:text-white'
            }`}
            aria-label="Progression"
          >
            <ChartIcon />
          </Link>
        </div>
      </div>
    </nav>
  )
}

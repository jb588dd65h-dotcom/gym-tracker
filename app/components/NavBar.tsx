'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function HouseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ChartIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

const TABS = [
  { href: '/', label: 'Séances', icon: HouseIcon, exact: true },
  { href: '/progression', label: 'Progression', icon: ChartIcon, exact: false },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 pb-safe"
              style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            >
              {/* Pill indicator */}
              <div
                className="w-8 h-1 rounded-full mb-0.5 transition-all duration-300"
                style={{ background: isActive ? 'rgba(255,255,255,0.9)' : 'transparent' }}
              />
              <span style={{ color: isActive ? '#ffffff' : '#6b7280' }} className="transition-colors duration-200">
                <Icon size={22} />
              </span>
              <span
                className="text-xs font-medium tracking-tight transition-colors duration-200"
                style={{ color: isActive ? '#ffffff' : '#6b7280' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

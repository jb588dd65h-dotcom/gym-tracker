'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { NavBar } from './NavBar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
      <NavBar />
    </>
  )
}

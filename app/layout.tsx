import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GymTracker',
  description: 'Track your gym workouts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-[#0F0F0F] text-white min-h-screen`}>
        <nav className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-gray-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              GymTracker
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/progression"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Progression
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from './components/NavBar'
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
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  )
}

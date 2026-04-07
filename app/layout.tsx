import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProvider } from './providers/AppProvider'
import { Header } from './components/Header'
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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          <Header />
          <main className="max-w-2xl mx-auto px-4 py-6">
            {children}
          </main>
          <NavBar />
        </AppProvider>
      </body>
    </html>
  )
}

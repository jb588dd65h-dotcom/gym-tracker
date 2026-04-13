import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { AppProvider } from './providers/AppProvider'
import { MascotProvider } from './providers/MascotProvider'
import { AppShell } from './components/AppShell'
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
        <AuthProvider>
          <AppProvider>
            <MascotProvider>
              <AppShell>
                {children}
              </AppShell>
            </MascotProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

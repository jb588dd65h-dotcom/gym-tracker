'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

// ── Piou Piou SVG (inline, no provider dependency) ────────────────────────

function PiouPiou() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 80 80"
      style={{
        overflow: 'visible',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
      }}
    >
      <ellipse cx="38" cy="80" rx="22" ry="4.5" fill="rgba(0,0,0,0.18)" />
      <line x1="29" y1="72" x2="24" y2="80" stroke="#E07820" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="43" y1="72" x2="48" y2="80" stroke="#E07820" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="14" cy="52" rx="13" ry="9" fill="#7A5420" />
      <ellipse cx="13" cy="51" rx="9" ry="6" fill="#8B6428" />
      <ellipse cx="63" cy="53" rx="11" ry="8" fill="#7A5420" />
      <ellipse cx="64" cy="52" rx="8" ry="5.5" fill="#8B6428" />
      <circle cx="36" cy="53" r="24" fill="#8B6535" />
      <path d="M 14 47 Q 36 41 58 47" stroke="#6B4D1A" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 13 54 Q 36 48 59 54" stroke="#6B4D1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 15 61 Q 36 55 57 61" stroke="#6B4D1A" strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="58" rx="14" ry="16" fill="#EDD898" />
      <ellipse cx="36" cy="68" rx="10" ry="7" fill="#DFC878" />
      <ellipse cx="50" cy="38" rx="11" ry="13" fill="#8B6535" />
      <circle cx="52" cy="26" r="14" fill="#9B7540" />
      <path d="M 39 22 Q 52 13 65 22 Q 52 28 39 22 Z" fill="#6A4818" />
      <path d="M 65 22 L 92 29 L 65 27 Z" fill="#D4A850" />
      <path d="M 65 28 L 92 29 L 65 33 Z" fill="#B88438" />
      <circle cx="57" cy="23" r="5.5" fill="#1a1a1a" />
      <circle cx="59.2" cy="21.0" r="2.1" fill="white" />
      <circle cx="55.2" cy="25.2" r="0.9" fill="rgba(255,255,255,0.4)" />
    </svg>
  )
}

// ── Login page ─────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, user, loading } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  // Redirect once the auth context confirms the user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace('/')
    }
  }, [user, loading, router])

  async function handleSubmit() {
    setError(null)
    setInfo(null)
    setSubmitting(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
        setSubmitting(false)
        return
      }
      // Redirect is driven by the useEffect above reacting to user being set
    } else {
      const { error, needsConfirmation } = await signUp(email, password)
      if (error) {
        setError(error)
        setSubmitting(false)
        return
      }
      if (needsConfirmation) {
        setInfo('Compte créé ! Vérifiez votre email pour confirmer.')
        setMode('signin')
        setSubmitting(false)
        return
      }
      // Auto sign-in after signup (no confirmation required) — useEffect redirects
    }

    setSubmitting(false)
  }

  const inputClass =
    'w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 text-sm">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Logo + mascot */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <PiouPiou />
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">GymTracker</h1>
          <p className="text-white/40 text-sm mt-1">Suivez vos progrès</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl">
          <button
            onClick={() => { setMode('signin'); setError(null); setInfo(null) }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === 'signin' ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === 'signup' ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
            autoComplete="email"
            autoCapitalize="none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className={inputClass}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {/* Messages */}
        {error && (
          <p className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-3 text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
            {info}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !email || !password}
          className="w-full mt-5 py-3.5 rounded-2xl bg-white text-black font-bold text-sm disabled:opacity-30 transition-all active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Connexion...
            </span>
          ) : mode === 'signin' ? (
            'Se connecter'
          ) : (
            'Créer mon compte'
          )}
        </button>
      </div>
    </div>
  )
}

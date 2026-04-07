'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useTheme, useLang } from '@/app/providers/AppProvider'
import type { User } from '@supabase/supabase-js'

// ── Reusable section card ──────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-app-muted mb-2 px-1">{title}</p>
      <div className="bg-app-card border border-app-subtle rounded-2xl overflow-hidden divide-y divide-app-subtle">
        {children}
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between px-4 py-3.5">{children}</div>
}

// ── Toggle switch ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-green-500' : 'bg-app-elevated'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// ── Auth form ──────────────────────────────────────────────────────────────

function AuthForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const { t } = useLang()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit() {
    setError(null)
    setInfo(null)
    setLoading(true)
    if (mode === 'signin') {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError(t('loginError')); setLoading(false); return }
      if (data.user) onSuccess(data.user)
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      setInfo(t('signupSuccess'))
      setMode('signin')
    }
    setLoading(false)
  }

  const inputClass = 'w-full bg-app-input border border-app-subtle rounded-xl px-4 py-3 text-app-primary placeholder-app-muted focus:outline-none focus:border-app-medium transition-colors text-sm'

  return (
    <div className="p-4 flex flex-col gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('email')}
        className={inputClass}
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('password')}
        className={inputClass}
        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {info && <p className="text-green-400 text-xs">{info}</p>}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => { setMode('signin'); setError(null) }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'signin' ? 'bg-white text-black' : 'bg-app-elevated text-app-secondary'
          }`}
        >
          {t('signIn')}
        </button>
        <button
          onClick={() => { setMode('signup'); setError(null) }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'signup' ? 'bg-white text-black' : 'bg-app-elevated text-app-secondary'
          }`}
        >
          {t('createAccount')}
        </button>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-40 transition-opacity active:scale-[0.98]"
      >
        {loading ? '...' : mode === 'signin' ? t('signIn') : t('createAccount')}
      </button>
    </div>
  )
}

// ── Delete confirmation modal ──────────────────────────────────────────────

function DeleteModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const { t } = useLang()
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onCancel} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-app-card border border-app-subtle rounded-2xl p-6 shadow-2xl max-w-sm mx-auto">
        <h3 className="text-app-primary font-semibold text-base mb-2">{t('deleteConfirmTitle')}</h3>
        <p className="text-app-secondary text-sm mb-6">{t('deleteConfirmMsg')}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-app-elevated border border-app-subtle text-app-secondary text-sm font-medium"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main settings page ─────────────────────────────────────────────────────

export default function ReglagesPage() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const [user, setUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function handleDeleteData() {
    setShowDeleteModal(false)
    const { error: logsErr } = await supabase.from('workout_logs').delete().neq('id', 0)
    const { error: exErr } = await supabase.from('exercises').delete().neq('id', 0)
    if (!logsErr && !exErr) {
      setDeleteMsg(t('deleteSuccess'))
      setTimeout(() => setDeleteMsg(null), 3000)
    }
  }

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold mb-6 text-app-primary">{t('settingsTitle')}</h1>

      {/* ── Compte ── */}
      <Section title={t('sectionAccount')}>
        {user ? (
          <>
            <Row>
              <div>
                <p className="text-xs text-app-muted mb-0.5">{t('connectedAs')}</p>
                <p className="text-sm font-medium text-app-primary truncate max-w-[220px]">{user.email}</p>
              </div>
            </Row>
            <Row>
              <span className="text-sm text-red-400">{t('signOut')}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold"
              >
                →
              </button>
            </Row>
          </>
        ) : (
          <AuthForm onSuccess={setUser} />
        )}
      </Section>

      {/* ── Apparence ── */}
      <Section title={t('sectionAppearance')}>
        <Row>
          <span className="text-sm font-medium text-app-primary">{t('darkTheme')}</span>
          <Toggle checked={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
        </Row>
        <Row>
          <span className="text-sm font-medium text-app-primary">{t('lightTheme')}</span>
          <Toggle checked={theme === 'light'} onChange={(v) => setTheme(v ? 'light' : 'dark')} />
        </Row>
      </Section>

      {/* ── Langue ── */}
      <Section title={t('sectionLanguage')}>
        {(['fr', 'en'] as const).map((l) => (
          <Row key={l}>
            <span className="text-sm font-medium text-app-primary">
              {l === 'fr' ? 'Français' : 'English'}
            </span>
            <button
              onClick={() => setLang(l)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                lang === l ? 'border-white bg-white' : 'border-app-subtle bg-transparent'
              }`}
            >
              {lang === l && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </Row>
        ))}
      </Section>

      {/* ── Données ── */}
      <Section title={t('sectionData')}>
        <Row>
          <span className="text-sm font-medium text-red-400">{t('deleteData')}</span>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold"
          >
            ✕
          </button>
        </Row>
      </Section>

      {deleteMsg && (
        <div className="fixed bottom-[96px] left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-green-500 text-white text-sm font-semibold shadow-xl whitespace-nowrap">
          ✓ {deleteMsg}
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal onCancel={() => setShowDeleteModal(false)} onConfirm={handleDeleteData} />
      )}
    </div>
  )
}

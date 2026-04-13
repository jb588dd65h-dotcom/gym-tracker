'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useTheme, useLang } from '@/app/providers/AppProvider'

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

// ── Confirmation modal ─────────────────────────────────────────────────────

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  danger?: boolean
}

function ConfirmModal({ title, message, confirmLabel, onCancel, onConfirm, danger }: ConfirmModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onCancel} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-app-card border border-app-subtle rounded-2xl p-6 shadow-2xl max-w-sm mx-auto">
        <h3 className="text-app-primary font-semibold text-base mb-2">{title}</h3>
        <p className="text-app-secondary text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-app-elevated border border-app-subtle text-app-secondary text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
              danger
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main settings page ─────────────────────────────────────────────────────

type Modal = 'deleteData' | 'deleteAccount' | null

export default function ReglagesPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const { user, signOut } = useAuth()

  const [modal, setModal] = useState<Modal>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(msg: string, ok = true) {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3000)
  }

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  async function handleDeleteData() {
    setModal(null)
    await supabase.from('workout_logs').delete().neq('id', 0)
    await supabase.from('exercises').delete().neq('id', 0)
    showFeedback(t('deleteSuccess'))
  }

  async function handleDeleteAccount() {
    setModal(null)
    // Delete all user data (RLS ensures only current user's rows are removed)
    await supabase.from('workout_logs').delete().neq('id', 0)
    await supabase.from('exercises').delete().neq('id', 0)
    // Delete the auth account via DB function
    await supabase.rpc('delete_user')
    router.push('/login')
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
          <Row>
            <span className="text-sm text-app-muted">Non connecté</span>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold"
            >
              Se connecter
            </button>
          </Row>
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
            onClick={() => setModal('deleteData')}
            className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold"
          >
            ✕
          </button>
        </Row>
        <Row>
          <span className="text-sm font-medium text-red-500">Supprimer mon compte</span>
          <button
            onClick={() => setModal('deleteAccount')}
            className="px-3 py-1.5 rounded-xl bg-red-600/15 border border-red-600/25 text-red-500 text-xs font-semibold"
          >
            ✕
          </button>
        </Row>
      </Section>

      {/* Feedback toast */}
      {feedback && (
        <div className={`fixed bottom-[96px] left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl whitespace-nowrap ${
          feedback.ok ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {feedback.ok ? '✓' : '✕'} {feedback.msg}
        </div>
      )}

      {/* Delete data modal */}
      {modal === 'deleteData' && (
        <ConfirmModal
          title={t('deleteConfirmTitle')}
          message={t('deleteConfirmMsg')}
          confirmLabel={t('confirm')}
          onCancel={() => setModal(null)}
          onConfirm={handleDeleteData}
          danger
        />
      )}

      {/* Delete account modal */}
      {modal === 'deleteAccount' && (
        <ConfirmModal
          title="Supprimer mon compte"
          message="Toutes vos données seront supprimées et votre compte sera définitivement fermé. Cette action est irréversible."
          confirmLabel="Supprimer le compte"
          onCancel={() => setModal(null)}
          onConfirm={handleDeleteAccount}
          danger
        />
      )}
    </div>
  )
}

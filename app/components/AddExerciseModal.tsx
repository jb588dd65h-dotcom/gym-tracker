'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Jour } from '@/lib/types'

const DAYS: { jour: Jour; label: string }[] = [
  { jour: 'lundi',    label: 'Lundi' },
  { jour: 'mardi',    label: 'Mardi' },
  { jour: 'mercredi', label: 'Mercredi' },
  { jour: 'jeudi',    label: 'Jeudi' },
  { jour: 'vendredi', label: 'Vendredi' },
  { jour: 'samedi',   label: 'Samedi' },
  { jour: 'dimanche', label: 'Dimanche' },
]

type Step = 1 | 2 | 3

interface Props {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

export function AddExerciseModal({ open, onClose, onSaved }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [jour, setJour] = useState<Jour | null>(null)
  const [groupe, setGroupe] = useState<string | null>(null)
  const [useCustomGroupe, setUseCustomGroupe] = useState(false)
  const [customGroupe, setCustomGroupe] = useState('')

  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [s1, setS1] = useState('12')
  const [s2, setS2] = useState('11')
  const [s3, setS3] = useState('10')
  const [repos, setRepos] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function reset() {
    setStep(1)
    setJour(null)
    setGroupe(null)
    setUseCustomGroupe(false)
    setCustomGroupe('')
    setName('')
    setWeight('')
    setS1('12')
    setS2('11')
    setS3('10')
    setRepos('')
    setSaveError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleBack() {
    setSaveError(null)
    if (step === 2) {
      setGroupe(null)
      setUseCustomGroupe(false)
      setCustomGroupe('')
      setJour(null)
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  function selectJour(j: Jour) {
    setJour(j)
    setGroupe(null)
    setUseCustomGroupe(false)
    setStep(2)
  }

  function confirmCustomGroupe() {
    if (!customGroupe.trim()) return
    setUseCustomGroupe(true)
    setGroupe(null)
    setStep(3)
  }

  async function handleSave() {
    setSaveError(null)
    const finalGroupe = useCustomGroupe ? customGroupe.trim() : groupe
    if (!name.trim()) { setSaveError("Nom de l'exercice requis"); return }
    if (!weight || isNaN(parseFloat(weight))) { setSaveError('Poids initial requis'); return }
    if (!finalGroupe) { setSaveError('Groupe musculaire requis'); return }

    setSaving(true)

    const { data: ordreData } = await supabase
      .from('exercises')
      .select('ordre')
      .eq('jour', jour!)
      .order('ordre', { ascending: false })
      .limit(1)

    const maxOrdre = (ordreData?.[0]?.ordre as number | undefined) ?? 0

    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      jour: jour!,
      groupe_musculaire: finalGroupe,
      exercice: name.trim(),
      poids_initial: parseFloat(weight),
      serie1_reps_cible: parseInt(s1) || 12,
      serie2_reps_cible: parseInt(s2) || 11,
      serie3_reps_cible: parseInt(s3) || 10,
      repos: repos.trim() || null,
      ordre: maxOrdre + 1,
      user_id: user?.id,
    }

    console.log('[AddExercise] inserting:', payload)

    const { data: inserted, error } = await supabase
      .from('exercises')
      .insert(payload)
      .select()

    console.log('[AddExercise] result:', { inserted, error })

    setSaving(false)

    if (error) {
      setSaveError(`Erreur: ${error.message}`)
      return
    }

    // Close modal then notify parent to show toast
    handleClose()
    onSaved?.()
  }

  const selectedDay = DAYS.find((d) => d.jour === jour)
  const finalGroupeLabel = useCustomGroupe ? customGroupe : groupe

  const stepTitles: Record<Step, string> = {
    1: 'Quel jour ?',
    2: 'Groupe musculaire',
    3: "Détails de l'exercice",
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Sheet — full-screen on mobile, bottom sheet on larger screens */}
      <div
        className={`fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col bg-app transition-transform duration-300 ease-out sm:top-auto sm:rounded-t-3xl sm:max-h-[92vh] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle (visual only) */}
        <div className="flex justify-center pt-3 pb-1 sm:block">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-app-elevated border border-app-subtle text-app-secondary hover:text-app-primary transition-colors"
                aria-label="Retour"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs text-app-muted font-medium">Étape {step} / 3</p>
              <h2 className="text-base font-semibold text-app-primary truncate">{stepTitles[step]}</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-app-elevated border border-app-subtle text-app-muted hover:text-app-primary transition-colors"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 px-5 pb-4 shrink-0">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-white' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8">

          {/* ── Step 1: Day ── */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              {DAYS.map((day) => (
                <button
                  key={day.jour}
                  onClick={() => selectJour(day.jour)}
                  className="flex items-center justify-between w-full bg-app-card border border-app-subtle rounded-2xl px-5 py-4 text-left active:scale-[0.98] transition-all"
                >
                  <p className="font-semibold text-app-primary">{day.label}</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* ── Step 2: Muscle group ── */}
          {step === 2 && selectedDay && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={customGroupe}
                onChange={(e) => setCustomGroupe(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmCustomGroupe()}
                placeholder="ex: Biceps, Dos, Abdos..."
                autoFocus
                className="w-full bg-app-card border border-app-subtle rounded-xl px-4 py-3.5 text-app-primary placeholder-app-muted focus:outline-none focus:border-app-medium transition-colors"
              />
              <button
                onClick={confirmCustomGroupe}
                disabled={!customGroupe.trim()}
                className="w-full py-4 rounded-2xl font-semibold text-base bg-white text-black hover:bg-gray-100 active:scale-[0.98] disabled:opacity-30 transition-all"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* ── Step 3: Exercise details ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              {/* Context pills */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-white/8 border border-white/10 rounded-full px-3 py-1 text-gray-400">
                  {selectedDay?.label}
                </span>
                <span className="text-xs bg-white/8 border border-white/10 rounded-full px-3 py-1 text-gray-400">
                  {finalGroupeLabel}
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">
                  Nom de l&apos;exercice <span className="text-gray-700">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Curl haltères"
                  autoFocus
                  className="w-full bg-app-card border border-app-subtle rounded-xl px-4 py-3.5 text-app-primary placeholder-app-muted focus:outline-none focus:border-app-medium transition-colors"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">
                  Poids initial (kg) <span className="text-gray-700">*</span>
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="ex: 20"
                  min={0}
                  step={2.5}
                  className="w-full bg-app-card border border-app-subtle rounded-xl px-4 py-3.5 text-app-primary placeholder-app-muted focus:outline-none focus:border-app-medium transition-colors"
                />
              </div>

              {/* Target reps */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-3 block">Répétitions cibles</label>
                <div className="flex gap-3">
                  {[
                    { label: 'Série 1', val: s1, set: setS1 },
                    { label: 'Série 2', val: s2, set: setS2 },
                    { label: 'Série 3', val: s3, set: setS3 },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="flex-1 text-center">
                      <p className="text-xs text-gray-600 mb-2">{label}</p>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        min={1}
                        max={50}
                        className="w-full bg-app-card border border-app-subtle rounded-xl px-2 py-3 text-app-primary text-center text-lg font-semibold focus:outline-none focus:border-app-medium transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rest */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">
                  Temps de repos <span className="text-gray-700">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={repos}
                  onChange={(e) => setRepos(e.target.value)}
                  placeholder="ex: 2min, 1m30"
                  className="w-full bg-app-card border border-app-subtle rounded-xl px-4 py-3.5 text-app-primary placeholder-app-muted focus:outline-none focus:border-app-medium transition-colors"
                />
              </div>

              {/* Error */}
              {saveError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {saveError}
                </p>
              )}

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl font-semibold text-base bg-white text-black hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {saving ? 'Enregistrement...' : "Ajouter l'exercice"}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

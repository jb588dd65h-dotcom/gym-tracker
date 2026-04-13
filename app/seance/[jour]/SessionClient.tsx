'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ExerciseWithLog, Jour } from '@/lib/types'
import { useLang } from '@/app/providers/AppProvider'
import { useMascot } from '@/app/providers/MascotProvider'

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

interface ExerciseState {
  poids: number
  serie1: string
  serie2: string
  serie3: string
}

interface SessionClientProps {
  jour: Jour
  jourLabel: string
  exercises: ExerciseWithLog[]
  groupes: string[]
  today: string
}

function RepInput({
  value,
  onChange,
  target,
  setIndex,
}: {
  value: string
  onChange: (val: string) => void
  target: number
  setIndex: number
}) {
  const numVal = value === '' ? null : parseInt(value, 10)
  let borderClass = 'border-app-subtle'
  let bgExtra = ''
  if (numVal !== null) {
    if (numVal < 6) {
      borderClass = 'border-red-600'
      bgExtra = 'bg-red-950/60'
    } else if (numVal > 13) {
      borderClass = 'border-green-500'
      bgExtra = 'bg-green-950/40'
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-app-muted">S{setIndex + 1}</span>
      <input
        type="number"
        min={0}
        max={99}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={String(target)}
        className={`w-14 h-12 text-center text-base font-semibold rounded-lg border bg-app-card text-app-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${borderClass} ${bgExtra}`}
      />
    </div>
  )
}

export default function SessionClient({
  jour,
  jourLabel,
  exercises,
  groupes,
  today,
}: SessionClientProps) {
  const { t } = useLang()
  const { trigger: mascotTrigger } = useMascot()
  const initialState = useCallback((): Record<number, ExerciseState> => {
    const state: Record<number, ExerciseState> = {}
    for (const exercise of exercises) {
      const lastLog = exercise.lastLog
      // Pre-fill reps only when editing today's existing session, not from a previous session
      const isTodayLog = lastLog?.session_date === today
      state[exercise.id] = {
        poids: lastLog ? lastLog.poids : exercise.poids_initial,
        serie1: isTodayLog && lastLog?.serie1_reps != null ? String(lastLog.serie1_reps) : '',
        serie2: isTodayLog && lastLog?.serie2_reps != null ? String(lastLog.serie2_reps) : '',
        serie3: isTodayLog && lastLog?.serie3_reps != null ? String(lastLog.serie3_reps) : '',
      }
    }
    return state
  }, [exercises, today])

  const [exerciseList, setExerciseList] = useState<ExerciseWithLog[]>(exercises)
  const [states, setStates] = useState<Record<number, ExerciseState>>(initialState)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExerciseWithLog | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('exercises').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } else {
      setExerciseList((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  function updateState(id: number, field: keyof ExerciseState, value: string | number) {
    setStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  function adjustPoids(id: number, delta: number) {
    setStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        poids: Math.max(0, Math.round((prev[id].poids + delta) * 10) / 10),
      },
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      // Compute the real current local date at save time — never use the server-rendered
      // `today` prop here, as it was frozen at page-load and uses UTC (wrong timezone).
      const now = new Date()
      const saveDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

      const { data: { user } } = await supabase.auth.getUser()
      const logsToUpsert = []

      for (const exercise of exercises) {
        const s = states[exercise.id]
        const s1 = s.serie1 !== '' ? parseInt(s.serie1, 10) : null
        const s2 = s.serie2 !== '' ? parseInt(s.serie2, 10) : null
        const s3 = s.serie3 !== '' ? parseInt(s.serie3, 10) : null

        // Only save if at least one rep was entered
        if (s1 === null && s2 === null && s3 === null) continue

        logsToUpsert.push({
          session_date: saveDate,
          exercise_id: exercise.id,
          poids: s.poids,
          serie1_reps: s1,
          serie2_reps: s2,
          serie3_reps: s3,
          note: null,
          user_id: user?.id,
        })
      }

      if (logsToUpsert.length === 0) {
        setToast({ message: 'Aucun exercice à enregistrer', type: 'error' })
        setSaving(false)
        setTimeout(() => setToast(null), 3000)
        return
      }

      // Delete any existing logs for this exact date before re-inserting
      const exerciseIds = exercises.map((e) => e.id)
      await supabase
        .from('workout_logs')
        .delete()
        .in('exercise_id', exerciseIds)
        .eq('session_date', saveDate)

      const { error } = await supabase.from('workout_logs').insert(logsToUpsert)

      if (error) {
        setToast({ message: 'Erreur lors de la sauvegarde', type: 'error' })
      } else {
        setToast({ message: `${logsToUpsert.length} exercice(s) enregistré(s) !`, type: 'success' })
        mascotTrigger('bodybuilder', 'Bravo ! 💪')
      }
    } catch {
      setToast({ message: 'Erreur inattendue', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const exercisesByGroupe = groupes
    .map((groupe) => ({
      groupe,
      exercises: exerciseList.filter((e) => e.groupe_musculaire === groupe),
    }))
    .filter(({ exercises: ex }) => ex.length > 0)

  return (
    <div className="pb-48">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{jourLabel}</h1>
      </div>

      {/* Exercise groups */}
      {exercisesByGroupe.map(({ groupe, exercises: groupExercises }) => (
        <div key={groupe} className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-app-muted mb-3 border-b border-app-subtle pb-2">
            {groupe}
          </h2>
          <div className="flex flex-col gap-4">
            {groupExercises.map((exercise) => {
              const s = states[exercise.id]
              const s1 = s.serie1 !== '' ? parseInt(s.serie1, 10) : null
              const s2 = s.serie2 !== '' ? parseInt(s.serie2, 10) : null
              const s3 = s.serie3 !== '' ? parseInt(s.serie3, 10) : null

              const anyLow = [s1, s2, s3].some((v) => v !== null && v < 6)
              const allHigh =
                s1 !== null &&
                s2 !== null &&
                s3 !== null &&
                s1 > 13 &&
                s2 > 13 &&
                s3 > 13

              return (
                <div
                  key={exercise.id}
                  className="bg-app-card border border-app-subtle rounded-xl p-4"
                >
                  {/* Exercise name + rest + delete */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-app-primary flex-1 pr-2">{exercise.exercice}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {exercise.repos && (
                        <span className="flex items-center gap-1 text-xs text-app-secondary bg-app-elevated rounded-full px-2 py-0.5">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {exercise.repos}
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteTarget(exercise)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label="Supprimer l'exercice"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Target hint */}
                  <p className="text-xs text-app-muted mb-3">
                    {t('targetReps')}: {exercise.serie1_reps_cible}/{exercise.serie2_reps_cible}/{exercise.serie3_reps_cible} {t('reps')}
                  </p>

                  {/* Weight control */}
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => adjustPoids(exercise.id, -2.5)}
                      className="w-10 h-10 rounded-lg bg-app-elevated text-app-primary font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
                      aria-label="Diminuer le poids"
                    >
                      −
                    </button>
                    <span className="text-base font-semibold min-w-[80px] text-center text-app-primary">
                      {s.poids} kg
                    </span>
                    <button
                      onClick={() => adjustPoids(exercise.id, 2.5)}
                      className="w-10 h-10 rounded-lg bg-app-elevated text-app-primary font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
                      aria-label="Augmenter le poids"
                    >
                      +
                    </button>
                  </div>

                  {/* Rep inputs */}
                  <div className="flex gap-3">
                    <RepInput
                      value={s.serie1}
                      onChange={(v) => updateState(exercise.id, 'serie1', v)}
                      target={exercise.serie1_reps_cible}
                      setIndex={0}
                    />
                    <RepInput
                      value={s.serie2}
                      onChange={(v) => updateState(exercise.id, 'serie2', v)}
                      target={exercise.serie2_reps_cible}
                      setIndex={1}
                    />
                    <RepInput
                      value={s.serie3}
                      onChange={(v) => updateState(exercise.id, 'serie3', v)}
                      target={exercise.serie3_reps_cible}
                      setIndex={2}
                    />
                  </div>

                  {/* Feedback messages */}
                  {anyLow && (
                    <p className="mt-2 text-xs text-red-400 font-medium">
                      ⚠ {t('weightDown')}
                    </p>
                  )}
                  {allHigh && (
                    <p className="mt-2 text-xs text-green-400 font-medium">
                      💪 {t('weightUp')}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Sticky save button */}
      <div
        className="fixed bottom-20 left-0 right-0 p-4"
        style={{ background: 'linear-gradient(to top, var(--save-from) 30%, color-mix(in srgb, var(--save-from) 95%, transparent), transparent)' }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-base transition-colors active:scale-[0.98]"
          >
            {saving ? t('saving') : t('saveSession')}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-[200px] left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 transition-all ${
            toast.type === 'success'
              ? 'bg-green-800 text-green-100 border border-green-600'
              : 'bg-red-900 text-red-100 border border-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-app-card border border-app-subtle rounded-2xl p-6 shadow-2xl max-w-sm mx-auto">
            <h3 className="text-app-primary font-semibold text-base mb-2">Supprimer l&apos;exercice ?</h3>
            <p className="text-app-secondary text-sm mb-1">
              <span className="text-app-primary font-medium">{deleteTarget.exercice}</span>
            </p>
            <p className="text-app-muted text-xs mb-6">Cette action est irréversible. Toutes les données d&apos;entraînement associées seront supprimées.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-app-elevated border border-app-subtle text-app-secondary text-sm font-medium transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

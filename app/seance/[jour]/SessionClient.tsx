'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ExerciseWithLog, Jour } from '@/lib/types'

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
  let borderClass = 'border-gray-700'
  if (numVal !== null) {
    if (numVal < 6) {
      borderClass = 'border-red-600 bg-red-950/60'
    } else if (numVal > 13) {
      borderClass = 'border-green-500 bg-green-950/40'
    } else {
      borderClass = 'border-gray-600'
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">S{setIndex + 1}</span>
      <input
        type="number"
        min={0}
        max={99}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={String(target)}
        className={`w-14 h-12 text-center text-base font-semibold rounded-lg border bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${borderClass}`}
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
  const initialState = useCallback((): Record<number, ExerciseState> => {
    const state: Record<number, ExerciseState> = {}
    for (const exercise of exercises) {
      const lastLog = exercise.lastLog
      state[exercise.id] = {
        poids: lastLog ? lastLog.poids : exercise.poids_initial,
        serie1: lastLog?.serie1_reps != null ? String(lastLog.serie1_reps) : '',
        serie2: lastLog?.serie2_reps != null ? String(lastLog.serie2_reps) : '',
        serie3: lastLog?.serie3_reps != null ? String(lastLog.serie3_reps) : '',
      }
    }
    return state
  }, [exercises])

  const [states, setStates] = useState<Record<number, ExerciseState>>(initialState)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
      const logsToUpsert = []

      for (const exercise of exercises) {
        const s = states[exercise.id]
        const s1 = s.serie1 !== '' ? parseInt(s.serie1, 10) : null
        const s2 = s.serie2 !== '' ? parseInt(s.serie2, 10) : null
        const s3 = s.serie3 !== '' ? parseInt(s.serie3, 10) : null

        // Only save if at least one rep was entered
        if (s1 === null && s2 === null && s3 === null) continue

        logsToUpsert.push({
          session_date: today,
          exercise_id: exercise.id,
          poids: s.poids,
          serie1_reps: s1,
          serie2_reps: s2,
          serie3_reps: s3,
          note: null,
        })
      }

      if (logsToUpsert.length === 0) {
        setToast({ message: 'Aucun exercice à enregistrer', type: 'error' })
        setSaving(false)
        setTimeout(() => setToast(null), 3000)
        return
      }

      // Delete existing logs for today for this day's exercises
      const exerciseIds = exercises.map((e) => e.id)
      await supabase
        .from('workout_logs')
        .delete()
        .in('exercise_id', exerciseIds)
        .eq('session_date', today)

      const { error } = await supabase.from('workout_logs').insert(logsToUpsert)

      if (error) {
        setToast({ message: 'Erreur lors de la sauvegarde', type: 'error' })
      } else {
        setToast({ message: `${logsToUpsert.length} exercice(s) enregistré(s) !`, type: 'success' })
      }
    } catch {
      setToast({ message: 'Erreur inattendue', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const exercisesByGroupe = groupes.map((groupe) => ({
    groupe,
    exercises: exercises.filter((e) => e.groupe_musculaire === groupe),
  }))

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{jourLabel}</h1>
        <p className="text-gray-400 text-sm mt-1">{groupes.join(' · ')}</p>
      </div>

      {/* Exercise groups */}
      {exercisesByGroupe.map(({ groupe, exercises: groupExercises }) => (
        <div key={groupe} className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">
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
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  {/* Exercise name + rest */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white flex-1 pr-2">{exercise.exercice}</h3>
                    {exercise.repos && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5 shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {exercise.repos}
                      </span>
                    )}
                  </div>

                  {/* Target hint */}
                  <p className="text-xs text-gray-500 mb-3">
                    Cible: {exercise.serie1_reps_cible}/{exercise.serie2_reps_cible}/{exercise.serie3_reps_cible} reps
                  </p>

                  {/* Weight control */}
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => adjustPoids(exercise.id, -2.5)}
                      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
                      aria-label="Diminuer le poids"
                    >
                      −
                    </button>
                    <span className="text-base font-semibold min-w-[80px] text-center">
                      {s.poids} kg
                    </span>
                    <button
                      onClick={() => adjustPoids(exercise.id, 2.5)}
                      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
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
                      ⚠ Baisse le poids
                    </p>
                  )}
                  {allHigh && (
                    <p className="mt-2 text-xs text-green-400 font-medium">
                      💪 Augmente le poids !
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/95 to-transparent">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-base transition-colors active:scale-[0.98]"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer la séance'}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 transition-all ${
            toast.type === 'success'
              ? 'bg-green-800 text-green-100 border border-green-600'
              : 'bg-red-900 text-red-100 border border-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Jour } from '@/lib/types'
import { AddExerciseModal } from './components/AddExerciseModal'

const DAYS: { jour: Jour; label: string }[] = [
  { jour: 'lundi',    label: 'Lundi' },
  { jour: 'mardi',    label: 'Mardi' },
  { jour: 'mercredi', label: 'Mercredi' },
  { jour: 'jeudi',    label: 'Jeudi' },
  { jour: 'vendredi', label: 'Vendredi' },
  { jour: 'samedi',   label: 'Samedi' },
  { jour: 'dimanche', label: 'Dimanche' },
]

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 text-gray-500 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<Jour | null>(null)
  const [joursLogged, setJoursLogged] = useState<Set<string>>(new Set())
  const [joursWithExercises, setJoursWithExercises] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
    router.refresh()
  }

  useEffect(() => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    // Which days have been logged today
    supabase
      .from('workout_logs')
      .select('exercise_id, exercises(jour)')
      .eq('session_date', today)
      .then(({ data }) => {
        if (!data) return
        const done = new Set<string>()
        for (const log of data) {
          const ex = log.exercises as unknown as { jour: string } | null
          if (ex?.jour) done.add(ex.jour)
        }
        setJoursLogged(done)
      })

    // Which days have at least one exercise configured
    supabase
      .from('exercises')
      .select('jour')
      .then(({ data }) => {
        if (!data) return
        setJoursWithExercises(new Set(data.map((e) => e.jour as string)))
      })
  }, [])

  function toggle(jour: Jour) {
    setExpanded((prev) => (prev === jour ? null : jour))
  }

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold mb-1">Vos séances</h1>
      <p className="text-gray-500 text-sm mb-6">Choisissez votre entraînement</p>

      <div className="flex flex-col gap-3">
        {DAYS.map((day) => {
          const isOpen = expanded === day.jour
          const isDone = joursLogged.has(day.jour)
          const hasExercises = joursWithExercises.has(day.jour)

          return (
            <div
              key={day.jour}
              className="bg-[#1A1A1A] border border-white/8 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(day.jour)}
                className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-base">{day.label}</span>
                  {isDone && (
                    <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                      ✓
                    </span>
                  )}
                </div>
                <ChevronDownIcon open={isOpen} />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 border-t border-white/5 pt-3">
                  {hasExercises ? (
                    <Link
                      href={`/seance/${day.jour}`}
                      className="flex items-center justify-center w-full py-3 rounded-xl bg-white text-black font-semibold text-sm active:opacity-70 transition-opacity"
                    >
                      {isDone ? 'Revoir la séance' : 'Commencer'}
                    </Link>
                  ) : (
                    <p className="text-gray-600 text-sm text-center py-2">
                      Aucun exercice pour ce jour — utilise le{' '}
                      <span className="text-gray-400 font-medium">+</span> pour en ajouter
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-4 flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg pointer-events-none">
          Ajouter un exercice
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white text-xl font-light hover:bg-white/20 transition-all active:scale-95"
          aria-label="Ajouter un exercice"
        >
          +
        </button>
      </div>

      <AddExerciseModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={() => {
          showToast('Exercice ajouté !')
          // Re-fetch which days now have exercises
          supabase
            .from('exercises')
            .select('jour')
            .then(({ data }) => {
              if (data) setJoursWithExercises(new Set(data.map((e) => e.jour as string)))
            })
        }}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-green-500 text-white text-sm font-semibold shadow-xl whitespace-nowrap">
          ✓ {toast}
        </div>
      )}
    </div>
  )
}

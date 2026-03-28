'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Jour } from '@/lib/types'

const days: { jour: Jour; label: string; groupes: string[] }[] = [
  { jour: 'lundi',    label: 'Lundi',    groupes: ['Épaules'] },
  { jour: 'mardi',    label: 'Mardi',    groupes: ['Biceps', 'Dos'] },
  { jour: 'vendredi', label: 'Vendredi', groupes: ['Triceps', 'Pecs'] },
  { jour: 'samedi',   label: 'Samedi',   groupes: ['Jambes'] },
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
  const [expanded, setExpanded] = useState<Jour | null>(null)
  const [joursLogged, setJoursLogged] = useState<Set<string>>(new Set())

  useEffect(() => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

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
  }, [])

  function toggle(jour: Jour) {
    setExpanded((prev) => (prev === jour ? null : jour))
  }

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold mb-1">Vos séances</h1>
      <p className="text-gray-500 text-sm mb-6">Choisissez votre entraînement</p>

      <div className="flex flex-col gap-3">
        {days.map((day) => {
          const isOpen = expanded === day.jour
          const isDone = joursLogged.has(day.jour)

          return (
            <div
              key={day.jour}
              className="bg-[#1A1A1A] border border-white/8 rounded-2xl overflow-hidden transition-all duration-200"
            >
              {/* Header row — always visible, tap to expand */}
              <button
                onClick={() => toggle(day.jour)}
                className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base">{day.label}</span>
                      {isDone && (
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">{day.groupes.join(' · ')}</p>
                  </div>
                </div>
                <ChevronDownIcon open={isOpen} />
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-5 pb-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {day.groupes.map((g) => (
                      <span
                        key={g}
                        className="text-xs font-medium text-gray-300 bg-white/8 border border-white/10 rounded-full px-3 py-1"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/seance/${day.jour}`}
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-white text-black font-semibold text-sm transition-opacity active:opacity-70"
                  >
                    {isDone ? 'Revoir la séance' : 'Commencer'}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-4 flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg">
          Ajouter un exercice
        </span>
        <button
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white text-xl font-light hover:bg-white/20 transition-all active:scale-95"
          aria-label="Ajouter un exercice"
        >
          +
        </button>
      </div>
    </div>
  )
}

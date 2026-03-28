import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Jour } from '@/lib/types'

export const dynamic = 'force-dynamic'

const days: {
  jour: Jour
  label: string
  groupes: string[]
  color: string
  borderColor: string
  buttonColor: string
}[] = [
  {
    jour: 'lundi',
    label: 'Lundi',
    groupes: ['Épaules'],
    color: 'bg-blue-950/40',
    borderColor: 'border-blue-800/50',
    buttonColor: 'bg-blue-600 hover:bg-blue-500',
  },
  {
    jour: 'mardi',
    label: 'Mardi',
    groupes: ['Biceps', 'Dos'],
    color: 'bg-purple-950/40',
    borderColor: 'border-purple-800/50',
    buttonColor: 'bg-purple-600 hover:bg-purple-500',
  },
  {
    jour: 'vendredi',
    label: 'Vendredi',
    groupes: ['Triceps', 'Pecs'],
    color: 'bg-orange-950/40',
    borderColor: 'border-orange-800/50',
    buttonColor: 'bg-orange-600 hover:bg-orange-500',
  },
  {
    jour: 'samedi',
    label: 'Samedi',
    groupes: ['Jambes'],
    color: 'bg-green-950/40',
    borderColor: 'border-green-800/50',
    buttonColor: 'bg-green-600 hover:bg-green-500',
  },
]

async function getTodayLogs(): Promise<Set<string>> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('workout_logs')
    .select('exercise_id, exercises(jour)')
    .eq('session_date', today)

  if (error || !data) {
    return new Set()
  }

  const joursLogged = new Set<string>()
  for (const log of data) {
    const exercise = log.exercises as unknown as { jour: string } | null
    if (exercise?.jour) {
      joursLogged.add(exercise.jour)
    }
  }

  return joursLogged
}

export default async function HomePage() {
  const joursLogged = await getTodayLogs()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Séances du jour</h1>
      <p className="text-gray-400 text-sm mb-6">Choisissez votre entraînement</p>

      <div className="flex flex-col gap-4">
        {days.map((day) => {
          const isDone = joursLogged.has(day.jour)
          return (
            <div
              key={day.jour}
              className={`rounded-xl border p-5 ${day.color} ${day.borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">{day.label}</h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {day.groupes.join(' · ')}
                  </p>
                </div>
                {isDone && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-green-900/60 text-green-400 border border-green-700/50 rounded-full px-3 py-1">
                    Fait aujourd&apos;hui ✓
                  </span>
                )}
              </div>
              <Link
                href={`/seance/${day.jour}`}
                className={`inline-flex items-center justify-center w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors ${day.buttonColor}`}
              >
                {isDone ? 'Revoir la séance' : 'Commencer'}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Jour, ExerciseWithLog } from '@/lib/types'
import SessionClient from './SessionClient'

export const dynamic = 'force-dynamic'

const jourLabels: Record<Jour, string> = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
}

const validJours: Jour[] = ['lundi', 'mardi', 'vendredi', 'samedi']

export default async function SeancePage({
  params,
}: {
  params: { jour: string }
}) {
  // Explicitly opt out of Next.js data cache so every request fetches
  // fresh exercises from Supabase (force-dynamic alone isn't always enough).
  noStore()

  const jour = params.jour as Jour

  if (!validJours.includes(jour)) {
    notFound()
  }

  const today = new Date().toISOString().split('T')[0]

  // Fetch exercises for this day
  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('*')
    .eq('jour', jour)
    .order('ordre')

  if (exercisesError || !exercises) {
    return (
      <div className="text-red-400 p-4">
        Erreur lors du chargement des exercices.
      </div>
    )
  }

  // Fetch last logs for each exercise
  const exerciseIds = exercises.map((e) => e.id)

  const { data: allLogs } = await supabase
    .from('workout_logs')
    .select('*')
    .in('exercise_id', exerciseIds)
    .order('session_date', { ascending: false })

  // Fetch today's logs specifically
  const { data: todayLogs } = await supabase
    .from('workout_logs')
    .select('*')
    .in('exercise_id', exerciseIds)
    .eq('session_date', today)

  // Build exercises with last log (most recent non-today or today)
  const exercisesWithLog: ExerciseWithLog[] = exercises.map((exercise) => {
    // Prefer today's log if it exists
    const todayLog = todayLogs?.find((l) => l.exercise_id === exercise.id)
    if (todayLog) {
      return { ...exercise, lastLog: todayLog }
    }
    // Otherwise find most recent
    const lastLog = allLogs?.find((l) => l.exercise_id === exercise.id)
    return { ...exercise, lastLog: lastLog || undefined }
  })

  const jourLabel = jourLabels[jour]

  // Derive muscle groups in order
  const groupes = Array.from(new Set(exercises.map((e) => e.groupe_musculaire)))

  return (
    <SessionClient
      jour={jour}
      jourLabel={jourLabel}
      exercises={exercisesWithLog}
      groupes={groupes}
      today={today}
    />
  )
}

import { supabase } from './supabase'
import { WorkoutLogWithExercise } from './types'

export async function getMuscleGroups(): Promise<string[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('groupe_musculaire')
    .order('groupe_musculaire', { ascending: true })

  if (error || !data) return []

  const seen = new Set<string>()
  for (const row of data) {
    if (row.groupe_musculaire) seen.add(row.groupe_musculaire)
  }
  return Array.from(seen)
}

export async function getWorkoutLogsByExercise(): Promise<Record<string, WorkoutLogWithExercise[]>> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*, exercises(*)')
    .order('session_date', { ascending: true })

  if (error || !data) return {}

  const grouped: Record<string, WorkoutLogWithExercise[]> = {}
  for (const log of data as WorkoutLogWithExercise[]) {
    const name = log.exercises?.exercice
    if (name) {
      if (!grouped[name]) grouped[name] = []
      grouped[name].push(log)
    }
  }
  return grouped
}

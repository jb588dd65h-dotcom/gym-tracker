export type Jour = 'lundi' | 'mardi' | 'vendredi' | 'samedi'

export interface Exercise {
  id: number
  jour: Jour
  groupe_musculaire: string
  exercice: string
  poids_initial: number
  serie1_reps_cible: number
  serie2_reps_cible: number
  serie3_reps_cible: number
  repos: string | null
  ordre: number
}

export interface WorkoutLog {
  id: number
  session_date: string
  exercise_id: number
  poids: number
  serie1_reps: number | null
  serie2_reps: number | null
  serie3_reps: number | null
  note: string | null
  created_at: string
}

export interface WorkoutLogWithExercise extends WorkoutLog {
  exercises: Exercise
}

export interface ExerciseWithLog extends Exercise {
  lastLog?: WorkoutLog
}

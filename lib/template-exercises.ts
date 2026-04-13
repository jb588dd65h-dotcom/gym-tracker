export type ExerciseTemplate = {
  jour: string
  groupe_musculaire: string
  exercice: string
  poids_initial: number
  serie1_reps_cible: number
  serie2_reps_cible: number
  serie3_reps_cible: number
  repos: string | null
  ordre: number
}

// 29 base exercises — copied to every new user on sign-up
export const TEMPLATE_EXERCISES: ExerciseTemplate[] = [
  // MONDAY - Épaules
  { jour: 'lundi', groupe_musculaire: 'Épaules', exercice: 'Deltoid press', poids_initial: 50, serie1_reps_cible: 13, serie2_reps_cible: 12, serie3_reps_cible: 10, repos: null, ordre: 1 },
  { jour: 'lundi', groupe_musculaire: 'Épaules', exercice: 'Élévation frontale', poids_initial: 30, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 9, repos: null, ordre: 2 },
  { jour: 'lundi', groupe_musculaire: 'Épaules', exercice: 'Lateral deltoids', poids_initial: 45, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 10, repos: null, ordre: 3 },
  { jour: 'lundi', groupe_musculaire: 'Épaules', exercice: 'Reverse pec fly', poids_initial: 40, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 9, repos: null, ordre: 4 },
  { jour: 'lundi', groupe_musculaire: 'Épaules', exercice: 'Standing multi flight', poids_initial: 45, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: null, ordre: 5 },

  // TUESDAY - Biceps
  { jour: 'mardi', groupe_musculaire: 'Biceps', exercice: 'Curls poulies (panata)', poids_initial: 30, serie1_reps_cible: 13, serie2_reps_cible: 12, serie3_reps_cible: 10, repos: '1m45', ordre: 1 },
  { jour: 'mardi', groupe_musculaire: 'Biceps', exercice: 'Curls barre poulie (panata)', poids_initial: 60, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: '1m45', ordre: 2 },
  { jour: 'mardi', groupe_musculaire: 'Biceps', exercice: 'Curls haltères incliné sur banc', poids_initial: 15, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: '1m45', ordre: 3 },
  { jour: 'mardi', groupe_musculaire: 'Biceps', exercice: 'Curls marteau haltères', poids_initial: 15, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: '1m45', ordre: 4 },

  // TUESDAY - Dos
  { jour: 'mardi', groupe_musculaire: 'Dos', exercice: 'Lat pulldown', poids_initial: 100, serie1_reps_cible: 9, serie2_reps_cible: 8, serie3_reps_cible: 7, repos: '3min', ordre: 5 },
  { jour: 'mardi', groupe_musculaire: 'Dos', exercice: 'Pulley row', poids_initial: 80, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: '2m45', ordre: 6 },
  { jour: 'mardi', groupe_musculaire: 'Dos', exercice: 'Tirage unilatérale', poids_initial: 60, serie1_reps_cible: 9, serie2_reps_cible: 8, serie3_reps_cible: 6, repos: '2min', ordre: 7 },
  { jour: 'mardi', groupe_musculaire: 'Dos', exercice: 'Pull over', poids_initial: 60, serie1_reps_cible: 13, serie2_reps_cible: 12, serie3_reps_cible: 11, repos: '2min', ordre: 8 },

  // FRIDAY - Triceps
  { jour: 'vendredi', groupe_musculaire: 'Triceps', exercice: 'Tirage verticale (panata)', poids_initial: 60, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: '1m45', ordre: 1 },
  { jour: 'vendredi', groupe_musculaire: 'Triceps', exercice: 'Tirage over head', poids_initial: 40, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: null, ordre: 2 },
  { jour: 'vendredi', groupe_musculaire: 'Triceps', exercice: 'Dips press', poids_initial: 120, serie1_reps_cible: 10, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: '1m45', ordre: 3 },

  // FRIDAY - Pecs
  { jour: 'vendredi', groupe_musculaire: 'Pecs', exercice: 'Développer coucher haltères', poids_initial: 40, serie1_reps_cible: 12, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: null, ordre: 4 },
  { jour: 'vendredi', groupe_musculaire: 'Pecs', exercice: 'Super inclined chest press', poids_initial: 40, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: null, ordre: 5 },
  { jour: 'vendredi', groupe_musculaire: 'Pecs', exercice: 'Pectoral machine', poids_initial: 50, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: null, ordre: 6 },
  { jour: 'vendredi', groupe_musculaire: 'Pecs', exercice: 'Pecs double poulies', poids_initial: 20, serie1_reps_cible: 11, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: null, ordre: 7 },

  // SATURDAY - Jambes
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Leg extensions', poids_initial: 80, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: null, ordre: 1 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Unilateral leg extension', poids_initial: 30, serie1_reps_cible: 12, serie2_reps_cible: 11, serie3_reps_cible: 10, repos: null, ordre: 2 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Squat smith machine', poids_initial: 40, serie1_reps_cible: 8, serie2_reps_cible: 7, serie3_reps_cible: 6, repos: null, ordre: 3 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Presse (poids en plaques)', poids_initial: 100, serie1_reps_cible: 10, serie2_reps_cible: 9, serie3_reps_cible: 8, repos: null, ordre: 4 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Fentes', poids_initial: 10, serie1_reps_cible: 20, serie2_reps_cible: 20, serie3_reps_cible: 20, repos: null, ordre: 5 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Kneeling leg curling', poids_initial: 20, serie1_reps_cible: 8, serie2_reps_cible: 7, serie3_reps_cible: 7, repos: null, ordre: 6 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Leg curling', poids_initial: 45, serie1_reps_cible: 8, serie2_reps_cible: 8, serie3_reps_cible: 10, repos: null, ordre: 7 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Ischio haltère', poids_initial: 17.5, serie1_reps_cible: 9, serie2_reps_cible: 8, serie3_reps_cible: 7, repos: null, ordre: 8 },
  { jour: 'samedi', groupe_musculaire: 'Jambes', exercice: 'Abductor machine', poids_initial: 70, serie1_reps_cible: 12, serie2_reps_cible: 10, serie3_reps_cible: 9, repos: null, ordre: 9 },
]

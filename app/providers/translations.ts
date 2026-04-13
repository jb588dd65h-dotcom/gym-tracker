export type Lang = 'fr' | 'en'

export const TRANSLATIONS = {
  fr: {
    // Nav
    navSessions: 'Séances',
    navProgression: 'Progression',
    navSettings: 'Réglages',

    // Home
    homeTitle: 'Vos séances',
    homeSubtitle: 'Choisissez votre entraînement',
    start: 'Commencer',
    review: 'Revoir la séance',
    noExercise: 'Aucun exercice pour ce jour — utilise le',
    noExerciseAdd: '+ pour en ajouter',
    addExercise: 'Ajouter un exercice',
    exerciseAdded: 'Exercice ajouté !',

    // Days
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
    dimanche: 'Dimanche',

    // Session
    saveSession: 'Enregistrer la séance',
    saving: 'Enregistrement...',
    targetReps: 'Cible',
    reps: 'reps',
    weightDown: 'Baisse le poids',
    weightUp: 'Augmente le poids !',

    // Progression
    progressionTitle: 'Progression',
    progressionSubtitle: 'Suivez vos progrès par groupe musculaire',
    loading: 'Chargement...',
    noProgressData: 'Pas encore de données pour',
    keepGoing: 'Enregistrez vos séances pour voir votre progression',
    lastWeight: 'Dernière charge',
    vsPrev: 'vs séance préc.',
    notEnoughData: 'Pas encore assez de données — continue tes séances !',

    // Settings
    settingsTitle: 'Réglages',
    sectionAccount: 'Compte',
    sectionAppearance: 'Apparence',
    sectionLanguage: 'Langue',
    sectionData: 'Données',
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
    signOut: 'Se déconnecter',
    email: 'Email',
    password: 'Mot de passe',
    darkTheme: 'Thème sombre',
    lightTheme: 'Thème clair',
    deleteData: 'Supprimer toutes mes données',
    deleteConfirmTitle: 'Supprimer les données',
    deleteConfirmMsg: 'Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    loginError: 'Email ou mot de passe incorrect.',
    signupSuccess: 'Compte créé ! Vérifiez votre email.',
    deleteSuccess: 'Données supprimées.',
    connectedAs: 'Connecté en tant que',
    deleteAccount: 'Supprimer mon compte',
  },
  en: {
    // Nav
    navSessions: 'Sessions',
    navProgression: 'Progress',
    navSettings: 'Settings',

    // Home
    homeTitle: 'Your sessions',
    homeSubtitle: 'Choose your workout',
    start: 'Start',
    review: 'Review session',
    noExercise: 'No exercises for this day — use',
    noExerciseAdd: '+ to add one',
    addExercise: 'Add exercise',
    exerciseAdded: 'Exercise added!',

    // Days
    lundi: 'Monday',
    mardi: 'Tuesday',
    mercredi: 'Wednesday',
    jeudi: 'Thursday',
    vendredi: 'Friday',
    samedi: 'Saturday',
    dimanche: 'Sunday',

    // Session
    saveSession: 'Save session',
    saving: 'Saving...',
    targetReps: 'Target',
    reps: 'reps',
    weightDown: 'Lower the weight',
    weightUp: 'Increase the weight!',

    // Progression
    progressionTitle: 'Progress',
    progressionSubtitle: 'Track your progress by muscle group',
    loading: 'Loading...',
    noProgressData: 'No data yet for',
    keepGoing: 'Log your sessions to see your progress',
    lastWeight: 'Last weight',
    vsPrev: 'vs prev. session',
    notEnoughData: 'Not enough data yet — keep training!',

    // Settings
    settingsTitle: 'Settings',
    sectionAccount: 'Account',
    sectionAppearance: 'Appearance',
    sectionLanguage: 'Language',
    sectionData: 'Data',
    signIn: 'Sign in',
    createAccount: 'Create account',
    signOut: 'Sign out',
    email: 'Email',
    password: 'Password',
    darkTheme: 'Dark theme',
    lightTheme: 'Light theme',
    deleteData: 'Delete all my data',
    deleteConfirmTitle: 'Delete data',
    deleteConfirmMsg: 'Are you sure you want to delete all your data? This action is irreversible.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loginError: 'Incorrect email or password.',
    signupSuccess: 'Account created! Check your email.',
    deleteSuccess: 'Data deleted.',
    connectedAs: 'Signed in as',
    deleteAccount: 'Delete my account',
  },
} as const

export type TranslationKey = keyof typeof TRANSLATIONS.fr

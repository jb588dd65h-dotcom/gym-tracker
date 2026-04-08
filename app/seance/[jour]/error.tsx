'use client'

import { useEffect } from 'react'

export default function SeanceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[SeanceError boundary]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-red-400 font-semibold text-base mb-2">
        Erreur lors du chargement de la séance
      </p>
      <p className="text-app-muted text-sm mb-6 max-w-xs">
        {error.message || 'Une erreur inattendue s\'est produite.'}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-app-primary text-sm font-medium hover:bg-white/15 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}

'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

export type MascotState = 'idle' | 'happy' | 'excited' | 'thinking' | 'celebration' | 'sleep'

interface Reaction {
  state: MascotState
  message?: string
  id: number   // ever-increasing so the same state triggers the effect again
}

interface MascotContextValue {
  reaction: Reaction | null
  trigger: (state: MascotState, message?: string) => void
  clearReaction: () => void
}

const MascotContext = createContext<MascotContextValue>({
  reaction: null,
  trigger: () => {},
  clearReaction: () => {},
})

export function useMascot() {
  return useContext(MascotContext)
}

let nextId = 0

export function MascotProvider({ children }: { children: ReactNode }) {
  const [reaction, setReaction] = useState<Reaction | null>(null)

  const trigger = useCallback((state: MascotState, message?: string) => {
    setReaction({ state, message, id: ++nextId })
  }, [])

  const clearReaction = useCallback(() => {
    setReaction(null)
  }, [])

  return (
    <MascotContext.Provider value={{ reaction, trigger, clearReaction }}>
      {children}
    </MascotContext.Provider>
  )
}

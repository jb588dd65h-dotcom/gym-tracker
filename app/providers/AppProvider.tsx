'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TRANSLATIONS, Lang, TranslationKey } from './translations'

// ── Theme ──────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', setTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

// ── Language ───────────────────────────────────────────────────────────────

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => TRANSLATIONS.fr[key],
})

export function useLang() {
  return useContext(LangContext)
}

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [lang, setLangState] = useState<Lang>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = (localStorage.getItem('gym-theme') as Theme) || 'dark'
    const savedLang = (localStorage.getItem('gym-lang') as Lang) || 'fr'
    setThemeState(savedTheme)
    setLangState(savedLang)
    document.documentElement.setAttribute('data-theme', savedTheme)
    setMounted(true)
  }, [])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem('gym-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('gym-lang', l)
  }

  function t(key: TranslationKey): string {
    return TRANSLATIONS[lang][key]
  }

  // Render with dark theme until hydrated to avoid layout shift
  const effectiveTheme = mounted ? theme : 'dark'

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, setTheme }}>
      <LangContext.Provider value={{ lang, setLang, t }}>
        {children}
      </LangContext.Provider>
    </ThemeContext.Provider>
  )
}

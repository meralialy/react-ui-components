import { useEffect, useState } from 'react'

export type ColorMode = 'light' | 'dark' | 'system'

// Keep in sync with the inline script in index.html, which applies the stored mode before
// the app loads so the page doesn't flash the wrong colors.
const STORAGE_KEY = 'color-mode'

function readStoredMode(): ColorMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function useColorMode() {
  const [mode, setMode] = useState<ColorMode>(readStoredMode)

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'system') {
      delete root.dataset.theme
      root.style.colorScheme = ''
    } else {
      root.dataset.theme = mode
      root.style.colorScheme = mode
    }

    try {
      if (mode === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Storage unavailable (e.g. private browsing); the choice just won't persist.
    }
  }, [mode])

  return [mode, setMode] as const
}

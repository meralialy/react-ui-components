import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from '../components/toast'
import type { ToastProviderProps } from '../components/toast'
import { BaseStyles, ThemeVariables } from '../theme/global-style'
import { theme } from '../theme/theme'

export type UIProviderProps = {
  children: ReactNode
  /**
   * Apply the theme's page defaults: background, text color and font on <body>, and link color.
   * Turn off if your app already styles these. Color variables and box-sizing always apply,
   * since the components depend on them.
   */
  baseStyles?: boolean
  /** Options for toasts, e.g. { placement: 'top-right' }. */
  toast?: Omit<ToastProviderProps, 'children'>
}

/**
 * Everything the components need, in one wrapper. Render it once, at the root of your app.
 */
export function UIProvider({ children, baseStyles = true, toast }: UIProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <ThemeVariables />
      {baseStyles && <BaseStyles />}
      <ToastProvider {...toast}>{children}</ToastProvider>
    </ThemeProvider>
  )
}

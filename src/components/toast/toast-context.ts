import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { Status } from '../shared/status-icon'

export type ToastStatus = Status

export type ToastOptions = {
  title: ReactNode
  description?: ReactNode
  status?: ToastStatus
  /** Milliseconds before it hides itself; null keeps it until dismissed. Pauses on hover/focus. */
  duration?: number | null
  /** One optional follow-up, e.g. { label: 'Undo', onClick: restore }. */
  action?: { label: string; onClick: () => void }
}

export type ToastApi = {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

/** Access toast() and dismiss(). Needs a <ToastProvider> higher up, usually at the app root. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used inside <ToastProvider>')
  return api
}

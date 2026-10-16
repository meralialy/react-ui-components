import type { ReactNode } from 'react'

export type Status = 'info' | 'success' | 'warning' | 'danger'

// Each status has its own shape, not just its own color, so it's distinguishable without color
// (WCAG 1.4.1). Decorative: the message text carries the meaning.
const paths: Record<Status, ReactNode> = {
  info: (
    <>
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="6.25" r="1" fill="currentColor" />
    </>
  ),
  success: (
    <>
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.5 10.25 2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  warning: (
    <>
      <path
        d="M8.7 3.2a1.5 1.5 0 0 1 2.6 0l6.5 11.3a1.5 1.5 0 0 1-1.3 2.25H3.5a1.5 1.5 0 0 1-1.3-2.25L8.7 3.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 7.75v3.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </>
  ),
  danger: (
    <>
      <path
        d="M6.6 2.5h6.8l4.1 4.1v6.8l-4.1 4.1H6.6l-4.1-4.1V6.6l4.1-4.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 6.25v4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </>
  ),
}

export function StatusIcon({ status, size = 20 }: { status: Status; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {paths[status]}
    </svg>
  )
}

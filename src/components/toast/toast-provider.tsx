import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css, keyframes } from 'styled-components'
import { CloseButton } from '../shared/close-button'
import { StatusIcon } from '../shared/status-icon'
import { ToastContext } from './toast-context'
import type { ToastOptions, ToastStatus } from './toast-context'

type ToastItem = ToastOptions & { id: string }

export type ToastPlacement = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export type ToastProviderProps = {
  children: ReactNode
  /** Where toasts appear. Pick one per app so users learn where to look. */
  placement?: ToastPlacement
  /** Most toasts shown at once; older ones are dismissed to make room. */
  max?: number
  /** Default auto-hide time in milliseconds. */
  duration?: number
}

type Edge = 'top' | 'bottom'

// Full width on phones; from the sm breakpoint, a 380px column in the chosen corner or centered.
// The region is always in the page (even when empty) so screen readers register it before the
// first toast arrives.
const Region = styled.ol<{ $placement: ToastPlacement }>`
  position: fixed;
  ${({ $placement }) => ($placement.startsWith('top') ? 'top: 16px;' : 'bottom: 16px;')}
  right: 16px;
  left: 16px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 380px;
    ${({ $placement }) =>
      $placement.endsWith('right')
        ? css`
            left: auto;
          `
        : css`
            right: auto;
            left: 50%;
            transform: translateX(-50%);
          `}
  }
`

// Toasts slide in from the edge they're attached to.
const enterFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
`

const enterFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
`

const fade = keyframes`
  from {
    opacity: 0;
  }
`

const Card = styled.li<{ $status: ToastStatus; $edge: Edge }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-left: 4px solid ${({ theme, $status }) => theme.colors[$status].text};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.background.card};
  box-shadow: ${({ theme }) => theme.shadow.popover};
  color: ${({ theme }) => theme.text.default};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.9375rem;
  line-height: 1.5;
  pointer-events: auto;
  animation: ${({ $edge }) => ($edge === 'top' ? enterFromTop : enterFromBottom)} 180ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation-name: ${fade};
  }
`

const Icon = styled.span<{ $status: ToastStatus }>`
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${({ theme, $status }) => theme.colors[$status].text};
`

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const Title = styled.p`
  margin: 0;
  font-weight: 600;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.muted};
`

const ActionButton = styled.button`
  align-self: flex-start;
  margin: 6px 0 0;
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary.text};
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
    border-radius: 2px;
  }
`

function Toast({
  item,
  edge,
  defaultDuration,
  onDismiss,
}: {
  item: ToastItem
  edge: Edge
  defaultDuration: number
  onDismiss: (id: string) => void
}) {
  const status = item.status ?? 'info'
  const duration = item.duration === undefined ? defaultDuration : item.duration
  // Pause while hovered or focused, so people have time to read or reach the action (WCAG 2.2.1).
  const [paused, setPaused] = useState(false)
  const remaining = useRef(duration ?? 0)

  useEffect(() => {
    if (duration === null || paused) return
    const startedAt = Date.now()
    const timeout = setTimeout(() => onDismiss(item.id), remaining.current)
    return () => {
      clearTimeout(timeout)
      remaining.current -= Date.now() - startedAt
    }
  }, [duration, paused, item.id, onDismiss])

  return (
    <Card
      $status={status}
      $edge={edge}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <Icon $status={status}>
        <StatusIcon status={status} />
      </Icon>
      <Body>
        <Title>{item.title}</Title>
        {item.description && <Description>{item.description}</Description>}
        {item.action && (
          <ActionButton
            type="button"
            onClick={() => {
              item.action?.onClick()
              onDismiss(item.id)
            }}
          >
            {item.action.label}
          </ActionButton>
        )}
      </Body>
      <CloseButton label="Dismiss notification" onClick={() => onDismiss(item.id)} />
    </Card>
  )
}

/** Renders toasts and provides useToast() to everything inside it. Place once, near the root. */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  max = 3,
  duration = 6000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${++nextId.current}`
      setToasts((prev) => [...prev, { ...options, id }].slice(-max))
      return id
    },
    [max],
  )

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  // Newest sits nearest the edge. For top placements, render newest first so the reading order
  // matches what's on screen.
  const edge: Edge = placement.startsWith('top') ? 'top' : 'bottom'
  const ordered = edge === 'top' ? [...toasts].reverse() : toasts

  return (
    <ToastContext value={api}>
      {children}
      {createPortal(
        // Polite: toasts are announced after what the user is doing, never interrupting.
        // Errors that need immediate attention belong in an Alert near the problem instead.
        <Region $placement={placement} aria-live="polite" aria-label="Notifications">
          {ordered.map((item) => (
            <Toast
              key={item.id}
              item={item}
              edge={edge}
              defaultDuration={duration}
              onDismiss={dismiss}
            />
          ))}
        </Region>,
        document.body,
      )}
    </ToastContext>
  )
}

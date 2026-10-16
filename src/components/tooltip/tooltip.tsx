import type { FocusEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react'
import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { assignRef } from '../../utils/merge-refs'
import { useFloating } from '../shared/floating'
import type { Side } from '../shared/floating'

type TriggerProps = {
  ref?: Ref<HTMLElement>
  'aria-describedby'?: string
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void
  onFocus?: (e: FocusEvent<HTMLElement>) => void
  onBlur?: (e: FocusEvent<HTMLElement>) => void
}

export type TooltipProps = {
  /** Short, plain text that adds to the trigger's label. Not for interactive content. */
  content: ReactNode
  /** One focusable element, e.g. a Button. Disabled buttons can't show tooltips (no events). */
  children: ReactElement<TriggerProps>
  side?: Side
  /** Hover delay before showing, in ms. Keyboard focus shows it immediately. */
  delay?: number
}

const Tip = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 60;
  max-width: 260px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  /* Inverted surface so it stands apart from any background */
  background-color: ${({ theme }) => theme.text.default};
  color: ${({ theme }) => theme.background.card};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.8125rem;
  line-height: 1.4;
  box-shadow: ${({ theme }) => theme.shadow.popover};

  &[hidden] {
    display: none;
  }
`

/**
 * Shows a short description on hover and focus. Meets WCAG 1.4.13: it can be dismissed with
 * Escape, the pointer can move onto it without it vanishing, and it stays until the pointer or
 * focus leaves.
 */
export function Tooltip({ content, children, side = 'top', delay = 300 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const id = useId()

  const tipRef = useFloating({ open, anchor: triggerRef, side, align: 'center', offset: 6 })

  const showAfter = (ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), ms)
  }
  // A short grace period lets the pointer travel from the trigger onto the tooltip
  const hideAfter = (ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), ms)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Keep our own handle on the trigger while still forwarding the child's ref
  const childRef = children.props.ref
  const ref = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
      assignRef(childRef, node)
    },
    [childRef],
  )
  const describedBy = [children.props['aria-describedby'], id].filter(Boolean).join(' ')

  // eslint-disable-next-line react-hooks/refs -- cloneElement only attaches the callback ref; React calls it after render
  const trigger = cloneElement(children, {
    ref,
    // Always linked (even while hidden) so screen readers read it on focus without timing issues
    'aria-describedby': describedBy,
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(e)
      showAfter(delay)
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(e)
      hideAfter(100)
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e)
      showAfter(0)
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e)
      hideAfter(0)
    },
  } as TriggerProps)

  return (
    <>
      {trigger}
      {createPortal(
        <Tip
          ref={tipRef}
          id={id}
          role="tooltip"
          hidden={!open}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={() => hideAfter(100)}
        >
          {content}
        </Tip>,
        document.body,
      )}
    </>
  )
}

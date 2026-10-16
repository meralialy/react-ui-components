import type { MouseEvent, ReactElement, ReactNode, Ref } from 'react'
import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { assignRef } from '../../utils/merge-refs'
import { CloseButton } from '../shared/close-button'
import { useFloating } from '../shared/floating'
import type { Align, Side } from '../shared/floating'
import { FloatingPanel } from '../shared/floating-panel'
import { useDismiss } from '../shared/use-dismiss'

type TriggerProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

export type PopoverProps = {
  /** The element that toggles the popover, e.g. <Button>Filters</Button>. */
  trigger: ReactElement<TriggerProps>
  children: ReactNode
  /** Heading shown at the top; also names the popover for screen readers. */
  title?: ReactNode
  /** Accessible name when there's no visible title. One of title or label is required. */
  label?: string
  /** Controlled open state. Pair with onOpenChange. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: Side
  align?: Align
  width?: number
}

const Panel = styled(FloatingPanel)<{ $width: number }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $width }) => $width}px;
  max-width: calc(100vw - 16px);
  padding: 16px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * A non-modal panel anchored to a trigger, for interactive content like quick filters or
 * settings. Focus moves in on open; Escape, clicking outside, or tabbing away closes it.
 */
export function Popover({
  trigger,
  children,
  title,
  label,
  open: controlledOpen,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  width = 320,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const triggerRef = useRef<HTMLElement>(null)
  const id = useId()
  const titleId = `${id}-title`

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const panelRef = useFloating({ open, anchor: triggerRef, side, align })
  useDismiss(open, [triggerRef, panelRef], (reason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  })

  // Move focus into the popover: its first focusable element, or the panel itself
  useEffect(() => {
    if (!open || !panelRef.current) return
    const first = panelRef.current.querySelector<HTMLElement>(focusableSelector)
    ;(first ?? panelRef.current).focus()
  }, [open, panelRef])

  // Keep our own handle on the trigger while still forwarding the caller's ref
  const triggerOwnRef = trigger.props.ref
  const ref = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
      assignRef(triggerOwnRef, node)
    },
    [triggerOwnRef],
  )

  // eslint-disable-next-line react-hooks/refs -- cloneElement only attaches the callback ref; React calls it after render
  const clonedTrigger = cloneElement(trigger, {
    ref,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(e)
      setOpen(!open)
    },
  } as TriggerProps)

  return (
    <>
      {clonedTrigger}
      {open &&
        createPortal(
          <Panel
            ref={panelRef}
            id={id}
            role="dialog"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : label}
            tabIndex={-1}
            $width={width}
            onKeyDown={(e) => {
              if (e.key !== 'Tab' || !panelRef.current) return
              const focusable = [
                ...panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
              ]
              const atEnd = e.shiftKey
                ? document.activeElement === (focusable[0] ?? panelRef.current)
                : document.activeElement === (focusable.at(-1) ?? panelRef.current)
              if (!atEnd) return
              // The panel lives at the end of the page, so tabbing out continues from the trigger:
              // Shift+Tab lands on the trigger; Tab moves past it, to what follows in the page.
              setOpen(false)
              triggerRef.current?.focus()
              if (e.shiftKey) e.preventDefault()
            }}
            onBlur={(e) => {
              // Close when focus moves elsewhere on the page, e.g. a click on another control
              const next = e.relatedTarget as Node | null
              if (next && !panelRef.current?.contains(next) && !triggerRef.current?.contains(next))
                setOpen(false)
            }}
          >
            {title && (
              <Header>
                <Title id={titleId}>{title}</Title>
                <CloseButton
                  label="Close"
                  onClick={() => {
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                />
              </Header>
            )}
            {children}
          </Panel>,
          document.body,
        )}
    </>
  )
}

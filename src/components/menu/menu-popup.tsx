import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useFloating } from '../shared/floating'
import type { Align, Side } from '../shared/floating'
import { FloatingPanel } from '../shared/floating-panel'
import { useDismiss } from '../shared/use-dismiss'

export type MenuAction = {
  label: string
  onSelect: () => void
  icon?: ReactNode
  disabled?: boolean
  /** Styles the action as destructive, e.g. "Delete". */
  danger?: boolean
}

/** An action, or a divider between groups of actions. */
export type MenuItem = MenuAction | { separator: true }

const isSeparator = (item: MenuItem): item is { separator: true } => 'separator' in item

type MenuPopupProps = {
  open: boolean
  items: MenuItem[]
  /** Element the menu is positioned against; clicks inside it don't count as "outside". */
  anchorRef: RefObject<HTMLElement | null>
  /** Element that opened the menu; focus returns here when it closes. */
  returnFocusRef: RefObject<HTMLElement | null>
  onClose: () => void
  focusOnOpen: 'first' | 'last'
  id: string
  labelledBy: string
  side?: Side
  align?: Align
}

const Panel = styled(FloatingPanel)`
  display: flex;
  flex-direction: column;
  min-width: 180px;
  max-width: 320px;
  padding: 4px;
`

const Item = styled.button<{ $danger: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger.text : theme.text.default)};
  font: inherit;
  font-size: 0.9375rem;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  /* One highlight for hover and keyboard focus, so pointer and keys never disagree */
  &:hover,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: -2px;
  }

  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Separator = styled.div`
  height: 1px;
  margin: 4px 0;
  background-color: ${({ theme }) => theme.border};
`

/**
 * The menu surface shared by Menu and SplitButton. Follows the WAI-ARIA menu pattern: arrows,
 * Home/End and type-ahead move between items; Escape and Tab close; choosing an item closes the
 * menu and returns focus to the element that opened it.
 */
export function MenuPopup({
  open,
  items,
  anchorRef,
  returnFocusRef,
  onClose,
  focusOnOpen,
  id,
  labelledBy,
  side = 'bottom',
  align = 'start',
}: MenuPopupProps) {
  const panelRef = useFloating({ open, anchor: anchorRef, side, align, offset: 4 })
  useDismiss(open, [anchorRef, panelRef], (reason) => {
    onClose()
    if (reason === 'escape') returnFocusRef.current?.focus()
  })

  const menuItems = () => [
    ...(panelRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? []),
  ]

  // Move focus into the menu once it has rendered
  useEffect(() => {
    if (!open) return
    const all = [...(panelRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])]
    ;(focusOnOpen === 'first' ? all[0] : all[all.length - 1])?.focus()
  }, [open, focusOnOpen, panelRef])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const all = menuItems()
    const current = all.indexOf(document.activeElement as HTMLElement)
    const focusAt = (i: number) => all[(i + all.length) % all.length]?.focus()

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        focusAt(current + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        focusAt(current - 1)
        break
      case 'Home':
        e.preventDefault()
        focusAt(0)
        break
      case 'End':
        e.preventDefault()
        focusAt(all.length - 1)
        break
      case 'Tab':
        // The menu lives at the end of the page, so continue from the trigger instead: focus it
        // and let the browser's default Tab move on to whatever comes after (or before) it.
        returnFocusRef.current?.focus()
        onClose()
        break
      default:
        // Type-ahead: jump to the next item starting with the typed character
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const char = e.key.toLowerCase()
          const order = [...all.slice(current + 1), ...all.slice(0, current + 1)]
          order.find((item) => item.textContent?.trim().toLowerCase().startsWith(char))?.focus()
        }
    }
  }

  function select(action: MenuAction) {
    if (action.disabled) return
    onClose()
    returnFocusRef.current?.focus()
    action.onSelect()
  }

  if (!open) return null

  return createPortal(
    <Panel ref={panelRef} id={id} role="menu" aria-labelledby={labelledBy} onKeyDown={onKeyDown}>
      {items.map((item, i) =>
        isSeparator(item) ? (
          <Separator key={`separator-${i}`} role="separator" />
        ) : (
          <Item
            key={item.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            $danger={Boolean(item.danger)}
            // aria-disabled keeps the item reachable, so users can discover it exists
            aria-disabled={item.disabled || undefined}
            onClick={() => select(item)}
          >
            {item.icon}
            {item.label}
          </Item>
        ),
      )}
    </Panel>,
    document.body,
  )
}

import type { KeyboardEvent, MouseEvent, ReactElement, Ref } from 'react'
import { cloneElement, useCallback, useId, useRef, useState } from 'react'
import { assignRef } from '../../utils/merge-refs'
import type { Align, Side } from '../shared/floating'
import { MenuPopup } from './menu-popup'
import type { MenuItem } from './menu-popup'

type TriggerProps = {
  id?: string
  ref?: Ref<HTMLElement>
  onClick?: (e: MouseEvent<HTMLElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void
}

export type MenuProps = {
  /** The button that opens the menu, e.g. <Button>Actions</Button>. Must be a single element. */
  trigger: ReactElement<TriggerProps>
  items: MenuItem[]
  side?: Side
  align?: Align
}

/**
 * A button that opens a list of actions. The trigger gets aria-haspopup and aria-expanded, and
 * opens with click, Enter, Space, or Arrow keys.
 */
export function Menu({ trigger, items, side = 'bottom', align = 'start' }: MenuProps) {
  const [open, setOpen] = useState(false)
  const [focusOnOpen, setFocusOnOpen] = useState<'first' | 'last'>('first')
  const triggerRef = useRef<HTMLElement>(null)
  const generatedId = useId()
  const triggerId = trigger.props.id ?? `${generatedId}-trigger`
  const menuId = `${generatedId}-menu`

  // Keep our own handle on the trigger while still forwarding the caller's ref
  const triggerOwnRef = trigger.props.ref
  const ref = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
      assignRef(triggerOwnRef, node)
    },
    [triggerOwnRef],
  )

  const openAt = (focus: 'first' | 'last') => {
    setFocusOnOpen(focus)
    setOpen(true)
  }

  // eslint-disable-next-line react-hooks/refs -- cloneElement only attaches the callback ref; React calls it after render
  const clonedTrigger = cloneElement(trigger, {
    id: triggerId,
    ref,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(e)
      if (open) setOpen(false)
      else openAt('first')
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      trigger.props.onKeyDown?.(e)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        openAt(e.key === 'ArrowDown' ? 'first' : 'last')
      }
    },
  } as TriggerProps)

  return (
    <>
      {clonedTrigger}
      <MenuPopup
        open={open}
        items={items}
        anchorRef={triggerRef}
        returnFocusRef={triggerRef}
        onClose={() => setOpen(false)}
        focusOnOpen={focusOnOpen}
        id={menuId}
        labelledBy={triggerId}
        side={side}
        align={align}
      />
    </>
  )
}

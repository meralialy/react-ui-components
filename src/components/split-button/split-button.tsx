import type { KeyboardEvent } from 'react'
import { useId, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Button } from '../button'
import type { ButtonProps, ButtonSize, ButtonVariant } from '../button'
import { MenuPopup } from '../menu/menu-popup'
import type { MenuAction, MenuItem } from '../menu/menu-popup'

/** A menu action. Same shape as Menu's items. */
export type SplitButtonAction = MenuAction

export type SplitButtonProps = Omit<ButtonProps, 'fullWidth' | 'endIcon'> & {
  /** Secondary actions shown in the menu. Use { separator: true } to divide groups. */
  actions: MenuItem[]
  /** Accessible name for the menu toggle. */
  menuLabel?: string
  /** Which edge of the button the menu lines up with. */
  align?: 'start' | 'end'
}

const toggleWidths: Record<ButtonSize, string> = { sm: '32px', md: '40px', lg: '48px' }

const Root = styled.div`
  display: inline-flex;
`

// The main action: square off the side that touches the toggle.
const MainButton = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const Toggle = styled(Button)<{ $variant: ButtonVariant; $size: ButtonSize }>`
  width: ${({ $size }) => toggleWidths[$size]};
  padding: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  ${({ $variant }) =>
    $variant === 'outline'
      ? // Overlap borders so the two halves share a single 1px divider
        css`
          margin-left: -1px;
        `
      : // Solid/ghost have no visible border, so draw a divider in the text color
        css`
          &::before {
            content: '';
            position: absolute;
            top: 25%;
            bottom: 25%;
            left: -0.5px;
            width: 1px;
            background-color: currentColor;
            opacity: 0.35;
          }
        `}

  svg {
    transition: transform 120ms ease;
  }

  &[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }
  }
`

function ChevronIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * A main action plus a menu of related actions. Follows the WAI-ARIA menu button pattern:
 * the toggle opens a role="menu"; arrows, Home/End and type-ahead move between items;
 * Escape closes and returns focus to the toggle.
 */
export function SplitButton({
  actions,
  menuLabel = 'More actions',
  align = 'end',
  color = 'primary',
  variant = 'solid',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  style,
  ...mainProps
}: SplitButtonProps) {
  const [open, setOpen] = useState(false)
  const [focusOnOpen, setFocusOnOpen] = useState<'first' | 'last'>('first')
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const toggleId = useId()

  function openMenu(focus: 'first' | 'last') {
    setFocusOnOpen(focus)
    setOpen(true)
  }

  function onToggleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openMenu(e.key === 'ArrowDown' ? 'first' : 'last')
    }
  }

  const shared = { color, variant, size } as const

  return (
    <Root ref={rootRef} className={className} style={style}>
      <MainButton {...shared} disabled={disabled} loading={loading} {...mainProps} />
      <Toggle
        {...shared}
        ref={toggleRef}
        id={toggleId}
        $variant={variant}
        $size={size}
        disabled={disabled || loading}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu('first'))}
        onKeyDown={onToggleKeyDown}
      >
        <ChevronIcon />
      </Toggle>
      {/* Positioned against the whole split button, so `align` lines up with its outer edge */}
      <MenuPopup
        open={open}
        items={actions}
        anchorRef={rootRef}
        returnFocusRef={toggleRef}
        onClose={() => setOpen(false)}
        focusOnOpen={focusOnOpen}
        id={menuId}
        labelledBy={toggleId}
        align={align}
      />
    </Root>
  )
}

import type { KeyboardEvent, ReactNode } from 'react'
import { useId, useRef, useState } from 'react'
import styled from 'styled-components'

export type TabItem = {
  value: string
  label: ReactNode
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export type TabsProps = {
  /** Names the set of tabs for screen readers, e.g. "Account settings". */
  label: string
  items: TabItem[]
  /** Selected tab (controlled). Pair with onChange. */
  value?: string
  /** Initially selected tab (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string
  onChange?: (value: string) => void
  /** Stretch tabs to share the full width equally. */
  fullWidth?: boolean
  className?: string
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fontFamily};
`

// Scrolls sideways when tabs don't fit, rather than wrapping onto a second row.
const List = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  scrollbar-width: thin;

  > * {
    flex: ${({ $fullWidth }) => ($fullWidth ? '1 1 0' : '0 0 auto')};
  }
`

const Tab = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  /* Selected indicator, drawn over the list's bottom border */
  &::after {
    content: '';
    position: absolute;
    right: 8px;
    bottom: -1px;
    left: 8px;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background-color: transparent;
  }

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.text.default};
  }

  &[aria-selected='true'] {
    color: ${({ theme }) => theme.colors.primary.text};
  }

  &[aria-selected='true']::after {
    background-color: ${({ theme }) => theme.colors.primary.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: -4px;
    border-radius: ${({ theme }) => theme.radius.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Panel = styled.div`
  padding-top: 20px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`

/**
 * Switches between panels of related content. Follows the WAI-ARIA tabs pattern: one tab stop
 * for the whole list, arrow keys (and Home/End) move and select, disabled tabs are skipped.
 */
export function Tabs({
  label,
  items,
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  className,
}: TabsProps) {
  const id = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value,
  )
  const selected = value ?? uncontrolled

  const select = (next: string) => {
    if (value === undefined) setUncontrolled(next)
    onChange?.(next)
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((item) => !item.disabled)
    const index = enabled.findIndex((item) => item.value === selected)
    let next: TabItem | undefined
    if (e.key === 'ArrowRight') next = enabled[(index + 1) % enabled.length]
    else if (e.key === 'ArrowLeft') next = enabled[(index - 1 + enabled.length) % enabled.length]
    else if (e.key === 'Home') next = enabled[0]
    else if (e.key === 'End') next = enabled[enabled.length - 1]
    if (!next) return
    e.preventDefault()
    select(next.value)
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus()
  }

  return (
    <Root className={className}>
      <List
        ref={listRef}
        role="tablist"
        aria-label={label}
        $fullWidth={fullWidth}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const isSelected = item.value === selected
          return (
            <Tab
              key={item.value}
              type="button"
              role="tab"
              id={`${id}-tab-${item.value}`}
              data-value={item.value}
              aria-selected={isSelected}
              aria-controls={`${id}-panel-${item.value}`}
              // Only the selected tab is in the Tab order; arrows move between tabs
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
            >
              {item.icon}
              {item.label}
            </Tab>
          )
        })}
      </List>
      {items.map((item) => (
        // Every panel stays mounted (hidden when inactive), so form input survives switching tabs
        <Panel
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${item.value}`}
          aria-labelledby={`${id}-tab-${item.value}`}
          hidden={item.value !== selected}
          tabIndex={0}
        >
          {item.content}
        </Panel>
      ))}
    </Root>
  )
}

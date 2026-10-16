import type { HTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { visuallyHidden } from '../shared/visually-hidden'

export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressColor = 'primary' | 'success' | 'warning' | 'danger'

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** What's progressing, e.g. "Uploading report.pdf". Required; use `hideLabel` to hide it. */
  label: ReactNode
  hideLabel?: boolean
  /** Current amount. Leave undefined when the total is unknown, for an animated bar. */
  value?: number
  max?: number
  /** Show the percentage next to the label. */
  showValue?: boolean
  /** Custom text for the value, e.g. "3 of 5 files" instead of "60%". */
  valueText?: string
  size?: ProgressSize
  color?: ProgressColor
}

const heights: Record<ProgressSize, string> = { sm: '4px', md: '8px', lg: '12px' }

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: ${({ theme }) => theme.fontFamily};
`

const Header = styled.div<{ $hidden: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.default};

  ${({ $hidden }) => $hidden && visuallyHidden}
`

const Label = styled.span`
  font-weight: 600;
`

const Value = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text.muted};
`

const Track = styled.div<{ $size: ProgressSize }>`
  position: relative;
  height: ${({ $size }) => heights[$size]};
  overflow: hidden;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.secondary.subtle};
`

const slide = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
`

// The fill uses the status `text` shade so it keeps 3:1 contrast with the track in both modes.
const Fill = styled.div<{ $color: ProgressColor; $indeterminate: boolean }>`
  height: 100%;
  border-radius: inherit;
  background-color: ${({ theme, $color }) => theme.colors[$color].text};
  transition: width 200ms ease;

  ${({ $indeterminate }) =>
    $indeterminate &&
    css`
      width: 40%;
      animation: ${slide} 1.4s ease-in-out infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${({ $indeterminate }) =>
      $indeterminate &&
      css`
        animation-duration: 3s;
      `}
  }
`

/**
 * Shows how far along a task is. With a value it's a determinate bar; without one it animates
 * to say "working on it" when the total is unknown.
 */
export function Progress({
  label,
  hideLabel = false,
  value,
  max = 100,
  showValue = false,
  valueText,
  size = 'md',
  color = 'primary',
  ...rest
}: ProgressProps) {
  const labelId = useId()
  const indeterminate = value === undefined
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max)
  const percent = Math.round((clamped / max) * 100)
  const text = valueText ?? `${percent}%`

  return (
    <Root {...rest}>
      <Header $hidden={hideLabel}>
        <Label id={labelId}>{label}</Label>
        {showValue && !indeterminate && <Value aria-hidden="true">{text}</Value>}
      </Header>
      <Track
        $size={size}
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={indeterminate ? undefined : text}
      >
        {/* Width is inline: it changes often, and a styled prop would create a class per value */}
        <Fill
          $color={color}
          $indeterminate={indeterminate}
          style={indeterminate ? undefined : { width: `${(clamped / max) * 100}%` }}
        />
      </Track>
    </Root>
  )
}

import type { HTMLAttributes } from 'react'
import styled, { keyframes } from 'styled-components'
import type { ColorName } from '../../theme/theme'
import { visuallyHidden } from '../shared/visually-hidden'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize
  /** Theme color, or 'current' to match the surrounding text (e.g. inside a button). */
  color?: ColorName | 'current'
  /** What's loading, read by screen readers. Be specific when it helps: "Loading invoices". */
  label?: string
}

const sizes: Record<SpinnerSize, string> = { sm: '16px', md: '24px', lg: '40px' }
const strokes: Record<SpinnerSize, string> = { sm: '2px', md: '3px', lg: '4px' }

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Root = styled.span`
  display: inline-flex;
  vertical-align: middle;
`

const Ring = styled.span<{ $size: SpinnerSize; $color: ColorName | 'current' }>`
  display: inline-block;
  width: ${({ $size }) => sizes[$size]};
  height: ${({ $size }) => sizes[$size]};
  border: ${({ $size }) => strokes[$size]} solid currentColor;
  /* A quarter of the ring is see-through, which is what makes the rotation visible */
  border-right-color: transparent;
  border-radius: 50%;
  color: ${({ theme, $color }) => ($color === 'current' ? 'currentColor' : theme.colors[$color].text)};
  animation: ${spin} 0.75s linear infinite;

  /* Still moves (so it reads as "busy"), just slowly, for people who prefer less motion */
  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.5s;
  }
`

const Label = styled.span`
  ${visuallyHidden}
`

/**
 * An indeterminate loading indicator. Announced to screen readers via role="status", so put it
 * where the content will appear, and remove it when loading finishes.
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Loading',
  ...rest
}: SpinnerProps) {
  return (
    <Root role="status" {...rest}>
      <Ring $size={size} $color={color} aria-hidden="true" />
      <Label>{label}</Label>
    </Root>
  )
}

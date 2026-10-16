import type { HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import type { ColorName } from '../../theme/theme'

export type BadgeVariant = 'subtle' | 'solid'
export type BadgeSize = 'sm' | 'md'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Meaning, e.g. success for "Paid", danger for "Overdue". secondary is neutral. */
  color?: ColorName
  /** subtle (tinted) for most uses; solid for the one status that must stand out. */
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: ReactNode
  children: ReactNode
}

const StyledBadge = styled.span<{ $color: ColorName; $variant: BadgeVariant; $size: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: ${({ $size }) => ($size === 'sm' ? '20px' : '24px')};
  padding: 0 ${({ $size }) => ($size === 'sm' ? '6px' : '8px')};
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ $size }) => ($size === 'sm' ? '0.75rem' : '0.8125rem')};
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;

  ${({ theme, $color, $variant }) => {
    const c = theme.colors[$color]
    return $variant === 'solid'
      ? css`
          background-color: ${c.main};
          color: ${c.contrastText};
        `
      : css`
          border-color: ${c.text};
          background-color: ${c.subtle};
          color: ${c.text};
        `
  }}

  svg {
    width: 1em;
    height: 1em;
  }
`

/**
 * A small, non-interactive label for status or category. Text carries the meaning, so it's
 * readable without color.
 */
export function Badge({
  color = 'secondary',
  variant = 'subtle',
  size = 'md',
  icon,
  children,
  ...rest
}: BadgeProps) {
  return (
    <StyledBadge $color={color} $variant={variant} $size={size} {...rest}>
      {icon}
      {children}
    </StyledBadge>
  )
}

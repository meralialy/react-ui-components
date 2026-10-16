import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import styled, { css, keyframes } from 'styled-components'
import type { ColorName } from '../../theme/theme'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  color?: ColorName
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

type StyledProps = {
  $color: ColorName
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
}

// Heights follow a 32/40/48 scale; 40px+ keeps the default size comfortable as a touch target.
const sizeStyles = {
  sm: css`
    min-height: 32px;
    padding: 0 12px;
    font-size: 0.875rem;
    gap: 6px;
    border-radius: ${({ theme }) => theme.radius.sm};
  `,
  md: css`
    min-height: 40px;
    padding: 0 16px;
    font-size: 1rem;
    gap: 8px;
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  lg: css`
    min-height: 48px;
    padding: 0 24px;
    font-size: 1.125rem;
    gap: 10px;
    border-radius: ${({ theme }) => theme.radius.lg};
  `,
}

const variantStyles = {
  solid: css<StyledProps>`
    ${({ theme, $color }) => {
      const c = theme.colors[$color]
      return css`
        background-color: ${c.main};
        border-color: ${c.main};
        color: ${c.contrastText};

        &:hover:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.hover};
          border-color: ${c.hover};
        }

        &:active:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.active};
          border-color: ${c.active};
        }
      `
    }}
  `,
  outline: css<StyledProps>`
    ${({ theme, $color }) => {
      const c = theme.colors[$color]
      return css`
        background-color: transparent;
        border-color: ${c.text};
        color: ${c.text};

        &:hover:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.subtle};
        }

        &:active:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.subtleActive};
        }
      `
    }}
  `,
  ghost: css<StyledProps>`
    ${({ theme, $color }) => {
      const c = theme.colors[$color]
      return css`
        background-color: transparent;
        border-color: transparent;
        color: ${c.text};

        &:hover:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.subtle};
        }

        &:active:not(:disabled):not([aria-disabled='true']) {
          background-color: ${c.subtleActive};
        }
      `
    }}
  `,
}

const StyledButton = styled.button<StyledProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.fontFamily};
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  /* Only show the ring for keyboard focus, not mouse clicks */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[aria-busy='true'] {
    cursor: progress;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.span`
  position: absolute;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2s;
  }
`

// Faded out rather than removed while loading, so the button keeps its width. Opacity (not
// visibility: hidden) keeps the label in the accessibility tree, so screen readers still hear
// the button's name ("Save, busy") instead of an unnamed button (WCAG 4.1.2).
const Content = styled.span<{ $hidden: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: inherit;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
`

export function Button({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  startIcon,
  endIcon,
  type = 'button',
  children,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $color={color}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      // While loading, stay focusable (aria-disabled, not disabled): a natively disabled button
      // drops keyboard focus to the top of the page, so users would lose their place (WCAG 2.4.3)
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(e) => {
        // Ignore clicks while loading, including form submission (Enter in a field clicks the
        // submit button)
        if (loading) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      <Content $hidden={loading}>
        {startIcon}
        {children}
        {endIcon}
      </Content>
    </StyledButton>
  )
}

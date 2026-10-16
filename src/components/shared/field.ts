import styled, { css } from 'styled-components'
import { visuallyHidden } from './visually-hidden'

// Shared look for boxed form fields (Input, Select): label above, bordered box, message below.

export type FieldSize = 'sm' | 'md' | 'lg'

// Heights match Button (32/40/48) so fields and buttons line up in a row.
export const fieldSizes = {
  sm: { height: '32px', paddingX: '10px', font: '0.875rem', gap: '6px', radius: 'sm' },
  md: { height: '40px', paddingX: '12px', font: '1rem', gap: '8px', radius: 'md' },
  lg: { height: '48px', paddingX: '16px', font: '1.125rem', gap: '10px', radius: 'lg' },
} as const

export const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  /* Lets the field shrink inside a flex row (e.g. next to a button) instead of overflowing on
     narrow screens; without it the browser's default input width sets a minimum (WCAG 1.4.10) */
  min-width: 0;
  font-family: ${({ theme }) => theme.fontFamily};
`

export const FieldLabel = styled.label<{ $hidden: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};

  ${({ $hidden }) => $hidden && visuallyHidden}
`

export type FieldBoxProps = {
  $size: FieldSize
  $invalid: boolean
  $disabled: boolean
}

/** The bordered box. Focus shows via :focus-within so the control inside can be anything. */
export const fieldBox = css<FieldBoxProps>`
  min-height: ${({ $size }) => fieldSizes[$size].height};
  border: 1px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.danger.text : theme.field.border)};
  border-radius: ${({ theme, $size }) => theme.radius[fieldSizes[$size].radius]};
  background-color: ${({ theme }) => theme.field.background};
  color: ${({ theme }) => theme.text.default};
  font-size: ${({ $size }) => fieldSizes[$size].font};
  transition: border-color 120ms ease;

  &:hover {
    border-color: ${({ theme, $invalid }) =>
      $invalid ? theme.colors.danger.text : theme.field.borderHover};
  }

  /* Fields show focus for mouse and keyboard alike, since both lead to entering a value */
  &:focus-within {
    outline: 2px solid
      ${({ theme, $invalid }) => ($invalid ? theme.colors.danger.text : theme.focusRing)};
    outline-offset: 1px;
  }

  ${({ $disabled, theme }) =>
    $disabled &&
    css`
      background-color: ${theme.field.disabledBackground};
      opacity: 0.6;
      cursor: not-allowed;

      &:hover {
        border-color: ${theme.field.border};
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

import styled, { css } from 'styled-components'
import type { DefaultTheme } from 'styled-components'
import { visuallyHidden } from './visually-hidden'

// Shared building blocks for selection controls (Checkbox, Radio): a native input made
// invisible over a custom-drawn indicator, next to a clickable label.

export type ChoiceSize = 'sm' | 'md' | 'lg'

// Indicator sizes scale with the label text so the two stay balanced.
const choiceSizes = {
  sm: { box: '16px', font: '0.875rem', gap: '8px' },
  md: { box: '20px', font: '1rem', gap: '10px' },
  lg: { box: '24px', font: '1.125rem', gap: '12px' },
}

/** Indent that lines helper text up with the label text rather than the indicator. */
export const choiceTextIndent = (size: ChoiceSize) =>
  `calc(${choiceSizes[size].box} + ${choiceSizes[size].gap})`

export const ChoiceRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: ${({ theme }) => theme.fontFamily};
`

export const ChoiceLabel = styled.label<{ $size: ChoiceSize; $disabled: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ $size }) => choiceSizes[$size].gap};
  /* 24px minimum keeps the whole row an adequate pointer target (WCAG 2.5.8) */
  min-height: 24px;
  font-size: ${({ $size }) => choiceSizes[$size].font};
  line-height: 1.5;
  color: ${({ theme }) => theme.text.default};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

export const ChoiceControl = styled.span<{ $size: ChoiceSize }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${({ $size }) => choiceSizes[$size].box};
  height: ${({ $size }) => choiceSizes[$size].box};
  /* Centers the indicator on the first line of the label, even when the label wraps */
  margin-top: calc((1.5em - ${({ $size }) => choiceSizes[$size].box}) / 2);
`

// The native input stays in place (just invisible) so keyboard, form and screen reader
// behavior all come for free.
export const ChoiceInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
`

/** Base look of the indicator. Must be rendered directly after `ChoiceInput`. */
export const choiceIndicator = css<{ $invalid: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1.5px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.danger.text : theme.field.border)};
  background-color: ${({ theme }) => theme.field.background};
  color: ${({ theme }) => theme.colors.primary.contrastText};
  pointer-events: none;
  transition:
    background-color 120ms ease,
    border-color 120ms ease;

  ${ChoiceInput}:not(:disabled):hover + & {
    border-color: ${({ theme, $invalid }) =>
      $invalid ? theme.colors.danger.text : theme.field.borderHover};
  }

  ${ChoiceInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/** Selected-state fill. The fill alone can fall under 3:1 against dark surfaces, so the
 *  border uses the `text` shade to keep the indicator's edge visible in both modes. */
export const choiceSelected = (theme: DefaultTheme, invalid: boolean) => {
  const color = invalid ? theme.colors.danger : theme.colors.primary
  return css`
    border-color: ${color.text};
    background-color: ${color.main};
  `
}

export const ChoiceText = styled.span<{ $hidden: boolean }>`
  ${({ $hidden }) => $hidden && visuallyHidden}
`

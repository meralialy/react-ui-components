import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import { ChoiceInput, ChoiceRoot, ChoiceText } from '../shared/choice'
import type { ChoiceSize } from '../shared/choice'
import { FieldMessage } from '../shared/field-message'

export type ToggleSize = ChoiceSize

export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  /** Names the setting, e.g. "Email notifications". Required; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  helperText?: ReactNode
  size?: ToggleSize
  /** `start` puts the label first with the switch at the far edge, as in settings lists. */
  labelPlacement?: 'start' | 'end'
  ref?: Ref<HTMLInputElement>
}

const sizes = {
  sm: { width: 28, height: 16, font: '0.875rem', gap: '8px' },
  md: { width: 36, height: 20, font: '1rem', gap: '10px' },
  lg: { width: 44, height: 24, font: '1.125rem', gap: '12px' },
}

const THUMB_INSET = 2

const Label = styled.label<{
  $size: ToggleSize
  $disabled: boolean
  $placement: 'start' | 'end'
}>`
  display: flex;
  flex-direction: ${({ $placement }) => ($placement === 'start' ? 'row-reverse' : 'row')};
  justify-content: ${({ $placement }) => ($placement === 'start' ? 'space-between' : 'flex-start')};
  align-items: flex-start;
  gap: ${({ $size }) => sizes[$size].gap};
  /* 24px minimum keeps the whole row an adequate pointer target (WCAG 2.5.8) */
  min-height: 24px;
  font-size: ${({ $size }) => sizes[$size].font};
  line-height: 1.5;
  color: ${({ theme }) => theme.text.default};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

const Control = styled.span<{ $size: ToggleSize }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${({ $size }) => sizes[$size].width}px;
  height: ${({ $size }) => sizes[$size].height}px;
  /* Centers the switch on the first line of the label, even when the label wraps */
  margin-top: calc((1.5em - ${({ $size }) => sizes[$size].height}px) / 2);
`

const Track = styled.span<{ $size: ToggleSize }>`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1.5px solid ${({ theme }) => theme.field.border};
  border-radius: 999px;
  /* Off: a solid mid-grey track meets 3:1 against the page and against the white thumb */
  background-color: ${({ theme }) => theme.field.border};
  pointer-events: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  /* Hover changes only the edge; lightening the fill would wash out the white thumb in dark mode */
  ${ChoiceInput}:not(:disabled):hover + & {
    border-color: ${({ theme }) => theme.field.borderHover};
  }

  ${ChoiceInput}:checked + & {
    /* Same pairing as a checked checkbox: the text shade keeps the edge visible in dark mode */
    border-color: ${({ theme }) => theme.colors.primary.text};
    background-color: ${({ theme }) => theme.colors.primary.main};
  }

  ${ChoiceInput}:checked:not(:disabled):hover + & {
    background-color: ${({ theme }) => theme.colors.primary.hover};
  }

  ${ChoiceInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

// A sibling of the track (not inside its border) so the inset is exact on every side.
const Thumb = styled.span<{ $size: ToggleSize }>`
  position: absolute;
  top: ${THUMB_INSET}px;
  left: ${THUMB_INSET}px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizes[$size].height - THUMB_INSET * 2}px;
  height: ${({ $size }) => sizes[$size].height - THUMB_INSET * 2}px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.contrastText};
  color: ${({ theme }) => theme.colors.primary.main};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.3);
  transition: transform 150ms ease;

  svg {
    width: 70%;
    height: 70%;
    opacity: 0;
    transition: opacity 150ms ease;
  }

  /* Slide the full track width minus the thumb and both insets */
  pointer-events: none;

  ${ChoiceInput}:checked ~ & {
    transform: translateX(${({ $size }) => sizes[$size].width - sizes[$size].height}px);
  }

  /* A check mark on "on", so state isn't conveyed by color and position alone */
  ${ChoiceInput}:checked ~ & svg {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    svg {
      transition: none;
    }
  }
`

export function Toggle({
  label,
  hideLabel = false,
  helperText,
  size = 'md',
  labelPlacement = 'end',
  id,
  disabled,
  className,
  style,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: ToggleProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const describedBy = [ariaDescribedBy, helperText ? messageId : undefined]
    .filter(Boolean)
    .join(' ')

  // With the label first, helper text lines up under the label; otherwise under the label text
  // to the right of the switch.
  const indent =
    labelPlacement === 'end' ? `calc(${sizes[size].width}px + ${sizes[size].gap})` : undefined

  return (
    <ChoiceRoot className={className} style={style}>
      <Label $size={size} $disabled={Boolean(disabled)} $placement={labelPlacement}>
        <Control $size={size}>
          <ChoiceInput
            type="checkbox"
            role="switch"
            id={inputId}
            disabled={disabled}
            aria-describedby={describedBy || undefined}
            {...rest}
          />
          <Track $size={size} />
          <Thumb $size={size}>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8.5 6.5 11.5 12.5 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Thumb>
        </Control>
        <ChoiceText $hidden={hideLabel}>{label}</ChoiceText>
      </Label>
      {helperText && (
        <FieldMessage id={messageId} invalid={false} indent={indent}>
          {helperText}
        </FieldMessage>
      )}
    </ChoiceRoot>
  )
}

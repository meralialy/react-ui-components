import type { FieldsetHTMLAttributes, ReactNode } from 'react'
import { useId, useState } from 'react'
import styled, { css } from 'styled-components'
import { ChoiceInput } from '../shared/choice'
import { visuallyHidden } from '../shared/visually-hidden'

export type SegmentedControlSize = 'sm' | 'md' | 'lg'

export type SegmentedControlOption = {
  value: string
  /** Always required: shown as text, or read by screen readers when `iconOnly`. */
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export type SegmentedControlProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange' | 'defaultValue'
> & {
  /** Names the choice, e.g. "View". Required; use `hideLabel` when context makes it obvious. */
  label: ReactNode
  hideLabel?: boolean
  options: SegmentedControlOption[]
  /** Selected value (controlled). Pair with onChange. */
  value?: string
  /** Initially selected value (uncontrolled). Defaults to the first option. */
  defaultValue?: string
  onChange?: (value: string) => void
  /** Shared by the underlying radios. Generated if omitted; set it for form submission. */
  name?: string
  size?: SegmentedControlSize
  /** Stretch to the container, with equal-width segments. */
  fullWidth?: boolean
  /** Show only icons; labels stay available to screen readers and as tooltips. */
  iconOnly?: boolean
  disabled?: boolean
}

// Outer heights match Button (32/40/48), so it lines up with buttons and fields.
const sizes = {
  sm: { height: 32, font: '0.875rem', paddingX: '10px', radius: 'sm' },
  md: { height: 40, font: '0.9375rem', paddingX: '14px', radius: 'md' },
  lg: { height: 48, font: '1rem', paddingX: '18px', radius: 'lg' },
} as const

const TRACK_PADDING = 2
const TRACK_BORDER = 1

const Fieldset = styled.fieldset<{ $fullWidth: boolean }>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  flex-direction: column;
  /* Claim the container's width even inside centering flex parents */
  ${({ $fullWidth }) => $fullWidth && 'width: 100%; align-self: stretch;'}
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  font-family: ${({ theme }) => theme.fontFamily};
`

const Legend = styled.legend<{ $hidden: boolean }>`
  padding: 0;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};

  ${({ $hidden }) => $hidden && visuallyHidden}
`

// Full width uses equal grid columns that never shrink below their label, so segments match
// in width without truncating the longest one.
const Track = styled.div<{ $size: SegmentedControlSize; $fullWidth: boolean }>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'grid' : 'inline-flex')};
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 2px;
  height: ${({ $size }) => sizes[$size].height}px;
  padding: ${TRACK_PADDING}px;
  border: ${TRACK_BORDER}px solid ${({ theme }) => theme.field.border};
  border-radius: ${({ theme, $size }) => theme.radius[sizes[$size].radius]};
  background-color: ${({ theme }) => theme.field.background};
`

const Segment = styled.label<{ $disabled: boolean }>`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`

const SegmentFace = styled.span<{ $size: SegmentedControlSize; $iconOnly: boolean }>`
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 0 ${({ $size, $iconOnly }) => ($iconOnly ? '0' : sizes[$size].paddingX)};
  ${({ $size, $iconOnly }) =>
    $iconOnly &&
    css`
      /* Square segments for icons */
      width: ${sizes[$size].height - (TRACK_PADDING + TRACK_BORDER) * 2}px;
    `}
  border-radius: ${({ theme, $size }) =>
    `calc(${theme.radius[sizes[$size].radius]} - ${TRACK_PADDING}px)`};
  color: ${({ theme }) => theme.text.default};
  font-size: ${({ $size }) => sizes[$size].font};
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
  transition:
    background-color 120ms ease,
    color 120ms ease;

  svg {
    flex-shrink: 0;
  }

  ${ChoiceInput}:not(:checked):not(:disabled):hover + & {
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  /* Selected: a filled segment that clearly stands apart from the track (3:1+) */
  ${ChoiceInput}:checked + & {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }

  ${ChoiceInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 1px;
  }

  ${ChoiceInput}:disabled + & {
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Text = styled.span<{ $hidden: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $hidden }) => $hidden && visuallyHidden}
`

/**
 * Pick one of a few options, shown side by side. Built on native radios, so screen readers
 * announce a radio group and arrow keys move the selection.
 */
export function SegmentedControl({
  label,
  hideLabel = false,
  options,
  value,
  defaultValue,
  onChange,
  name,
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  ...rest
}: SegmentedControlProps) {
  const generatedName = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options.find((o) => !o.disabled)?.value,
  )
  const selected = value !== undefined ? value : uncontrolledValue

  function select(next: string) {
    if (value === undefined) setUncontrolledValue(next)
    onChange?.(next)
  }

  return (
    <Fieldset $fullWidth={fullWidth} disabled={disabled} {...rest}>
      <Legend $hidden={hideLabel}>{label}</Legend>
      <Track $size={size} $fullWidth={fullWidth}>
        {options.map((option) => {
          const optionDisabled = disabled || Boolean(option.disabled)
          return (
            <Segment
              key={option.value}
              $disabled={optionDisabled}
              title={iconOnly ? option.label : undefined}
            >
              <ChoiceInput
                type="radio"
                name={name ?? generatedName}
                value={option.value}
                checked={selected === option.value}
                disabled={optionDisabled}
                onChange={() => select(option.value)}
              />
              <SegmentFace $size={size} $iconOnly={iconOnly}>
                {option.icon}
                <Text $hidden={iconOnly}>{option.label}</Text>
              </SegmentFace>
            </Segment>
          )
        })}
      </Track>
    </Fieldset>
  )
}

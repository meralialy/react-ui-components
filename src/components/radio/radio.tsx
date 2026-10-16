import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import {
  ChoiceControl,
  ChoiceInput,
  ChoiceLabel,
  ChoiceRoot,
  ChoiceText,
  choiceIndicator,
  choiceSelected,
  choiceTextIndent,
} from '../shared/choice'
import type { ChoiceSize } from '../shared/choice'
import { FieldMessage } from '../shared/field-message'
import { useRadioGroup } from './radio-group-context'

export type RadioSize = ChoiceSize

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> & {
  /** Submitted with the form and passed to RadioGroup's onChange when selected. */
  value: string
  /** Always required for accessibility; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  /** Describes this option, e.g. delivery time or price. */
  helperText?: ReactNode
  /** Ignored inside a RadioGroup, which sets the size for all options. */
  size?: RadioSize
  ref?: Ref<HTMLInputElement>
}

const Circle = styled.span<{ $invalid: boolean }>`
  ${choiceIndicator}
  border-radius: 50%;

  &::after {
    content: '';
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background-color: currentColor;
    transform: scale(0);
    transition: transform 120ms ease;
  }

  ${ChoiceInput}:checked + & {
    ${({ theme, $invalid }) => choiceSelected(theme, $invalid)}
  }

  ${ChoiceInput}:checked + &::after {
    transform: scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`

/**
 * One option in a RadioGroup. Inside a group, name, checked state, size and disabled/required
 * come from the group; on its own it behaves like a native radio.
 */
export function Radio({
  value,
  label,
  hideLabel = false,
  helperText,
  size: ownSize = 'md',
  id,
  disabled: ownDisabled,
  className,
  style,
  ref,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: RadioProps) {
  const group = useRadioGroup()
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  const size = group?.size ?? ownSize
  const disabled = Boolean(group?.disabled || ownDisabled)
  const invalid = Boolean(group?.invalid)
  const describedBy = [ariaDescribedBy, helperText ? messageId : undefined]
    .filter(Boolean)
    .join(' ')

  const groupProps = group && {
    name: group.name,
    checked: group.value === value,
    required: group.required,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      group.onSelect(value)
    },
  }

  return (
    <ChoiceRoot className={className} style={style}>
      <ChoiceLabel $size={size} $disabled={disabled}>
        <ChoiceControl $size={size}>
          <ChoiceInput
            ref={ref}
            type="radio"
            id={inputId}
            value={value}
            disabled={disabled}
            onChange={onChange}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy || undefined}
            {...rest}
            {...groupProps}
          />
          <Circle $invalid={invalid} />
        </ChoiceControl>
        <ChoiceText $hidden={hideLabel}>{label}</ChoiceText>
      </ChoiceLabel>
      {helperText && (
        <FieldMessage id={messageId} invalid={false} indent={choiceTextIndent(size)}>
          {helperText}
        </FieldMessage>
      )}
    </ChoiceRoot>
  )
}

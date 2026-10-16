import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useEffect, useId, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { mergeRefs } from '../../utils/merge-refs'
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
import { RequiredMark } from '../shared/required-mark'
import { useCheckboxGroup } from './checkbox-group-context'

export type CheckboxSize = ChoiceSize

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  /** Always required for accessibility; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  helperText?: ReactNode
  /** Puts the checkbox in an error state and replaces the helper text with this message. */
  error?: ReactNode
  /** Shows a dash for "some but not all" (e.g. a select-all checkbox). Visual only; `checked` is unchanged. */
  indeterminate?: boolean
  /** Ignored inside a CheckboxGroup, which sets the size for all options. */
  size?: CheckboxSize
  ref?: Ref<HTMLInputElement>
}

const Box = styled.span<{ $invalid: boolean }>`
  ${choiceIndicator}
  border-radius: ${({ theme }) => theme.radius.sm};

  svg {
    width: 75%;
    height: 75%;
    display: none;
  }

  ${ChoiceInput}:checked + &,
  ${ChoiceInput}:indeterminate + & {
    ${({ theme, $invalid }) => choiceSelected(theme, $invalid)}
  }

  ${ChoiceInput}:checked:not(:indeterminate) + & [data-icon='check'],
  ${ChoiceInput}:indeterminate + & [data-icon='dash'] {
    display: block;
  }
`

function CheckIcon() {
  return (
    <svg data-icon="check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg data-icon="dash" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 8h8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

export function Checkbox({
  label,
  hideLabel = false,
  helperText,
  error,
  indeterminate = false,
  size: ownSize = 'md',
  id,
  required,
  disabled: ownDisabled,
  className,
  style,
  ref,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: CheckboxProps) {
  const group = useCheckboxGroup()
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  // `indeterminate` only exists as a DOM property, not an HTML attribute, so set it directly.
  const innerRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMemo(() => mergeRefs(innerRef, ref), [ref])
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const size = group?.size ?? ownSize
  const disabled = Boolean(group?.disabled || ownDisabled)
  // A group error marks every option invalid, but only the option's own error replaces its helper text.
  const invalid = Boolean(error || group?.invalid)
  const message = error || helperText
  const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

  // When the group manages selection, it decides `checked` from this checkbox's value.
  const value = rest.value === undefined ? undefined : String(rest.value)
  const groupProps = group?.values &&
    value !== undefined && {
      name: group.name,
      checked: group.values.includes(value),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        group.onToggle(value, e.target.checked)
      },
    }

  return (
    <ChoiceRoot className={className} style={style}>
      <ChoiceLabel $size={size} $disabled={disabled}>
        <ChoiceControl $size={size}>
          <ChoiceInput
            ref={mergedRef}
            type="checkbox"
            id={inputId}
            required={required}
            name={group?.name}
            disabled={disabled}
            onChange={onChange}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy || undefined}
            {...rest}
            {...groupProps}
          />
          <Box $invalid={invalid}>
            <CheckIcon />
            <DashIcon />
          </Box>
        </ChoiceControl>
        <ChoiceText $hidden={hideLabel}>
          {label}
          {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
        </ChoiceText>
      </ChoiceLabel>
      {message && (
        <FieldMessage id={messageId} invalid={Boolean(error)} indent={choiceTextIndent(size)}>
          {message}
        </FieldMessage>
      )}
    </ChoiceRoot>
  )
}

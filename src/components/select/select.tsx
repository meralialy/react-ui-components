import type { ReactNode, Ref, SelectHTMLAttributes } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import { FieldLabel, FieldRoot, fieldBox, fieldSizes } from '../shared/field'
import type { FieldBoxProps, FieldSize } from '../shared/field'
import { FieldMessage } from '../shared/field-message'
import { RequiredMark } from '../shared/required-mark'

export type SelectSize = FieldSize

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'> & {
  /** Always required for accessibility; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  helperText?: ReactNode
  /** Puts the field in an error state and replaces the helper text with this message. */
  error?: ReactNode
  /** The choices. For option groups, pass <option>/<optgroup> children instead. */
  options?: SelectOption[]
  /** Shown while nothing is selected (value ""), e.g. "Select a country". */
  placeholder?: string
  size?: SelectSize
  ref?: Ref<HTMLSelectElement>
}

// Wraps the native <select> so the chevron can sit inside the bordered box.
const Control = styled.div<FieldBoxProps>`
  ${fieldBox}
  position: relative;
  display: flex;
  align-items: stretch;
`

const NativeSelect = styled.select<{ $size: FieldSize }>`
  flex: 1;
  min-width: 0;
  margin: 0;
  /* Room on the right for the chevron */
  padding: 0 calc(${({ $size }) => fieldSizes[$size].paddingX} + 24px) 0
    ${({ $size }) => fieldSizes[$size].paddingX};
  border: none;
  border-radius: inherit;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  appearance: none;
  cursor: inherit;
  text-overflow: ellipsis;

  /* Dim the placeholder like Input's, while real options in the open list keep normal text */
  &:has(option[data-placeholder]:checked) {
    color: ${({ theme }) => theme.field.placeholder};
  }

  option {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.field.background};
  }
`

const Chevron = styled.svg<{ $size: FieldSize }>`
  position: absolute;
  top: 50%;
  right: ${({ $size }) => fieldSizes[$size].paddingX};
  width: 1em;
  height: 1em;
  color: ${({ theme }) => theme.text.muted};
  transform: translateY(-50%);
  pointer-events: none;
`

export function Select({
  label,
  hideLabel = false,
  helperText,
  error,
  options,
  placeholder,
  size = 'md',
  id,
  required,
  disabled,
  className,
  style,
  children,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const messageId = `${selectId}-message`

  // Start on the placeholder when no value is given; otherwise a required select (whose
  // placeholder is disabled) would silently preselect the first real option.
  const defaultValue =
    rest.defaultValue ?? (rest.value === undefined && placeholder !== undefined ? '' : undefined)

  const invalid = Boolean(error)
  const message = invalid ? error : helperText
  const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

  return (
    <FieldRoot className={className} style={style}>
      <FieldLabel htmlFor={selectId} $hidden={hideLabel}>
        {label}
        {/* Screen readers announce "required" from the native attribute, so the mark is visual only */}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </FieldLabel>
      <Control $size={size} $invalid={invalid} $disabled={Boolean(disabled)}>
        <NativeSelect
          id={selectId}
          $size={size}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
          defaultValue={defaultValue}
        >
          {placeholder !== undefined && (
            // Required fields can't go back to "nothing"; optional ones can, to clear a choice.
            <option value="" disabled={required} data-placeholder>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </NativeSelect>
        <Chevron $size={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Chevron>
      </Control>
      {message && (
        <FieldMessage id={messageId} invalid={invalid}>
          {message}
        </FieldMessage>
      )}
    </FieldRoot>
  )
}

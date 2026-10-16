import type { InputHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import { FieldLabel, FieldRoot, fieldBox, fieldSizes } from '../shared/field'
import type { FieldBoxProps, FieldSize } from '../shared/field'
import { FieldMessage } from '../shared/field-message'
import { RequiredMark } from '../shared/required-mark'

export type InputSize = FieldSize

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Always required for accessibility; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  helperText?: ReactNode
  /** Puts the field in an error state and replaces the helper text with this message. */
  error?: ReactNode
  size?: InputSize
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  ref?: Ref<HTMLInputElement>
}

// The border lives on this wrapper (not the <input>) so adornments sit inside the field.
const Control = styled.div<FieldBoxProps>`
  ${fieldBox}
  display: flex;
  align-items: center;
  gap: ${({ $size }) => fieldSizes[$size].gap};
  padding: 0 ${({ $size }) => fieldSizes[$size].paddingX};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'text')};
`

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.field.placeholder};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const Adornment = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.text.muted};
`

// Clicking the field's padding or a non-interactive adornment focuses the input, as users expect
// from something that looks like one box.
function focusInput(event: MouseEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement
  if (target.closest('input, button, a, select, textarea')) return
  event.preventDefault()
  event.currentTarget.querySelector('input')?.focus()
}

export function Input({
  label,
  hideLabel = false,
  helperText,
  error,
  size = 'md',
  startAdornment,
  endAdornment,
  id,
  required,
  disabled,
  className,
  style,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  const invalid = Boolean(error)
  const message = invalid ? error : helperText
  const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

  return (
    <FieldRoot className={className} style={style}>
      <FieldLabel htmlFor={inputId} $hidden={hideLabel}>
        {label}
        {/* Screen readers announce "required" from the native attribute, so the mark is visual only */}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </FieldLabel>
      <Control
        $size={size}
        $invalid={invalid}
        $disabled={Boolean(disabled)}
        onMouseDown={focusInput}
      >
        {startAdornment && <Adornment>{startAdornment}</Adornment>}
        <StyledInput
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
        {endAdornment && <Adornment>{endAdornment}</Adornment>}
      </Control>
      {message && (
        <FieldMessage id={messageId} invalid={invalid}>
          {message}
        </FieldMessage>
      )}
    </FieldRoot>
  )
}

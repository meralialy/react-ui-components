import type { ChangeEvent, ReactNode } from 'react'
import { useId } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox } from '../components/checkbox'

// Minimal, docs-only form controls for component playgrounds.

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.muted};
`

const controlStyles = css`
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.background.page};
  color: ${({ theme }) => theme.text.default};
  font: inherit;
  font-size: 0.875rem;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 1px;
  }
`

const StyledSelect = styled.select`
  ${controlStyles}
`

const StyledInput = styled.input`
  ${controlStyles}
`

export type SelectFieldProps<T extends string> = {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  const id = useId()
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledSelect
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StyledSelect>
    </Field>
  )
}

export type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export function TextField({ label, value, onChange }: TextFieldProps) {
  const id = useId()
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledInput id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export type CheckboxFieldProps = {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <Checkbox
      size="sm"
      label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}

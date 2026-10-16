import styled from 'styled-components'
import type { ColorMode } from '../../theme/use-color-mode'

export type ColorModeToggleProps = {
  value: ColorMode
  onChange: (mode: ColorMode) => void
}

const options: { value: ColorMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

// Native radios give arrow-key navigation and screen reader semantics for free.
const Fieldset = styled.fieldset`
  display: inline-flex;
  gap: 2px;
  margin: 0;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
`

const Legend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`

const Input = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.muted};
  cursor: pointer;

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }

  ${Input}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }
`

export function ColorModeToggle({ value, onChange }: ColorModeToggleProps) {
  return (
    <Fieldset>
      <Legend>Color mode</Legend>
      {options.map((option) => (
        <label key={option.value}>
          <Input
            type="radio"
            name="color-mode"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <Label>{option.label}</Label>
        </label>
      ))}
    </Fieldset>
  )
}

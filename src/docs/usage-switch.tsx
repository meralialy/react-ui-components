import styled from 'styled-components'
import { Radio, RadioGroup } from '../components/radio'

type UsageOption<T extends string> = { value: T; label: string }

export type UsageSwitchProps<T extends string> = {
  value: T
  options: UsageOption<T>[]
  onChange: (value: T) => void
}

const Bar = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

/** Top bar of a playground for switching between ways of using a component. */
export function UsageSwitch<T extends string>({ value, options, onChange }: UsageSwitchProps<T>) {
  return (
    <Bar>
      <RadioGroup
        label="Usage"
        orientation="horizontal"
        size="sm"
        value={value}
        onChange={(next) => onChange(next as T)}
      >
        {options.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
    </Bar>
  )
}

import { createContext, useContext } from 'react'
import type { ChoiceSize } from '../shared/choice'

export type RadioGroupContextValue = {
  name: string
  value: string | undefined
  onSelect: (value: string) => void
  size: ChoiceSize
  disabled: boolean
  required: boolean
  invalid: boolean
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export const useRadioGroup = () => useContext(RadioGroupContext)

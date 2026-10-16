import { createContext, useContext } from 'react'
import type { ChoiceSize } from '../shared/choice'

export type CheckboxGroupContextValue = {
  name: string | undefined
  /** Checked values, or undefined when the group isn't managing selection. */
  values: string[] | undefined
  onToggle: (value: string, checked: boolean) => void
  size: ChoiceSize
  disabled: boolean
  invalid: boolean
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

export const useCheckboxGroup = () => useContext(CheckboxGroupContext)

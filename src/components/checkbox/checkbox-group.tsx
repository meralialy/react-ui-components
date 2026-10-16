import { useMemo, useState } from 'react'
import type { ChoiceSize } from '../shared/choice'
import { FieldGroup } from '../shared/field-group'
import type { FieldGroupProps } from '../shared/field-group'
import { CheckboxGroupContext } from './checkbox-group-context'

export type CheckboxGroupProps = Omit<
  FieldGroupProps,
  'announceRequired' | 'onChange' | 'defaultValue'
> & {
  /** Shared by every checkbox in the group, for native form submission. */
  name?: string
  /** Checked values (controlled). Pair with onChange. Each Checkbox needs a `value`. */
  value?: string[]
  /** Initially checked values (uncontrolled). */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  size?: ChoiceSize
}

export function CheckboxGroup({
  name,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  error,
  ...rest
}: CheckboxGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? [])
  const isControlled = value !== undefined
  // Without value, defaultValue or onChange, each Checkbox manages its own checked state.
  const manages = isControlled || defaultValue !== undefined || onChange !== undefined
  const values = !manages ? undefined : isControlled ? value : uncontrolledValue

  const context = useMemo(
    () => ({
      name,
      values,
      onToggle: (item: string, checked: boolean) => {
        const current = values ?? []
        // Keep the order options were checked in; callers can sort if they need to.
        const next = checked ? [...current, item] : current.filter((v) => v !== item)
        if (!isControlled) setUncontrolledValue(next)
        onChange?.(next)
      },
      size,
      disabled,
      invalid: Boolean(error),
    }),
    [name, values, isControlled, onChange, size, disabled, error],
  )

  return (
    <CheckboxGroupContext value={context}>
      {/* Native `required` on each checkbox would demand all be ticked, so the legend says it in words */}
      <FieldGroup announceRequired disabled={disabled} error={error} {...rest} />
    </CheckboxGroupContext>
  )
}

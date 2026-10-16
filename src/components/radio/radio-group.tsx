import { useId, useMemo, useState } from 'react'
import { FieldGroup } from '../shared/field-group'
import type { FieldGroupProps } from '../shared/field-group'
import type { ChoiceSize } from '../shared/choice'
import { RadioGroupContext } from './radio-group-context'

export type RadioGroupProps = Omit<
  FieldGroupProps,
  'announceRequired' | 'onChange' | 'defaultValue'
> & {
  /** Shared by every radio in the group. Generated if omitted; set it for form submission. */
  name?: string
  /** Selected value (controlled). Pair with onChange. */
  value?: string
  /** Initially selected value (uncontrolled). */
  defaultValue?: string
  onChange?: (value: string) => void
  size?: ChoiceSize
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  required = false,
  error,
  ...rest
}: RadioGroupProps) {
  const generatedName = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const selected = isControlled ? value : uncontrolledValue

  const context = useMemo(
    () => ({
      name: name ?? generatedName,
      value: selected,
      onSelect: (next: string) => {
        if (!isControlled) setUncontrolledValue(next)
        onChange?.(next)
      },
      size,
      disabled,
      required,
      invalid: Boolean(error),
    }),
    [name, generatedName, selected, isControlled, onChange, size, disabled, required, error],
  )

  return (
    <RadioGroupContext value={context}>
      {/* Native `required` on radios means "pick one", which screen readers announce per option */}
      <FieldGroup disabled={disabled} required={required} error={error} {...rest} />
    </RadioGroupContext>
  )
}

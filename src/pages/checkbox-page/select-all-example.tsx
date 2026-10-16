import { useState } from 'react'
import styled from 'styled-components'
import { Checkbox } from '../../components/checkbox'

const toppings = ['Mushrooms', 'Peppers', 'Olives', 'Onions']

const Children = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-left: 30px;
`

/** A parent checkbox that reflects its children: checked, unchecked, or indeterminate. */
export function SelectAllExample() {
  const [selected, setSelected] = useState<string[]>(['Peppers'])

  const allSelected = selected.length === toppings.length
  const someSelected = selected.length > 0 && !allSelected

  const toggle = (item: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, item] : prev.filter((t) => t !== item)))

  return (
    <div>
      <Checkbox
        label="All toppings"
        checked={allSelected}
        indeterminate={someSelected}
        // From indeterminate, a click selects all: the common, forgiving choice
        onChange={() => setSelected(allSelected ? [] : toppings)}
        aria-controls="topping-list"
      />
      <Children id="topping-list">
        {toppings.map((topping) => (
          <Checkbox
            key={topping}
            label={topping}
            checked={selected.includes(topping)}
            onChange={(e) => toggle(topping, e.target.checked)}
          />
        ))}
      </Children>
    </div>
  )
}

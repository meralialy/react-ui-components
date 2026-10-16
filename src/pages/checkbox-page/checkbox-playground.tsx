import type { ReactNode } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Checkbox, CheckboxGroup } from '../../components/checkbox'
import type { CheckboxSize } from '../../components/checkbox'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { jsxElement, jsxString } from '../../docs/jsx'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
  StageNote,
} from '../../docs/playground'
import { UsageSwitch } from '../../docs/usage-switch'

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly CheckboxSize[]
const orientations = ['vertical', 'horizontal'] as const

type Usage = 'group' | 'single'

const PreviewWidth = styled.div`
  width: 100%;
  max-width: 360px;
`

const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <PlaygroundFooter>
    <Button size="sm" variant="ghost" color="secondary" onClick={onClick}>
      Reset
    </Button>
  </PlaygroundFooter>
)

// ---------------------------------------------------------------------------------------------
// CheckboxGroup: several options, the group owns the array of checked values

const toppings = [
  { value: 'mushrooms', label: 'Mushrooms', helperText: 'Chestnut mushrooms' },
  { value: 'peppers', label: 'Peppers', helperText: 'Roasted red peppers' },
  { value: 'olives', label: 'Olives', helperText: 'Kalamata, pitted' },
]

type GroupState = {
  label: string
  helperText: string
  error: string
  size: CheckboxSize
  orientation: (typeof orientations)[number]
  required: boolean
  disabled: boolean
  optionHelperText: boolean
  disableOne: boolean
}

const groupDefaults: GroupState = {
  label: 'Toppings',
  helperText: 'Select all that apply.',
  error: '',
  size: 'md',
  orientation: 'vertical',
  required: false,
  disabled: false,
  optionHelperText: false,
  disableOne: false,
}

function buildGroupCode(state: GroupState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.orientation !== 'vertical') props.push(`orientation="${state.orientation}"`)
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  props.push('name="toppings"', 'value={selected}', 'onChange={setSelected}')

  const options = toppings.map((t) => {
    const optionProps = [`value="${t.value}"`, jsxString('label', t.label)]
    if (state.optionHelperText) optionProps.push(jsxString('helperText', t.helperText))
    if (state.disableOne && t.value === 'olives') optionProps.push('disabled')
    return jsxElement('Checkbox', optionProps)
  })

  return [
    "import { useState } from 'react'",
    "import { Checkbox, CheckboxGroup } from './components/checkbox'",
    '',
    "const [selected, setSelected] = useState<string[]>(['peppers'])",
    '',
    jsxElement('CheckboxGroup', props, options),
  ].join('\n')
}

function GroupPlayground({ modeBar }: { modeBar: ReactNode }) {
  const [state, setState] = useState(groupDefaults)
  const [selected, setSelected] = useState<string[]>(['peppers'])

  const set =
    <K extends keyof GroupState>(key: K) =>
    (next: GroupState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        {modeBar}
        <Stage>
          <CheckboxGroup
            label={state.label}
            helperText={state.helperText || undefined}
            error={state.error || undefined}
            size={state.size}
            orientation={state.orientation}
            required={state.required}
            disabled={state.disabled}
            name="playground-toppings"
            value={selected}
            onChange={setSelected}
          >
            {toppings.map((t) => (
              <Checkbox
                key={t.value}
                value={t.value}
                label={t.label}
                helperText={state.optionHelperText ? t.helperText : undefined}
                disabled={state.disableOne && t.value === 'olives'}
              />
            ))}
          </CheckboxGroup>
          <StageNote aria-live="polite">value: {JSON.stringify(selected)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <TextField label="error" value={state.error} onChange={set('error')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <SelectField
            label="orientation"
            value={state.orientation}
            options={orientations}
            onChange={set('orientation')}
          />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="required" checked={state.required} onChange={set('required')} />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField
              label="Checkbox helperText"
              checked={state.optionHelperText}
              onChange={set('optionHelperText')}
            />
            <CheckboxField
              label="Disable one option"
              checked={state.disableOne}
              onChange={set('disableOne')}
            />
          </Options>
        </Controls>

        <ResetButton
          onClick={() => {
            setState(groupDefaults)
            setSelected(['peppers'])
          }}
        />
      </PlaygroundCard>

      <CodeWrapper>
        <CodeBlock code={buildGroupCode(state)} label="Generated code" />
      </CodeWrapper>
    </>
  )
}

// ---------------------------------------------------------------------------------------------
// Single Checkbox: one on/off choice, you own the boolean

type SingleState = {
  label: string
  helperText: string
  error: string
  size: CheckboxSize
  indeterminate: boolean
  required: boolean
  disabled: boolean
  hideLabel: boolean
}

const singleDefaults: SingleState = {
  label: 'Email me about product updates',
  helperText: 'About once a month. Unsubscribe anytime.',
  error: '',
  size: 'md',
  indeterminate: false,
  required: false,
  disabled: false,
  hideLabel: false,
}

function buildSingleCode(state: SingleState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.indeterminate) props.push('indeterminate')
  if (state.hideLabel) props.push('hideLabel')
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  props.push('checked={checked}', 'onChange={(e) => setChecked(e.target.checked)}')

  return [
    "import { useState } from 'react'",
    "import { Checkbox } from './components/checkbox'",
    '',
    'const [checked, setChecked] = useState(false)',
    '',
    jsxElement('Checkbox', props),
  ].join('\n')
}

function SinglePlayground({ modeBar }: { modeBar: ReactNode }) {
  const [state, setState] = useState(singleDefaults)
  const [checked, setChecked] = useState(false)

  const set =
    <K extends keyof SingleState>(key: K) =>
    (next: SingleState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        {modeBar}
        <Stage>
          <PreviewWidth>
            <Checkbox
              label={state.label}
              helperText={state.helperText || undefined}
              error={state.error || undefined}
              size={state.size}
              indeterminate={state.indeterminate}
              hideLabel={state.hideLabel}
              required={state.required}
              disabled={state.disabled}
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </PreviewWidth>
          <StageNote aria-live="polite">checked: {String(checked)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <TextField label="error" value={state.error} onChange={set('error')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField
              label="indeterminate"
              checked={state.indeterminate}
              onChange={set('indeterminate')}
            />
            <CheckboxField label="required" checked={state.required} onChange={set('required')} />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField
              label="hideLabel"
              checked={state.hideLabel}
              onChange={set('hideLabel')}
            />
          </Options>
        </Controls>

        <ResetButton
          onClick={() => {
            setState(singleDefaults)
            setChecked(false)
          }}
        />
      </PlaygroundCard>

      <CodeWrapper>
        <CodeBlock code={buildSingleCode(state)} label="Generated code" />
      </CodeWrapper>
    </>
  )
}

export function CheckboxPlayground() {
  const [usage, setUsage] = useState<Usage>('group')

  const modeBar = (
    <UsageSwitch
      value={usage}
      onChange={setUsage}
      options={[
        { value: 'group', label: 'CheckboxGroup: pick any number from a list' },
        { value: 'single', label: 'Checkbox: a single yes/no' },
      ]}
    />
  )

  return usage === 'group' ? (
    <GroupPlayground modeBar={modeBar} />
  ) : (
    <SinglePlayground modeBar={modeBar} />
  )
}

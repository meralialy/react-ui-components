import { useState } from 'react'
import { Button } from '../../components/button'
import { Radio, RadioGroup } from '../../components/radio'
import type { RadioSize } from '../../components/radio'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly RadioSize[]
const orientations = ['vertical', 'horizontal'] as const

const plans = [
  { value: 'monthly', label: 'Monthly', helperText: '$12 per month' },
  { value: 'yearly', label: 'Yearly', helperText: '$120 per year, 2 months free' },
  { value: 'lifetime', label: 'Lifetime', helperText: '$299 once' },
]

type PlaygroundState = {
  label: string
  helperText: string
  error: string
  size: RadioSize
  orientation: (typeof orientations)[number]
  required: boolean
  disabled: boolean
  optionHelperText: boolean
  disableLifetime: boolean
}

const defaults: PlaygroundState = {
  label: 'Billing period',
  helperText: 'You can change this later.',
  error: '',
  size: 'md',
  orientation: 'vertical',
  required: false,
  disabled: false,
  optionHelperText: true,
  disableLifetime: false,
}

// Only props that differ from the defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.orientation !== 'vertical') props.push(`orientation="${state.orientation}"`)
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  props.push('name="plan"', 'value={plan}', 'onChange={setPlan}')

  const options = plans.map((plan) => {
    const optionProps = [`value="${plan.value}"`, jsxString('label', plan.label)]
    if (state.optionHelperText) optionProps.push(jsxString('helperText', plan.helperText))
    if (state.disableLifetime && plan.value === 'lifetime') optionProps.push('disabled')
    return jsxElement('Radio', optionProps)
  })

  return [
    "import { useState } from 'react'",
    "import { Radio, RadioGroup } from './components/radio'",
    '',
    "const [plan, setPlan] = useState('monthly')",
    '',
    jsxElement('RadioGroup', props, options),
  ].join('\n')
}

export function RadioPlayground() {
  const [state, setState] = useState(defaults)
  const [plan, setPlan] = useState('monthly')

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <RadioGroup
            label={state.label}
            helperText={state.helperText || undefined}
            error={state.error || undefined}
            size={state.size}
            orientation={state.orientation}
            required={state.required}
            disabled={state.disabled}
            name="playground-plan"
            value={plan}
            onChange={setPlan}
          >
            {plans.map((p) => (
              <Radio
                key={p.value}
                value={p.value}
                label={p.label}
                helperText={state.optionHelperText ? p.helperText : undefined}
                disabled={state.disableLifetime && p.value === 'lifetime'}
              />
            ))}
          </RadioGroup>
          <StageNote aria-live="polite">value: {JSON.stringify(plan)}</StageNote>
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
              label="Radio helperText"
              checked={state.optionHelperText}
              onChange={set('optionHelperText')}
            />
            <CheckboxField
              label="Disable one option"
              checked={state.disableLifetime}
              onChange={set('disableLifetime')}
            />
          </Options>
        </Controls>

        <PlaygroundFooter>
          <Button
            size="sm"
            variant="ghost"
            color="secondary"
            onClick={() => {
              setState(defaults)
              setPlan('monthly')
            }}
          >
            Reset
          </Button>
        </PlaygroundFooter>
      </PlaygroundCard>

      <CodeWrapper>
        <CodeBlock code={buildCode(state)} label="Generated code" />
      </CodeWrapper>
    </>
  )
}

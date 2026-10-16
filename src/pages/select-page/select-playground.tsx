import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Select } from '../../components/select'
import type { SelectSize } from '../../components/select'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly SelectSize[]

const countries = [
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'ie', label: 'Ireland' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
]

type PlaygroundState = {
  label: string
  helperText: string
  error: string
  placeholder: string
  size: SelectSize
  required: boolean
  disabled: boolean
  hideLabel: boolean
  disableOption: boolean
}

const defaults: PlaygroundState = {
  label: 'Country',
  helperText: 'We currently ship to these countries.',
  error: '',
  placeholder: 'Select a country',
  size: 'md',
  required: false,
  disabled: false,
  hideLabel: false,
  disableOption: false,
}

// Only props that differ from the Select's defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.placeholder) props.push(jsxString('placeholder', state.placeholder))
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.hideLabel) props.push('hideLabel')
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  props.push(
    'options={countries}',
    'value={country}',
    'onChange={(e) => setCountry(e.target.value)}',
  )

  const optionLines = countries.map((c) => {
    const disabled = state.disableOption && c.value === 'nz' ? ', disabled: true' : ''
    return `  { value: '${c.value}', label: '${c.label}'${disabled} },`
  })

  return [
    "import { useState } from 'react'",
    "import { Select } from './components/select'",
    '',
    'const countries = [',
    ...optionLines,
    ']',
    '',
    "const [country, setCountry] = useState('')",
    '',
    jsxElement('Select', props),
  ].join('\n')
}

const PreviewWidth = styled.div`
  width: 100%;
  max-width: 360px;
`

export function SelectPlayground() {
  const [state, setState] = useState(defaults)
  const [country, setCountry] = useState('')

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const options = countries.map((c) => ({
    ...c,
    disabled: state.disableOption && c.value === 'nz',
  }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewWidth>
            <Select
              label={state.label}
              placeholder={state.placeholder || undefined}
              helperText={state.helperText || undefined}
              error={state.error || undefined}
              size={state.size}
              hideLabel={state.hideLabel}
              required={state.required}
              disabled={state.disabled}
              options={options}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </PreviewWidth>
          <StageNote aria-live="polite">value: {JSON.stringify(country)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="placeholder" value={state.placeholder} onChange={set('placeholder')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <TextField label="error" value={state.error} onChange={set('error')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="required" checked={state.required} onChange={set('required')} />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField
              label="hideLabel"
              checked={state.hideLabel}
              onChange={set('hideLabel')}
            />
            <CheckboxField
              label="Disable one option"
              checked={state.disableOption}
              onChange={set('disableOption')}
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
              setCountry('')
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

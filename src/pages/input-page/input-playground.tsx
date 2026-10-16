import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import type { InputSize } from '../../components/input'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { MailIcon } from '../../components/icon'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly InputSize[]
const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const

type PlaygroundState = {
  label: string
  helperText: string
  error: string
  placeholder: string
  type: (typeof types)[number]
  size: InputSize
  required: boolean
  disabled: boolean
  readOnly: boolean
  hideLabel: boolean
  startAdornment: boolean
  endAdornment: boolean
}

const defaults: PlaygroundState = {
  label: 'Email',
  helperText: "We'll only use this to send receipts.",
  error: '',
  placeholder: 'you@example.com',
  type: 'email',
  size: 'md',
  required: false,
  disabled: false,
  readOnly: false,
  hideLabel: false,
  startAdornment: false,
  endAdornment: false,
}

// Only props that differ from the Input's defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.type !== 'text') props.push(`type="${state.type}"`)
  if (state.placeholder) props.push(jsxString('placeholder', state.placeholder))
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.startAdornment) props.push('startAdornment={<MailIcon />}')
  if (state.endAdornment) props.push('endAdornment="@company.com"')
  if (state.hideLabel) props.push('hideLabel')
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  if (state.readOnly) props.push('readOnly')
  props.push('value={value}', 'onChange={(e) => setValue(e.target.value)}')

  return [
    "import { useState } from 'react'",
    "import { Input } from './components/input'",
    ...(state.startAdornment ? ["import { MailIcon } from './components/icon'"] : []),
    '',
    "const [value, setValue] = useState('')",
    '',
    jsxElement('Input', props),
  ].join('\n')
}

const PreviewWidth = styled.div`
  width: 100%;
  max-width: 360px;
`

export function InputPlayground() {
  const [state, setState] = useState(defaults)
  const [value, setValue] = useState('')

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewWidth>
            <Input
              label={state.label}
              type={state.type}
              placeholder={state.placeholder || undefined}
              helperText={state.helperText || undefined}
              error={state.error || undefined}
              size={state.size}
              startAdornment={state.startAdornment ? <MailIcon /> : undefined}
              endAdornment={state.endAdornment ? '@company.com' : undefined}
              hideLabel={state.hideLabel}
              required={state.required}
              disabled={state.disabled}
              readOnly={state.readOnly}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </PreviewWidth>
          <StageNote aria-live="polite">value: {JSON.stringify(value)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <TextField label="error" value={state.error} onChange={set('error')} />
          <TextField label="placeholder" value={state.placeholder} onChange={set('placeholder')} />
          <SelectField label="type" value={state.type} options={types} onChange={set('type')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="required" checked={state.required} onChange={set('required')} />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField label="readOnly" checked={state.readOnly} onChange={set('readOnly')} />
            <CheckboxField
              label="hideLabel"
              checked={state.hideLabel}
              onChange={set('hideLabel')}
            />
            <CheckboxField
              label="startAdornment"
              checked={state.startAdornment}
              onChange={set('startAdornment')}
            />
            <CheckboxField
              label="endAdornment"
              checked={state.endAdornment}
              onChange={set('endAdornment')}
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
              setValue('')
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

import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Textarea } from '../../components/textarea'
import type { TextareaSize } from '../../components/textarea'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly TextareaSize[]
const rowOptions = ['2', '3', '4', '6'] as const
const limitOptions = ['none', '100', '280', '500'] as const

type PlaygroundState = {
  label: string
  helperText: string
  error: string
  placeholder: string
  size: TextareaSize
  rows: (typeof rowOptions)[number]
  characterLimit: (typeof limitOptions)[number]
  autoResize: boolean
  required: boolean
  disabled: boolean
  readOnly: boolean
  hideLabel: boolean
}

const defaults: PlaygroundState = {
  label: 'Message',
  helperText: 'Tell us what happened and what you expected.',
  error: '',
  placeholder: '',
  size: 'md',
  rows: '3',
  characterLimit: '280',
  autoResize: false,
  required: false,
  disabled: false,
  readOnly: false,
  hideLabel: false,
}

// Only props that differ from the Textarea's defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.placeholder) props.push(jsxString('placeholder', state.placeholder))
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.error) props.push(jsxString('error', state.error))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.rows !== '3') props.push(`rows={${state.rows}}`)
  if (state.characterLimit !== 'none') props.push(`characterLimit={${state.characterLimit}}`)
  if (state.autoResize) props.push('autoResize', 'maxRows={10}')
  if (state.hideLabel) props.push('hideLabel')
  if (state.required) props.push('required')
  if (state.disabled) props.push('disabled')
  if (state.readOnly) props.push('readOnly')
  props.push('value={message}', 'onChange={(e) => setMessage(e.target.value)}')

  return [
    "import { useState } from 'react'",
    "import { Textarea } from './components/textarea'",
    '',
    "const [message, setMessage] = useState('')",
    '',
    jsxElement('Textarea', props),
  ].join('\n')
}

const PreviewWidth = styled.div`
  width: 100%;
  max-width: 480px;
`

export function TextareaPlayground() {
  const [state, setState] = useState(defaults)
  const [message, setMessage] = useState('')

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewWidth>
            <Textarea
              label={state.label}
              placeholder={state.placeholder || undefined}
              helperText={state.helperText || undefined}
              error={state.error || undefined}
              size={state.size}
              rows={Number(state.rows)}
              characterLimit={
                state.characterLimit === 'none' ? undefined : Number(state.characterLimit)
              }
              autoResize={state.autoResize}
              maxRows={10}
              hideLabel={state.hideLabel}
              required={state.required}
              disabled={state.disabled}
              readOnly={state.readOnly}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </PreviewWidth>
          <StageNote>length: {message.length}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <TextField label="error" value={state.error} onChange={set('error')} />
          <TextField label="placeholder" value={state.placeholder} onChange={set('placeholder')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <SelectField
            label="rows"
            value={state.rows}
            options={rowOptions}
            onChange={set('rows')}
          />
          <SelectField
            label="characterLimit"
            value={state.characterLimit}
            options={limitOptions}
            onChange={set('characterLimit')}
          />
          <Options>
            <legend>Options</legend>
            <CheckboxField
              label="autoResize"
              checked={state.autoResize}
              onChange={set('autoResize')}
            />
            <CheckboxField label="required" checked={state.required} onChange={set('required')} />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField label="readOnly" checked={state.readOnly} onChange={set('readOnly')} />
            <CheckboxField
              label="hideLabel"
              checked={state.hideLabel}
              onChange={set('hideLabel')}
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
              setMessage('')
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

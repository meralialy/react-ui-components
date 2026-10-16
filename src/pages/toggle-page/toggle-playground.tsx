import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Toggle } from '../../components/toggle'
import type { ToggleSize } from '../../components/toggle'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly ToggleSize[]
const placements = ['end', 'start'] as const

type PlaygroundState = {
  label: string
  helperText: string
  size: ToggleSize
  labelPlacement: (typeof placements)[number]
  disabled: boolean
  hideLabel: boolean
}

const defaults: PlaygroundState = {
  label: 'Email notifications',
  helperText: 'Get an email when someone mentions you.',
  size: 'md',
  labelPlacement: 'end',
  disabled: false,
  hideLabel: false,
}

// Only props that differ from the Toggle's defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.helperText) props.push(jsxString('helperText', state.helperText))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.labelPlacement !== 'end') props.push(`labelPlacement="${state.labelPlacement}"`)
  if (state.hideLabel) props.push('hideLabel')
  if (state.disabled) props.push('disabled')
  props.push('checked={enabled}', 'onChange={(e) => setEnabled(e.target.checked)}')

  return [
    "import { useState } from 'react'",
    "import { Toggle } from './components/toggle'",
    '',
    'const [enabled, setEnabled] = useState(true)',
    '',
    jsxElement('Toggle', props),
  ].join('\n')
}

const PreviewWidth = styled.div`
  width: 100%;
  max-width: 400px;
`

export function TogglePlayground() {
  const [state, setState] = useState(defaults)
  const [enabled, setEnabled] = useState(true)

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewWidth>
            <Toggle
              label={state.label}
              helperText={state.helperText || undefined}
              size={state.size}
              labelPlacement={state.labelPlacement}
              hideLabel={state.hideLabel}
              disabled={state.disabled}
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </PreviewWidth>
          <StageNote aria-live="polite">checked: {String(enabled)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <TextField label="helperText" value={state.helperText} onChange={set('helperText')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <SelectField
            label="labelPlacement"
            value={state.labelPlacement}
            options={placements}
            onChange={set('labelPlacement')}
          />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
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
              setEnabled(true)
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

import { useState } from 'react'
import { Button } from '../../components/button'
import type { ButtonSize, ButtonVariant } from '../../components/button'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
  StageNote,
} from '../../docs/playground'
import { colorNames } from '../../theme/theme'
import type { ColorName } from '../../theme/theme'
import { PlusIcon } from '../../components/icon'

const variants = ['solid', 'outline', 'ghost'] as const satisfies readonly ButtonVariant[]
const sizes = ['sm', 'md', 'lg'] as const satisfies readonly ButtonSize[]

type PlaygroundState = {
  label: string
  color: ColorName
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  loading: boolean
  fullWidth: boolean
  startIcon: boolean
  endIcon: boolean
}

// Mirrors the Button's own defaults, so the generated code only lists props that differ.
const defaults: PlaygroundState = {
  label: 'Save changes',
  color: 'primary',
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  startIcon: false,
  endIcon: false,
}

function buildCode(state: PlaygroundState) {
  const props: string[] = []
  if (state.color !== defaults.color) props.push(`color="${state.color}"`)
  if (state.variant !== defaults.variant) props.push(`variant="${state.variant}"`)
  if (state.size !== defaults.size) props.push(`size="${state.size}"`)
  if (state.startIcon) props.push('startIcon={<PlusIcon />}')
  if (state.endIcon) props.push('endIcon={<PlusIcon />}')
  if (state.fullWidth) props.push('fullWidth')
  if (state.disabled) props.push('disabled')
  if (state.loading) props.push('loading')
  props.push('onClick={handleClick}')

  return [
    "import { Button } from './components/button'",
    ...(state.startIcon || state.endIcon ? ["import { PlusIcon } from './components/icon'"] : []),
    '',
    'const handleClick = () => {',
    '  // your action',
    '}',
    '',
    jsxElement('Button', props, state.label),
  ].join('\n')
}

export function ButtonPlayground() {
  const [state, setState] = useState(defaults)
  const [clicks, setClicks] = useState(0)

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (value: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: value }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <Button
            color={state.color}
            variant={state.variant}
            size={state.size}
            disabled={state.disabled}
            loading={state.loading}
            fullWidth={state.fullWidth}
            startIcon={state.startIcon ? <PlusIcon /> : undefined}
            endIcon={state.endIcon ? <PlusIcon /> : undefined}
            onClick={() => setClicks((n) => n + 1)}
          >
            {state.label}
          </Button>
          <StageNote aria-live="polite">
            {clicks === 0 ? 'Click the button to fire onClick' : `onClick fired ${clicks}×`}
          </StageNote>
        </Stage>

        <Controls>
          <TextField label="children" value={state.label} onChange={set('label')} />
          <SelectField
            label="color"
            value={state.color}
            options={colorNames}
            onChange={set('color')}
          />
          <SelectField
            label="variant"
            value={state.variant}
            options={variants}
            onChange={set('variant')}
          />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField label="loading" checked={state.loading} onChange={set('loading')} />
            <CheckboxField
              label="fullWidth"
              checked={state.fullWidth}
              onChange={set('fullWidth')}
            />
            <CheckboxField
              label="startIcon"
              checked={state.startIcon}
              onChange={set('startIcon')}
            />
            <CheckboxField label="endIcon" checked={state.endIcon} onChange={set('endIcon')} />
          </Options>
        </Controls>

        <PlaygroundFooter>
          <Button
            size="sm"
            variant="ghost"
            color="secondary"
            onClick={() => {
              setState(defaults)
              setClicks(0)
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

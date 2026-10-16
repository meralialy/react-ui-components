import { useState } from 'react'
import { Button } from '../../components/button'
import type { ButtonSize, ButtonVariant } from '../../components/button'
import { SplitButton } from '../../components/split-button'
import type { SplitButtonAction } from '../../components/split-button'
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

const variants = ['solid', 'outline', 'ghost'] as const satisfies readonly ButtonVariant[]
const sizes = ['sm', 'md', 'lg'] as const satisfies readonly ButtonSize[]
const aligns = ['end', 'start'] as const

type PlaygroundState = {
  label: string
  color: ColorName
  variant: ButtonVariant
  size: ButtonSize
  align: (typeof aligns)[number]
  disabled: boolean
  loading: boolean
  dangerAction: boolean
  disableAction: boolean
}

const defaults: PlaygroundState = {
  label: 'Save',
  color: 'primary',
  variant: 'solid',
  size: 'md',
  align: 'end',
  disabled: false,
  loading: false,
  dangerAction: true,
  disableAction: false,
}

type ActionDoc = { label: string; handler: string; danger?: boolean; disabled?: boolean }

function actionDocs(state: PlaygroundState): ActionDoc[] {
  return [
    { label: 'Save as draft', handler: 'saveDraft' },
    { label: 'Save and close', handler: 'saveAndClose', disabled: state.disableAction },
    ...(state.dangerAction ? [{ label: 'Discard changes', handler: 'discard', danger: true }] : []),
  ]
}

// Only props that differ from the defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = []
  if (state.color !== 'primary') props.push(`color="${state.color}"`)
  if (state.variant !== 'solid') props.push(`variant="${state.variant}"`)
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.align !== 'end') props.push(`align="${state.align}"`)
  if (state.disabled) props.push('disabled')
  if (state.loading) props.push('loading')
  props.push('onClick={save}')

  const actionLines = actionDocs(state).map((a) => {
    const extra = [a.danger && 'danger: true', a.disabled && 'disabled: true'].filter(Boolean)
    const fields = [`label: '${a.label}'`, `onSelect: ${a.handler}`, ...extra].join(', ')
    return `    { ${fields} },`
  })
  props.push(['actions={[', ...actionLines, '  ]}'].join('\n'))

  const handlers = ['save', ...actionDocs(state).map((a) => a.handler)]
  return [
    "import { SplitButton } from './components/split-button'",
    '',
    ...handlers.map((name) => `const ${name} = () => {} // your action`),
    '',
    jsxElement('SplitButton', props, state.label),
  ].join('\n')
}

export function SplitButtonPlayground() {
  const [state, setState] = useState(defaults)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const actions: SplitButtonAction[] = actionDocs(state).map((a) => ({
    label: a.label,
    danger: a.danger,
    disabled: a.disabled,
    onSelect: () => setLastAction(a.label),
  }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <SplitButton
            color={state.color}
            variant={state.variant}
            size={state.size}
            align={state.align}
            disabled={state.disabled}
            loading={state.loading}
            actions={actions}
            onClick={() => setLastAction(state.label)}
          >
            {state.label}
          </SplitButton>
          <StageNote aria-live="polite">
            {lastAction ? `Last action: ${lastAction}` : 'Click the button or open the menu'}
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
          <SelectField label="align" value={state.align} options={aligns} onChange={set('align')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField label="loading" checked={state.loading} onChange={set('loading')} />
            <CheckboxField
              label="Destructive action"
              checked={state.dangerAction}
              onChange={set('dangerAction')}
            />
            <CheckboxField
              label="Disable an action"
              checked={state.disableAction}
              onChange={set('disableAction')}
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
              setLastAction(null)
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

import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { SegmentedControl } from '../../components/segmented-control'
import type { SegmentedControlSize } from '../../components/segmented-control'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { jsxElement, jsxString, placeholderIcon } from '../../docs/jsx'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
  StageNote,
} from '../../docs/playground'
import { BoardIcon, GridIcon, ListIcon } from './icons'

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly SegmentedControlSize[]

const views = [
  // iconName is spelled out because function names are minified in production builds
  { value: 'list', label: 'List', Icon: ListIcon, iconName: 'ListIcon' },
  { value: 'grid', label: 'Grid', Icon: GridIcon, iconName: 'GridIcon' },
  { value: 'board', label: 'Board', Icon: BoardIcon, iconName: 'BoardIcon' },
]

type PlaygroundState = {
  label: string
  size: SegmentedControlSize
  hideLabel: boolean
  fullWidth: boolean
  disabled: boolean
  icons: boolean
  iconOnly: boolean
  disableOne: boolean
}

const defaults: PlaygroundState = {
  label: 'View',
  size: 'md',
  hideLabel: false,
  fullWidth: false,
  disabled: false,
  icons: false,
  iconOnly: false,
  disableOne: false,
}

// Only props that differ from the defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const showIcons = state.icons || state.iconOnly
  const optionLines = views.map((v) => {
    const fields = [`value: '${v.value}'`, `label: '${v.label}'`]
    if (showIcons) fields.push(`icon: <${v.iconName} />`)
    if (state.disableOne && v.value === 'board') fields.push('disabled: true')
    return `  { ${fields.join(', ')} },`
  })

  const props: string[] = [jsxString('label', state.label)]
  if (state.hideLabel) props.push('hideLabel')
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.fullWidth) props.push('fullWidth')
  if (state.iconOnly) props.push('iconOnly')
  if (state.disabled) props.push('disabled')
  props.push('options={views}', 'value={view}', 'onChange={setView}')

  return [
    "import { useState } from 'react'",
    "import { SegmentedControl } from './components/segmented-control'",
    '',
    ...(showIcons ? [...views.map((v) => placeholderIcon(v.iconName)), ''] : []),
    'const views = [',
    ...optionLines,
    ']',
    '',
    "const [view, setView] = useState('list')",
    '',
    jsxElement('SegmentedControl', props),
  ].join('\n')
}

// A realistic container, so fullWidth stretches to something like a panel, not the whole stage.
const PreviewWidth = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 480px;
`

export function SegmentedControlPlayground() {
  const [state, setState] = useState(defaults)
  const [view, setView] = useState('list')

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const showIcons = state.icons || state.iconOnly
  const options = views.map(({ value, label, Icon }) => ({
    value,
    label,
    icon: showIcons ? <Icon /> : undefined,
    disabled: state.disableOne && value === 'board',
  }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewWidth>
            <SegmentedControl
              label={state.label}
              hideLabel={state.hideLabel}
              size={state.size}
              fullWidth={state.fullWidth}
              iconOnly={state.iconOnly}
              disabled={state.disabled}
              options={options}
              value={view}
              onChange={setView}
            />
          </PreviewWidth>
          <StageNote aria-live="polite">value: {JSON.stringify(view)}</StageNote>
        </Stage>

        <Controls>
          <TextField label="label" value={state.label} onChange={set('label')} />
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField
              label="hideLabel"
              checked={state.hideLabel}
              onChange={set('hideLabel')}
            />
            <CheckboxField
              label="fullWidth"
              checked={state.fullWidth}
              onChange={set('fullWidth')}
            />
            <CheckboxField label="disabled" checked={state.disabled} onChange={set('disabled')} />
            <CheckboxField label="Icons" checked={state.icons} onChange={set('icons')} />
            <CheckboxField label="iconOnly" checked={state.iconOnly} onChange={set('iconOnly')} />
            <CheckboxField
              label="Disable one option"
              checked={state.disableOne}
              onChange={set('disableOne')}
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
              setView('list')
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

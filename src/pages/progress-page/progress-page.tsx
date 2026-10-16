import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Progress } from '../../components/progress'
import type { ProgressColor, ProgressSize } from '../../components/progress'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { jsxElement, jsxString } from '../../docs/jsx'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Section,
} from '../../docs/page-layout'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly ProgressSize[]
const colors = [
  'primary',
  'success',
  'warning',
  'danger',
] as const satisfies readonly ProgressColor[]
const values = ['0', '25', '60', '100', 'indeterminate'] as const

type State = {
  label: string
  value: (typeof values)[number]
  size: ProgressSize
  color: ProgressColor
  showValue: boolean
  hideLabel: boolean
}

const defaults: State = {
  label: 'Uploading report.pdf',
  value: '60',
  size: 'md',
  color: 'primary',
  showValue: true,
  hideLabel: false,
}

function buildCode(state: State) {
  const props: string[] = [jsxString('label', state.label)]
  if (state.value !== 'indeterminate') props.push(`value={${state.value}}`)
  if (state.showValue) props.push('showValue')
  if (state.hideLabel) props.push('hideLabel')
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.color !== 'primary') props.push(`color="${state.color}"`)
  return [
    "import { Progress } from './components/progress'",
    '',
    jsxElement('Progress', props),
  ].join('\n')
}

const progressProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description:
      'What is progressing, e.g. "Uploading report.pdf". Names the bar for screen readers.',
  },
  {
    name: 'value',
    type: 'number',
    description: 'Current amount. Leave undefined when the total is unknown, for an animated bar.',
  },
  { name: 'max', type: 'number', default: '100', description: 'The amount that means done.' },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'false',
    description: 'Shows the percentage (or valueText) next to the label.',
  },
  {
    name: 'valueText',
    type: 'string',
    description: 'Custom value text, e.g. "3 of 5 files". Also what screen readers announce.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description: 'Hides the label visually but keeps it for screen readers.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Bar height: 4, 8 or 12px.',
  },
  {
    name: 'color',
    type: "'primary' | 'success' | 'warning' | 'danger'",
    default: "'primary'",
    description:
      'Use status colors only when they mean something, e.g. danger for a nearly full quota.',
  },
]

const Narrow = styled.div`
  width: 100%;
  max-width: 420px;
`

function UploadExample() {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    if (value === null || value >= 100) return
    const timeout = setTimeout(() => setValue((v) => Math.min((v ?? 0) + 7, 100)), 250)
    return () => clearTimeout(timeout)
  }, [value])

  const done = value !== null && value >= 100
  return (
    <Narrow>
      <Flex direction="column" gap={3}>
        <Progress
          label={done ? 'Upload complete' : 'Uploading report.pdf'}
          value={value ?? 0}
          showValue
          color={done ? 'success' : 'primary'}
        />
        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setValue(0)}
            disabled={value !== null && !done}
          >
            {done ? 'Upload again' : 'Start upload'}
          </Button>
        </div>
      </Flex>
    </Narrow>
  )
}

export function ProgressPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Progress</PageTitle>
      <PageIntro>
        Shows how far along a task is, like an upload or a multi-step import. Without a value it
        animates to say "working" when the total is unknown.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Narrow>
              <Progress
                label={state.label}
                value={state.value === 'indeterminate' ? undefined : Number(state.value)}
                showValue={state.showValue}
                hideLabel={state.hideLabel}
                size={state.size}
                color={state.color}
              />
            </Narrow>
          </Stage>
          <Controls>
            <TextField label="label" value={state.label} onChange={set('label')} />
            <SelectField
              label="value"
              value={state.value}
              options={values}
              onChange={set('value')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="color"
              value={state.color}
              options={colors}
              onChange={set('color')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField
                label="showValue"
                checked={state.showValue}
                onChange={set('showValue')}
              />
              <CheckboxField
                label="hideLabel"
                checked={state.hideLabel}
                onChange={set('hideLabel')}
              />
            </Options>
          </Controls>
          <PlaygroundFooter>
            <Button size="sm" variant="ghost" color="secondary" onClick={() => setState(defaults)}>
              Reset
            </Button>
          </PlaygroundFooter>
        </PlaygroundCard>
        <CodeWrapper>
          <CodeBlock code={buildCode(state)} label="Generated code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={progressProps} />
      </Section>

      <Section>
        <Heading>Live example</Heading>
        <Description>Fills as the "upload" runs, then turns success when complete.</Description>
        <Preview>
          <UploadExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Variations</Heading>
        <Preview>
          <Narrow>
            <Flex direction="column" gap={6}>
              <Progress label="Importing contacts" />
              <Progress
                label="Files processed"
                value={3}
                max={5}
                showValue
                valueText="3 of 5 files"
              />
              <Progress label="Storage used" value={92} showValue color="danger" />
              {sizes.map((size) => (
                <Progress key={size} label={`Size ${size}`} value={45} size={size} />
              ))}
            </Flex>
          </Narrow>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use Progress when you can measure the task. If you can't, use the animated version
            briefly, or a Spinner.
          </li>
          <li>
            Say what's progressing in the label, and confirm when it's done ("Upload complete").
          </li>
          <li>
            Prefer meaningful units in valueText ("3 of 5 files") over percentages when users think
            in those units.
          </li>
          <li>
            Don't let the bar go backwards or stall at 99%. If the end is uncertain, switch to the
            animated bar instead.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

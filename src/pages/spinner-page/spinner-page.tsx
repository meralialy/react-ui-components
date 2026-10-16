import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Spinner } from '../../components/spinner'
import type { SpinnerSize } from '../../components/spinner'
import { CodeBlock } from '../../docs/code-block'
import { SelectField, TextField } from '../../docs/form-controls'
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
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { colorNames } from '../../theme/theme'

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly SpinnerSize[]
const colors = [...colorNames, 'current'] as const

type State = { size: SpinnerSize; color: (typeof colors)[number]; label: string }
const defaults: State = { size: 'md', color: 'primary', label: 'Loading' }

function buildCode(state: State) {
  const props: string[] = []
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.color !== 'primary') props.push(`color="${state.color}"`)
  if (state.label !== 'Loading') props.push(jsxString('label', state.label))
  return ["import { Spinner } from './components/spinner'", '', jsxElement('Spinner', props)].join(
    '\n',
  )
}

const spinnerProps: PropDoc[] = [
  {
    name: 'label',
    type: 'string',
    default: "'Loading'",
    description: 'Read by screen readers. Be specific when it helps, e.g. "Loading invoices".',
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '16, 24 or 40px.' },
  {
    name: 'color',
    type: `${colorNames.map((c) => `'${c}'`).join(' | ')} | 'current'`,
    default: "'primary'",
    description: "'current' matches the surrounding text color, e.g. inside a button or link.",
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as className and style are passed through.',
  },
]

const LoadingPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
`

function LoadingExample() {
  const [loading, setLoading] = useState(false)
  return (
    <Flex direction="column" gap={3}>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 2000)
          }}
        >
          Reload invoices
        </Button>
      </div>
      {/* aria-busy tells assistive tech the region's content is being updated */}
      <LoadingPanel aria-busy={loading}>
        {loading ? <Spinner label="Loading invoices" /> : <span>12 invoices</span>}
      </LoadingPanel>
    </Flex>
  )
}

export function SpinnerPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Spinner</PageTitle>
      <PageIntro>
        Shows that something is loading when you can't say how long it will take. Announced to
        screen readers as a status.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Spinner size={state.size} color={state.color} label={state.label} />
          </Stage>
          <Controls>
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="color"
              value={state.color}
              options={colors}
              onChange={set('color')}
            />
            <TextField label="label" value={state.label} onChange={set('label')} />
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
        <PropsTable props={spinnerProps} />
      </Section>

      <Section>
        <Heading>Sizes &amp; colors</Heading>
        <Preview>
          <Flex gap={6} align="center" wrap>
            {sizes.map((size) => (
              <Spinner key={size} size={size} />
            ))}
            {colorNames.map((color) => (
              <Spinner key={color} color={color} />
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Loading a region</Heading>
        <Description>
          Put the spinner where the content will appear, and mark the region aria-busy while it
          loads.
        </Description>
        <Preview>
          <LoadingExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Wait about 300ms before showing a spinner. Fast loads then don't flash one, which feels
            slower than showing nothing.
          </li>
          <li>
            If you know how far along a task is, use Progress instead. A number is more reassuring
            than an endless spin.
          </li>
          <li>
            For loading whole pages or lists, a skeleton of the layout feels faster than a lone
            spinner.
          </li>
          <li>For buttons, use Button's loading prop rather than placing a spinner yourself.</li>
          <li>Show one spinner per region, not one per item.</li>
        </Guidelines>
      </Section>
    </>
  )
}

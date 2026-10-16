import { useState } from 'react'
import { Alert } from '../../components/alert'
import type { AlertStatus } from '../../components/alert'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
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

const statuses = ['info', 'success', 'warning', 'danger'] as const satisfies readonly AlertStatus[]

type State = {
  status: AlertStatus
  title: string
  description: string
  actions: boolean
  dismissible: boolean
  announce: boolean
}

const defaults: State = {
  status: 'warning',
  title: 'Your trial ends in 3 days',
  description: 'Add a payment method to keep access to your projects.',
  actions: true,
  dismissible: true,
  announce: false,
}

function buildCode(state: State) {
  const props: string[] = []
  if (state.status !== 'info') props.push(`status="${state.status}"`)
  if (state.title) props.push(jsxString('title', state.title))
  if (state.actions) props.push('actions={<Button size="sm">Add payment method</Button>}')
  if (state.dismissible) props.push('onDismiss={() => setVisible(false)}')
  if (state.announce) props.push('announce')

  const alert = jsxElement('Alert', props, state.description || undefined)
  const imports = ["import { Alert } from './components/alert'"]
  if (state.actions) imports.push("import { Button } from './components/button'")
  if (!state.dismissible) return [...imports, '', alert].join('\n')
  return [
    "import { useState } from 'react'",
    ...imports,
    '',
    'const [visible, setVisible] = useState(true)',
    '',
    `{visible && (`,
    alert
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n'),
    ')}',
  ].join('\n')
}

const alertProps: PropDoc[] = [
  {
    name: 'status',
    type: "'info' | 'success' | 'warning' | 'danger'",
    default: "'info'",
    description:
      'Sets color and icon. Each icon has a distinct shape, so status is clear without color.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description: 'Short summary in bold, e.g. "Payment failed".',
  },
  { name: 'children', type: 'ReactNode', description: 'Details, and what to do next.' },
  {
    name: 'actions',
    type: 'ReactNode',
    description: 'Buttons or links under the message, e.g. a "Try again" button.',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Shows a dismiss button. You decide what dismissing does, usually hiding it.',
  },
  {
    name: 'announce',
    type: 'boolean',
    default: 'false',
    description:
      'Set when the alert appears after a user action, so screen readers announce it. warning/danger interrupt; info/success wait. Leave off for alerts present on page load.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as className, id and style are passed through.',
  },
]

function AnnounceExample() {
  const [error, setError] = useState(false)
  return (
    <Flex direction="column" gap={3}>
      <div>
        <Button size="sm" variant="outline" onClick={() => setError(true)}>
          Submit payment
        </Button>
      </div>
      {error && (
        <Alert
          status="danger"
          title="Payment failed"
          announce
          onDismiss={() => setError(false)}
          actions={
            <Button size="sm" variant="outline" color="danger" onClick={() => setError(false)}>
              Try again
            </Button>
          }
        >
          Your card was declined. Check the card details or use a different card.
        </Alert>
      )}
    </Flex>
  )
}

export function AlertPage() {
  const [state, setState] = useState(defaults)
  const [visible, setVisible] = useState(true)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Alert</PageTitle>
      <PageIntro>
        An inline message about the page or something that just happened, styled by how much it
        matters.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            {visible ? (
              <Alert
                status={state.status}
                title={state.title || undefined}
                announce={state.announce}
                actions={state.actions ? <Button size="sm">Add payment method</Button> : undefined}
                onDismiss={state.dismissible ? () => setVisible(false) : undefined}
              >
                {state.description || undefined}
              </Alert>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setVisible(true)}>
                Show alert again
              </Button>
            )}
          </Stage>
          <Controls>
            <SelectField
              label="status"
              value={state.status}
              options={statuses}
              onChange={set('status')}
            />
            <TextField label="title" value={state.title} onChange={set('title')} />
            <TextField label="children" value={state.description} onChange={set('description')} />
            <Options>
              <legend>Options</legend>
              <CheckboxField label="actions" checked={state.actions} onChange={set('actions')} />
              <CheckboxField
                label="onDismiss (dismissible)"
                checked={state.dismissible}
                onChange={set('dismissible')}
              />
              <CheckboxField label="announce" checked={state.announce} onChange={set('announce')} />
            </Options>
          </Controls>
          <PlaygroundFooter>
            <Button
              size="sm"
              variant="ghost"
              color="secondary"
              onClick={() => {
                setState(defaults)
                setVisible(true)
              }}
            >
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
        <PropsTable props={alertProps} />
      </Section>

      <Section>
        <Heading>Statuses</Heading>
        <Preview>
          <Alert status="info" title="New export format">
            CSV exports now include tags.
          </Alert>
          <Alert status="success" title="Changes saved" />
          <Alert status="warning" title="Unsaved changes">
            You have changes that haven't been saved yet.
          </Alert>
          <Alert status="danger" title="We couldn't load your invoices">
            Check your connection and refresh the page.
          </Alert>
        </Preview>
      </Section>

      <Section>
        <Heading>Announced after an action</Heading>
        <Description>
          announce makes screen readers read the alert as soon as it appears. Use it for alerts
          triggered by the user, like a failed payment.
        </Description>
        <Preview>
          <AnnounceExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Put the alert next to what it's about: at the top of a form for form-wide errors, at the
            top of the page for page-wide issues.
          </li>
          <li>
            Say what happened and what to do next. "Payment failed. Check the card details or use a
            different card" beats "Error 402".
          </li>
          <li>
            Match the status to the impact. Overusing danger makes real problems easier to miss.
          </li>
          <li>
            Don't make critical alerts dismissible if the problem still exists; dismiss should mean
            "I've read this", not "make the problem go away".
          </li>
          <li>For brief confirmations that don't need to stay on the page, use a Toast instead.</li>
        </Guidelines>
      </Section>
    </>
  )
}

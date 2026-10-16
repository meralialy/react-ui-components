import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { ToastProvider, useToast } from '../../components/toast'
import type { ToastPlacement, ToastStatus } from '../../components/toast'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
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
  StageNote,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

const statuses = ['info', 'success', 'warning', 'danger'] as const satisfies readonly ToastStatus[]
const durations = ['3000', '6000', '10000', 'null (until dismissed)'] as const
const placements = [
  'bottom-right',
  'bottom-center',
  'top-right',
  'top-center',
] as const satisfies readonly ToastPlacement[]

type State = {
  status: ToastStatus
  title: string
  description: string
  duration: (typeof durations)[number]
  action: boolean
  placement: ToastPlacement
}

const defaults: State = {
  status: 'success',
  title: 'Project archived',
  description: 'You can restore it from Settings.',
  duration: '6000',
  action: true,
  placement: 'bottom-right',
}

const quote = (s: string) => JSON.stringify(s).replace(/^"|"$/g, "'").replace(/\\"/g, '"')

function buildCode(state: State) {
  const fields = [`title: ${quote(state.title)}`]
  if (state.description) fields.push(`description: ${quote(state.description)}`)
  if (state.status !== 'info') fields.push(`status: '${state.status}'`)
  if (state.duration !== '6000')
    fields.push(`duration: ${state.duration.startsWith('null') ? 'null' : state.duration}`)
  if (state.action) fields.push("action: { label: 'Undo', onClick: restore }")

  const setup =
    state.placement === 'bottom-right'
      ? []
      : [`// In your app root: <ToastProvider placement="${state.placement}">`, '']
  return [
    "import { useToast } from './components/toast'",
    '',
    ...setup,
    'const { toast } = useToast()',
    ...(state.action ? ['const restore = () => {} // your undo'] : []),
    '',
    'toast({',
    ...fields.map((f) => `  ${f},`),
    '})',
  ].join('\n')
}

const setupCode = `import { ToastProvider } from './components/toast'

// Once, near the root of the app
<ToastProvider>
  <App />
</ToastProvider>`

const optionProps: PropDoc[] = [
  { name: 'title', required: true, type: 'ReactNode', description: 'The message. Keep it short.' },
  { name: 'description', type: 'ReactNode', description: 'One line of extra detail, if needed.' },
  {
    name: 'status',
    type: "'info' | 'success' | 'warning' | 'danger'",
    default: "'info'",
    description: 'Sets the icon and accent color.',
  },
  {
    name: 'duration',
    type: 'number | null',
    default: '6000',
    description:
      'Milliseconds before it hides. null keeps it until dismissed. Always pauses while hovered or focused.',
  },
  {
    name: 'action',
    type: '{ label: string; onClick: () => void }',
    description: 'One follow-up, typically Undo. Clicking it also dismisses the toast.',
  },
]

const providerProps: PropDoc[] = [
  {
    name: 'placement',
    type: "'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'",
    default: "'bottom-right'",
    description:
      'Where toasts appear; they slide in from that edge, newest nearest it. Full width on phones. Keep one placement per app.',
  },
  {
    name: 'max',
    type: 'number',
    default: '3',
    description: 'Most toasts at once; the oldest goes first.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '6000',
    description: 'Default auto-hide time for toasts that don’t set their own.',
  },
]

function Patterns() {
  const { toast } = useToast()
  return (
    <Flex gap={2} wrap>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toast({ title: 'Changes saved', status: 'success' })}
      >
        Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        color="danger"
        onClick={() =>
          toast({
            title: '3 messages deleted',
            action: { label: 'Undo', onClick: () => toast({ title: 'Messages restored' }) },
          })
        }
      >
        Delete messages
      </Button>
      <Button
        size="sm"
        variant="outline"
        color="secondary"
        onClick={() =>
          toast({
            title: "You're offline",
            description: 'Changes will sync when you reconnect.',
            status: 'warning',
            duration: null,
          })
        }
      >
        Go offline
      </Button>
    </Flex>
  )
}

function PlaygroundBody({
  state,
  setState,
}: {
  state: State
  setState: Dispatch<SetStateAction<State>>
}) {
  const { toast } = useToast()
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  function show() {
    toast({
      title: state.title,
      description: state.description || undefined,
      status: state.status,
      duration: state.duration.startsWith('null') ? null : Number(state.duration),
      action: state.action
        ? { label: 'Undo', onClick: () => toast({ title: 'Project restored', status: 'info' }) }
        : undefined,
    })
  }

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <Button onClick={show}>Show toast</Button>
          <StageNote>Hover over or tab to a toast to pause it.</StageNote>
        </Stage>
        <Controls>
          <SelectField
            label="status"
            value={state.status}
            options={statuses}
            onChange={set('status')}
          />
          <TextField label="title" value={state.title} onChange={set('title')} />
          <TextField label="description" value={state.description} onChange={set('description')} />
          <SelectField
            label="placement (on ToastProvider)"
            value={state.placement}
            options={placements}
            onChange={set('placement')}
          />
          <SelectField
            label="duration"
            value={state.duration}
            options={durations}
            onChange={set('duration')}
          />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="action (Undo)" checked={state.action} onChange={set('action')} />
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
    </>
  )
}

// Its own provider, so the chosen placement applies to the playground's toasts only.
function ToastPlayground() {
  const [state, setState] = useState(defaults)
  return (
    <ToastProvider placement={state.placement}>
      <PlaygroundBody state={state} setState={setState} />
    </ToastProvider>
  )
}

export function ToastPage() {
  return (
    <>
      <PageTitle>Toast</PageTitle>
      <PageIntro>
        A brief notification that appears in the corner, then goes away on its own. For
        confirmations and low-priority updates.
      </PageIntro>

      <Section>
        <Heading>Setup</Heading>
        <Description>
          Add ToastProvider once, near the root. Then call toast() from any component with the
          useToast() hook.
        </Description>
        <CodeBlock code={setupCode} label="Setup code" />
      </Section>

      <Section>
        <Heading>Playground</Heading>
        <ToastPlayground />
      </Section>

      <Section>
        <Heading>toast() options</Heading>
        <PropsTable props={optionProps} />
      </Section>

      <Section>
        <Heading>ToastProvider props</Heading>
        <PropsTable props={providerProps} />
      </Section>

      <Section>
        <Heading>Common patterns</Heading>
        <Description>
          A confirmation, an undoable action, and a status that stays until resolved.
        </Description>
        <Preview>
          <Patterns />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use toasts for things users can safely miss: confirmations ("Saved"), and undo after a
            destructive action.
          </li>
          <li>
            Don't use them for errors users must act on, or anything that needs a decision. Use an
            Alert near the problem, or a modal.
          </li>
          <li>Keep it to a few words. If it needs a paragraph, it isn't a toast.</li>
          <li>
            Toasts are announced politely and never steal focus, so don't put the only way to do
            something inside one.
          </li>
          <li>One toast per event. Several at once means they're being overused.</li>
        </Guidelines>
      </Section>
    </>
  )
}

import { useState } from 'react'
import { Button } from '../../components/button'
import { Checkbox, CheckboxGroup } from '../../components/checkbox'
import { Flex } from '../../components/flex'
import { Popover } from '../../components/popover'
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

const sides = ['bottom', 'top', 'left', 'right'] as const
const aligns = ['start', 'center', 'end'] as const

type State = {
  title: string
  side: (typeof sides)[number]
  align: (typeof aligns)[number]
}
const defaults: State = { title: 'Filter by status', side: 'bottom', align: 'start' }

function buildCode(state: State) {
  const props = ['trigger={<Button variant="outline">Filters</Button>}']
  if (state.title) props.push(jsxString('title', state.title))
  else props.push('label="Filters"')
  if (state.side !== 'bottom') props.push(`side="${state.side}"`)
  if (state.align !== 'start') props.push(`align="${state.align}"`)
  return [
    "import { Button } from './components/button'",
    "import { Checkbox, CheckboxGroup } from './components/checkbox'",
    "import { Popover } from './components/popover'",
    '',
    jsxElement('Popover', props, [
      [
        '<CheckboxGroup label="Status" hideLabel>',
        '  <Checkbox value="open" label="Open" />',
        '  <Checkbox value="closed" label="Closed" />',
        '</CheckboxGroup>',
      ].join('\n'),
    ]),
  ].join('\n')
}

const popoverProps: PropDoc[] = [
  {
    name: 'trigger',
    required: true,
    type: 'ReactElement',
    description: 'The element that toggles it, usually a Button. Gets aria-expanded automatically.',
  },
  {
    name: 'children',
    required: true,
    type: 'ReactNode',
    description: 'Content, which can be interactive.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description: 'Heading with a close button; also names the popover. Use title or label.',
  },
  { name: 'label', type: 'string', description: 'Accessible name when there’s no visible title.' },
  {
    name: 'open / onOpenChange',
    type: 'boolean / (open: boolean) => void',
    description: 'Controlled mode, e.g. to close it after applying a filter.',
  },
  {
    name: 'side',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'bottom'",
    description: 'Preferred side; flips when there isn’t room.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    default: "'start'",
    description: 'Alignment along that side.',
  },
  {
    name: 'width',
    type: 'number',
    default: '320',
    description: 'Width in px; never wider than the screen.',
  },
]

function FilterExample() {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<string[]>([])
  const [draft, setDraft] = useState<string[]>([])
  return (
    <Flex gap={3} align="center" wrap>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next) setDraft(applied)
          setOpen(next)
        }}
        trigger={
          <Button variant="outline">Status{applied.length ? ` (${applied.length})` : ''}</Button>
        }
        title="Filter by status"
      >
        <CheckboxGroup label="Status" hideLabel value={draft} onChange={setDraft}>
          <Checkbox value="draft" label="Draft" />
          <Checkbox value="sent" label="Sent" />
          <Checkbox value="paid" label="Paid" />
          <Checkbox value="overdue" label="Overdue" />
        </CheckboxGroup>
        <Flex justify="end" gap={2}>
          <Button size="sm" variant="ghost" color="secondary" onClick={() => setDraft([])}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setApplied(draft)
              setOpen(false)
            }}
          >
            Apply
          </Button>
        </Flex>
      </Popover>
      <span>{applied.length ? `Showing: ${applied.join(', ')}` : 'Showing all invoices'}</span>
    </Flex>
  )
}

export function PopoverPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Popover</PageTitle>
      <PageIntro>
        A small panel anchored to a button, for interactive content like quick filters or settings.
        Unlike a modal, the rest of the page stays usable.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Popover
              trigger={<Button variant="outline">Filters</Button>}
              title={state.title || undefined}
              label={state.title ? undefined : 'Filters'}
              side={state.side}
              align={state.align}
            >
              <CheckboxGroup label="Status" hideLabel>
                <Checkbox value="open" label="Open" />
                <Checkbox value="closed" label="Closed" />
              </CheckboxGroup>
            </Popover>
          </Stage>
          <Controls>
            <TextField label="title" value={state.title} onChange={set('title')} />
            <SelectField label="side" value={state.side} options={sides} onChange={set('side')} />
            <SelectField
              label="align"
              value={state.align}
              options={aligns}
              onChange={set('align')}
            />
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
        <PropsTable props={popoverProps} />
      </Section>

      <Section>
        <Heading>Filter with Apply</Heading>
        <Description>
          Controlled with open and onOpenChange, so Apply can close it. Choices only take effect on
          Apply.
        </Description>
        <Preview>
          <FilterExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use a popover for small, optional tasks related to its trigger. For a decision that must
            be made, use a Modal; for a list of actions, use a Menu.
          </li>
          <li>Keep content short. If it needs scrolling, it should be a page or a modal.</li>
          <li>
            Escape, clicking outside, or tabbing away closes it, so don't rely on it staying open to
            hold unsaved work.
          </li>
          <li>Give it a title or label so screen readers announce what opened.</li>
        </Guidelines>
      </Section>
    </>
  )
}

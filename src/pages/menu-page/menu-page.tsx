import { useState } from 'react'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Menu } from '../../components/menu'
import type { MenuItem } from '../../components/menu'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
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

const aligns = ['start', 'center', 'end'] as const
const sides = ['bottom', 'top'] as const

type State = {
  align: (typeof aligns)[number]
  side: (typeof sides)[number]
  separator: boolean
  danger: boolean
  disableOne: boolean
}
const defaults: State = {
  align: 'start',
  side: 'bottom',
  separator: true,
  danger: true,
  disableOne: false,
}

function ChevronDown() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function buildCode(state: State) {
  const lines = [
    "    { label: 'Edit', onSelect: edit },",
    `    { label: 'Duplicate', onSelect: duplicate${state.disableOne ? ', disabled: true' : ''} },`,
    "    { label: 'Share', onSelect: share },",
  ]
  if (state.danger) {
    if (state.separator) lines.push('    { separator: true },')
    lines.push("    { label: 'Delete', onSelect: remove, danger: true },")
  }
  const props = [
    'trigger={<Button variant="outline">Actions</Button>}',
    ['items={[', ...lines, '  ]}'].join('\n'),
  ]
  if (state.side !== 'bottom') props.push(`side="${state.side}"`)
  if (state.align !== 'start') props.push(`align="${state.align}"`)
  const handlers = ['edit', 'duplicate', 'share', ...(state.danger ? ['remove'] : [])]
  return [
    "import { Button } from './components/button'",
    "import { Menu } from './components/menu'",
    '',
    ...handlers.map((h) => `const ${h} = () => {} // your action`),
    '',
    jsxElement('Menu', props),
  ].join('\n')
}

const menuProps: PropDoc[] = [
  {
    name: 'trigger',
    required: true,
    type: 'ReactElement',
    description:
      'The button that opens the menu. Gets aria-haspopup and aria-expanded; opens with click, Enter, Space or the arrow keys.',
  },
  {
    name: 'items',
    required: true,
    type: '(MenuAction | { separator: true })[]',
    description: 'The actions, in order. Separators divide groups.',
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
    description: 'Alignment against the trigger.',
  },
]

const actionProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'string',
    description: 'A short verb phrase. Also used for type-ahead.',
  },
  {
    name: 'onSelect',
    required: true,
    type: '() => void',
    description: 'Runs after the menu closes and focus returns to the trigger.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Optional icon. Use icons on all items or none.',
  },
  {
    name: 'danger',
    type: 'boolean',
    default: 'false',
    description: 'Red text for destructive actions. Put these last.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Greyed out but still focusable, so users know it exists.',
  },
]

export function MenuPage() {
  const [state, setState] = useState(defaults)
  const [last, setLast] = useState<string | null>(null)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const items: MenuItem[] = [
    { label: 'Edit', onSelect: () => setLast('Edit') },
    { label: 'Duplicate', onSelect: () => setLast('Duplicate'), disabled: state.disableOne },
    { label: 'Share', onSelect: () => setLast('Share') },
    ...(state.danger
      ? [
          ...(state.separator ? [{ separator: true } as const] : []),
          { label: 'Delete', onSelect: () => setLast('Delete'), danger: true },
        ]
      : []),
  ]

  return (
    <>
      <PageTitle>Menu</PageTitle>
      <PageIntro>
        A button that opens a list of actions. Split button uses the same menu, so both behave
        identically for keyboard and screen reader users.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Menu
              trigger={
                <Button variant="outline" endIcon={<ChevronDown />}>
                  Actions
                </Button>
              }
              items={items}
              side={state.side}
              align={state.align}
            />
            <StageNote aria-live="polite">
              {last ? `Last action: ${last}` : 'Open with click, or focus it and press Down'}
            </StageNote>
          </Stage>
          <Controls>
            <SelectField label="side" value={state.side} options={sides} onChange={set('side')} />
            <SelectField
              label="align"
              value={state.align}
              options={aligns}
              onChange={set('align')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField
                label="Destructive action"
                checked={state.danger}
                onChange={set('danger')}
              />
              <CheckboxField
                label="Separator"
                checked={state.separator}
                onChange={set('separator')}
              />
              <CheckboxField
                label="Disable an action"
                checked={state.disableOne}
                onChange={set('disableOne')}
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
        <Heading>Menu props</Heading>
        <PropsTable props={menuProps} />
      </Section>

      <Section>
        <Heading>Item props</Heading>
        <PropsTable props={actionProps} />
      </Section>

      <Section>
        <Heading>Row actions</Heading>
        <Description>
          A compact "more" menu, aligned to the end so it opens inward from the right edge.
        </Description>
        <Preview>
          <Flex justify="between" align="center">
            <span>Q3 report.pdf</span>
            <Menu
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  color="secondary"
                  aria-label="More actions for Q3 report.pdf"
                >
                  •••
                </Button>
              }
              align="end"
              items={[
                { label: 'Rename', onSelect: () => {} },
                { label: 'Download', onSelect: () => {} },
                { separator: true },
                { label: 'Delete', onSelect: () => {}, danger: true },
              ]}
            />
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>Menus are for actions. For choosing a value, use Select or radio buttons.</li>
          <li>
            Keep it to about 7 items, ordered by how often they’re used, with destructive actions
            last behind a separator.
          </li>
          <li>
            Icon-only triggers need an aria-label that says what the menu is for, e.g. "More actions
            for Q3 report.pdf".
          </li>
          <li>
            If one action is clearly the most common, show it as a button and put the rest in a
            Split button.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

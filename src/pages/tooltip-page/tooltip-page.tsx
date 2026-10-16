import { useState } from 'react'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Tooltip } from '../../components/tooltip'
import { CodeBlock } from '../../docs/code-block'
import { SelectField, TextField } from '../../docs/form-controls'
import { PlusIcon } from '../../components/icon'
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
  StageNote,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

const sides = ['top', 'bottom', 'left', 'right'] as const
const delays = ['0', '300', '700'] as const

type State = { content: string; side: (typeof sides)[number]; delay: (typeof delays)[number] }
const defaults: State = { content: 'Saves without publishing', side: 'top', delay: '300' }

function buildCode(state: State) {
  const props = [jsxString('content', state.content)]
  if (state.side !== 'top') props.push(`side="${state.side}"`)
  if (state.delay !== '300') props.push(`delay={${state.delay}}`)
  return [
    "import { Button } from './components/button'",
    "import { Tooltip } from './components/tooltip'",
    '',
    jsxElement('Tooltip', props, ['<Button variant="outline">Save draft</Button>']),
  ].join('\n')
}

const tooltipProps: PropDoc[] = [
  {
    name: 'content',
    required: true,
    type: 'ReactNode',
    description: 'Short, plain text. Linked to the trigger with aria-describedby.',
  },
  {
    name: 'children',
    required: true,
    type: 'ReactElement',
    description:
      'One focusable element, e.g. a Button. Disabled buttons don’t fire events, so they can’t show tooltips.',
  },
  {
    name: 'side',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'top'",
    description: 'Preferred side. Flips automatically when there isn’t room.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '300',
    description:
      'Hover delay in ms, so tooltips don’t flash as the pointer passes. Focus shows it at once.',
  },
]

export function TooltipPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Tooltip</PageTitle>
      <PageIntro>
        A short hint that appears on hover and keyboard focus. Can be dismissed with Escape, and
        stays while the pointer is over it.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Tooltip content={state.content} side={state.side} delay={Number(state.delay)}>
              <Button variant="outline">Save draft</Button>
            </Tooltip>
            <StageNote>Hover, or Tab to the button. Press Escape to dismiss.</StageNote>
          </Stage>
          <Controls>
            <TextField label="content" value={state.content} onChange={set('content')} />
            <SelectField label="side" value={state.side} options={sides} onChange={set('side')} />
            <SelectField
              label="delay"
              value={state.delay}
              options={delays}
              onChange={set('delay')}
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
        <PropsTable props={tooltipProps} />
      </Section>

      <Section>
        <Heading>Icon buttons</Heading>
        <Description>
          The most common use: an icon-only button already has an aria-label naming it; the tooltip
          shows that name to sighted users.
        </Description>
        <Preview>
          <Flex gap={2}>
            {sides.map((side) => (
              <Tooltip key={side} content={`Add item (${side})`} side={side}>
                <Button variant="outline" size="sm" aria-label="Add item">
                  <PlusIcon />
                </Button>
              </Tooltip>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use tooltips for brief, helpful extras: naming icon buttons, or explaining a shortcut.
            Never put essential information only in a tooltip; touch users may never see it.
          </li>
          <li>
            Keep it to a few words of plain text. No links, buttons or images; use a Popover for
            anything interactive.
          </li>
          <li>Don’t add a tooltip that repeats a visible label word for word.</li>
          <li>
            Disabled buttons can’t show tooltips. If you need to explain why something is
            unavailable, put that text on the page.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

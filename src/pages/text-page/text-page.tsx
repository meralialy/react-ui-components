import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Text } from '../../components/text'
import type { TextColor } from '../../components/text'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
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
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { colorNames, fontSizes, fontWeights } from '../../theme/theme'
import type { FontSize, FontWeight } from '../../theme/theme'

const sizes = Object.keys(fontSizes) as FontSize[]
const weights = Object.keys(fontWeights) as FontWeight[]
const colors = ['default', 'muted', ...colorNames] as const satisfies readonly TextColor[]
const elements = ['p', 'span', 'div', 'label', 'strong'] as const
const truncations = ['none', 'true (1 line)', '2', '3'] as const

type State = {
  text: string
  as: (typeof elements)[number]
  size: FontSize
  weight: FontWeight
  color: TextColor
  truncate: (typeof truncations)[number]
  measure: boolean
}

const defaults: State = {
  text: 'Invoices are sent on the first of every month. You can change the date, the reminder schedule and the payment terms in your billing settings at any time.',
  as: 'p',
  size: 'md',
  weight: 'regular',
  color: 'default',
  truncate: 'none',
  measure: false,
}

const truncateValue = (t: State['truncate']) =>
  t === 'none' ? undefined : t.startsWith('true') ? true : Number(t)

function buildCode(state: State) {
  const props: string[] = []
  if (state.as !== 'p') props.push(`as="${state.as}"`)
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.weight !== 'regular') props.push(`weight="${state.weight}"`)
  if (state.color !== 'default') props.push(`color="${state.color}"`)
  if (state.measure) props.push('measure')
  const t = truncateValue(state.truncate)
  if (t === true) props.push('truncate')
  else if (t) props.push(`truncate={${t}}`)
  return [
    "import { Text } from './components/text'",
    '',
    jsxElement('Text', props, state.text),
  ].join('\n')
}

const textProps: PropDoc[] = [
  {
    name: 'as',
    type: 'ElementType',
    default: "'p'",
    description:
      "'p' for paragraphs, 'span' for inline text, or 'label', 'strong', etc. For headings, use Heading.",
  },
  {
    name: 'size',
    type: sizes.map((s) => `'${s}'`).join(' | '),
    default: "'md'",
    description: 'From the type scale, in rem.',
  },
  {
    name: 'weight',
    type: "'regular' | 'medium' | 'semibold' | 'bold'",
    default: "'regular'",
    description: 'Font weight.',
  },
  {
    name: 'color',
    type: `'default' | 'muted' | ${colorNames.map((c) => `'${c}'`).join(' | ')}`,
    default: "'default'",
    description: 'Theme text colors only, so every option passes contrast in both modes.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    description: 'Text alignment. Keep long text start-aligned.',
  },
  {
    name: 'lineHeight',
    type: "'tight' | 'snug' | 'normal' | 'relaxed'",
    default: "'normal'",
    description: 'Line spacing. Body text should stay at normal (1.5) or looser.',
  },
  {
    name: 'measure',
    type: 'boolean',
    default: 'false',
    description: 'Caps lines at about 65 characters for comfortable reading.',
  },
  {
    name: 'truncate',
    type: 'boolean | number',
    description:
      'Cuts off with "…" after one line (true) or N lines. Screen readers still get the full text; plain text gets a tooltip.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as id, className and htmlFor (with as="label").',
  },
]

const ScaleRow = styled.div`
  display: grid;
  grid-template-columns: 48px 64px 1fr;
  align-items: baseline;
  gap: 12px;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.text.muted};
  }
`

const Narrow = styled.div`
  width: 100%;
  max-width: 520px;
`

export function TextPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Text</PageTitle>
      <PageIntro>
        Body text in the theme's type scale and colors. Sizes are in rem, so text grows when users
        increase their browser's font size.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Narrow>
              <Text
                as={state.as}
                size={state.size}
                weight={state.weight}
                color={state.color}
                measure={state.measure}
                truncate={truncateValue(state.truncate)}
              >
                {state.text}
              </Text>
            </Narrow>
          </Stage>
          <Controls>
            <TextField label="children" value={state.text} onChange={set('text')} />
            <SelectField label="as" value={state.as} options={elements} onChange={set('as')} />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="weight"
              value={state.weight}
              options={weights}
              onChange={set('weight')}
            />
            <SelectField
              label="color"
              value={state.color}
              options={colors}
              onChange={set('color')}
            />
            <SelectField
              label="truncate"
              value={state.truncate}
              options={truncations}
              onChange={set('truncate')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField label="measure" checked={state.measure} onChange={set('measure')} />
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
        <PropsTable props={textProps} />
      </Section>

      <Section>
        <Heading>Type scale</Heading>
        <Description>
          In the theme as theme.fontSizes, alongside fontWeights and lineHeights.
        </Description>
        <Preview>
          <Flex direction="column" gap={3}>
            {sizes.map((size) => (
              <ScaleRow key={size}>
                <code>{size}</code>
                <code>{fontSizes[size]}</code>
                <Text size={size} truncate>
                  The quick brown fox jumps over the lazy dog
                </Text>
              </ScaleRow>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Colors</Heading>
        <Preview>
          <Flex direction="column" gap={1}>
            {colors.map((color) => (
              <Text key={color} color={color}>
                {color}: Payment received on 3 March.
              </Text>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use Heading for headings; a big bold Text is invisible to people navigating by headings.
          </li>
          <li>
            Keep body text at md and line height normal or relaxed. Use sm for secondary details, xs
            sparingly.
          </li>
          <li>Use measure on long-form text; lines over about 80 characters are tiring to read.</li>
          <li>
            Don't rely on color alone to carry meaning: "Overdue" in red is fine, a red number with
            no word isn't.
          </li>
          <li>
            Truncate only text that's available elsewhere (a detail page, a tooltip), never
            essential instructions.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

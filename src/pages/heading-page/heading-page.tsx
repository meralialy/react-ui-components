import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { Flex } from '../../components/flex'
import { Heading } from '../../components/heading'
import type { HeadingLevel } from '../../components/heading'
import { Text } from '../../components/text'
import { CodeBlock } from '../../docs/code-block'
import { SelectField, TextField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
import {
  Description,
  Guidelines,
  Heading as SectionHeading,
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
import { fontSizes, fontWeights } from '../../theme/theme'
import type { FontSize, FontWeight } from '../../theme/theme'

const levels = ['1', '2', '3', '4', '5', '6'] as const
const sizes = ['default for level', ...Object.keys(fontSizes)] as const
const weights = ['default for level', ...Object.keys(fontWeights)] as const

type State = {
  text: string
  level: (typeof levels)[number]
  size: (typeof sizes)[number]
  weight: (typeof weights)[number]
}
const defaults: State = {
  text: 'Billing settings',
  level: '2',
  size: 'default for level',
  weight: 'default for level',
}

function buildCode(state: State) {
  const props = [`level={${state.level}}`]
  if (!state.size.startsWith('default')) props.push(`size="${state.size}"`)
  if (!state.weight.startsWith('default')) props.push(`weight="${state.weight}"`)
  return [
    "import { Heading } from './components/heading'",
    '',
    jsxElement('Heading', props, state.text),
  ].join('\n')
}

const headingProps: PropDoc[] = [
  {
    name: 'level',
    required: true,
    type: '1 | 2 | 3 | 4 | 5 | 6',
    description:
      'The HTML element (h1–h6): where the heading sits in the page outline. Follow the structure, not the look.',
  },
  {
    name: 'size',
    type: Object.keys(fontSizes)
      .map((s) => `'${s}'`)
      .join(' | '),
    default: '3xl, 2xl, xl, lg, md, sm by level',
    description: 'Visual size, when it should differ from the level’s default.',
  },
  {
    name: 'weight',
    type: "'regular' | 'medium' | 'semibold' | 'bold'",
    default: 'bold (1–2), semibold (3–6)',
    description: 'Font weight.',
  },
  {
    name: 'color',
    type: "'default' | 'muted' | ColorName",
    default: "'default'",
    description: 'Same theme colors as Text.',
  },
  { name: 'align', type: "'start' | 'center' | 'end'", description: 'Text alignment.' },
  {
    name: 'truncate',
    type: 'boolean | number',
    description: 'Cuts off with "…" after one line or N lines.',
  },
]

const outlineCode = `<Heading level={1}>Settings</Heading>
<Heading level={2}>Billing</Heading>
<Heading level={3}>Payment method</Heading>
<Heading level={3}>Invoices</Heading>
<Heading level={2}>Notifications</Heading>`

const Narrow = styled.div`
  width: 100%;
  max-width: 520px;
`

export function HeadingPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Heading</PageTitle>
      <PageIntro>
        Section headings, h1 to h6. The level gives the page its structure for screen readers; size
        sets how it looks, independently.
      </PageIntro>

      <Section>
        <SectionHeading>Playground</SectionHeading>
        <PlaygroundCard>
          <Stage>
            <Narrow>
              <Heading
                level={Number(state.level) as HeadingLevel}
                size={state.size.startsWith('default') ? undefined : (state.size as FontSize)}
                weight={
                  state.weight.startsWith('default') ? undefined : (state.weight as FontWeight)
                }
              >
                {state.text}
              </Heading>
            </Narrow>
          </Stage>
          <Controls>
            <TextField label="children" value={state.text} onChange={set('text')} />
            <SelectField
              label="level"
              value={state.level}
              options={levels}
              onChange={set('level')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="weight"
              value={state.weight}
              options={weights}
              onChange={set('weight')}
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
        <SectionHeading>Props</SectionHeading>
        <PropsTable props={headingProps} />
      </Section>

      <Section>
        <SectionHeading>Levels</SectionHeading>
        <Description>Default size and weight for each level.</Description>
        <Preview>
          {/* All real h3s (this section is an h2), sized like each level's default, so the demo
              keeps the page outline intact */}
          <Flex direction="column" gap={3}>
            {([1, 2, 3, 4, 5, 6] as const).map((level) => (
              <Heading
                key={level}
                level={3}
                size={(['3xl', '2xl', 'xl', 'lg', 'md', 'sm'] as const)[level - 1]}
                weight={level <= 2 ? 'bold' : 'semibold'}
              >
                Level {level} default
              </Heading>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <SectionHeading>Level and size are separate</SectionHeading>
        <Description>
          This card's title is the right level for the page structure (h3), sized small to suit the
          card.
        </Description>
        <Preview>
          <Narrow>
            <Card>
              <Flex direction="column" gap={2}>
                <Heading level={3} size="md">
                  Storage
                </Heading>
                <Text size="sm" color="muted">
                  9.2 GB of 10 GB used.
                </Text>
              </Flex>
            </Card>
          </Narrow>
        </Preview>
      </Section>

      <Section>
        <SectionHeading>A page outline</SectionHeading>
        <Description>Levels nest like an outline: no skipping from h2 to h4.</Description>
        <CodeBlock code={outlineCode} label="Outline example" />
      </Section>

      <Section>
        <SectionHeading>Guidelines</SectionHeading>
        <Guidelines>
          <li>
            One h1 per page, naming the page. Then h2 for sections, h3 inside those, and so on.
          </li>
          <li>Don't skip levels to get a smaller look; keep the level and set size instead.</li>
          <li>Write headings that describe the section, so they make sense when read as a list.</li>
          <li>Don't use Heading for text that just needs to be bold; use Text with a weight.</li>
        </Guidelines>
      </Section>
    </>
  )
}

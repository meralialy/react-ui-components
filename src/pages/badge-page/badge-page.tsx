import { useState } from 'react'
import { Badge } from '../../components/badge'
import type { BadgeSize, BadgeVariant } from '../../components/badge'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { CodeBlock } from '../../docs/code-block'
import { SelectField, TextField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
import {
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Row,
  RowLabel,
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
import type { ColorName } from '../../theme/theme'

const variants = ['subtle', 'solid'] as const satisfies readonly BadgeVariant[]
const sizes = ['sm', 'md'] as const satisfies readonly BadgeSize[]

type State = { text: string; color: ColorName; variant: BadgeVariant; size: BadgeSize }
const defaults: State = { text: 'Paid', color: 'success', variant: 'subtle', size: 'md' }

function buildCode(state: State) {
  const props: string[] = []
  if (state.color !== 'secondary') props.push(`color="${state.color}"`)
  if (state.variant !== 'subtle') props.push(`variant="${state.variant}"`)
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  return [
    "import { Badge } from './components/badge'",
    '',
    jsxElement('Badge', props, state.text),
  ].join('\n')
}

const badgeProps: PropDoc[] = [
  {
    name: 'children',
    required: true,
    type: 'ReactNode',
    description: 'One or two words. The text carries the meaning.',
  },
  {
    name: 'color',
    type: colorNames.map((c) => `'${c}'`).join(' | '),
    default: "'secondary'",
    description:
      'Meaning: success for done/paid, warning for attention, danger for problems. secondary is neutral.',
  },
  {
    name: 'variant',
    type: "'subtle' | 'solid'",
    default: "'subtle'",
    description: 'Subtle for most badges; solid only for the one status that must stand out.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '20 or 24px tall.' },
  { name: 'icon', type: 'ReactNode', description: 'Optional leading icon.' },
]

const statuses: [string, ColorName][] = [
  ['Draft', 'secondary'],
  ['Sent', 'info'],
  ['Paid', 'success'],
  ['Due soon', 'warning'],
  ['Overdue', 'danger'],
]

export function BadgePage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Badge</PageTitle>
      <PageIntro>
        A small label for status or category, like "Paid" or "Beta". Not interactive.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Badge color={state.color} variant={state.variant} size={state.size}>
              {state.text}
            </Badge>
          </Stage>
          <Controls>
            <TextField label="children" value={state.text} onChange={set('text')} />
            <SelectField
              label="color"
              value={state.color}
              options={colorNames}
              onChange={set('color')}
            />
            <SelectField
              label="variant"
              value={state.variant}
              options={variants}
              onChange={set('variant')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
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
        <PropsTable props={badgeProps} />
      </Section>

      <Section>
        <Heading>Colors &amp; variants</Heading>
        <Preview>
          {variants.map((variant) => (
            <Row key={variant}>
              <RowLabel>{variant}</RowLabel>
              {colorNames.map((color) => (
                <Badge key={color} color={color} variant={variant}>
                  {color}
                </Badge>
              ))}
            </Row>
          ))}
        </Preview>
      </Section>

      <Section>
        <Heading>Invoice statuses</Heading>
        <Preview>
          <Flex gap={2} wrap>
            {statuses.map(([label, color]) => (
              <Badge key={label} color={color}>
                {label}
              </Badge>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>Keep the text short and specific: "Overdue", not "Attention needed".</li>
          <li>
            Use colors consistently: the same status should always be the same color across the
            product.
          </li>
          <li>Don't make badges clickable. For filters or removable tags, use a button.</li>
          <li>Use solid sparingly. If everything is loud, nothing stands out.</li>
        </Guidelines>
      </Section>
    </>
  )
}

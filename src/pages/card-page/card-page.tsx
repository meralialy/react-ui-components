import { useState } from 'react'
import styled from 'styled-components'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Card } from '../../components/card'
import type { CardPadding, CardVariant } from '../../components/card'
import { Link } from '../../components/link'
import { Menu } from '../../components/menu'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
import { jsxElement, jsxString } from '../../docs/jsx'
import {
  Description,
  Grid,
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

const variants = ['outlined', 'elevated'] as const satisfies readonly CardVariant[]
const paddings = ['sm', 'md', 'lg'] as const satisfies readonly CardPadding[]

type State = {
  title: string
  description: string
  variant: CardVariant
  padding: CardPadding
  footer: boolean
  actions: boolean
}

const defaults: State = {
  title: 'Website redesign',
  description: 'Updated 2 hours ago',
  variant: 'outlined',
  padding: 'md',
  footer: true,
  actions: false,
}

function buildCode(state: State) {
  const props: string[] = []
  if (state.title) props.push(jsxString('title', state.title))
  if (state.description) props.push(jsxString('description', state.description))
  if (state.variant !== 'outlined') props.push(`variant="${state.variant}"`)
  if (state.padding !== 'md') props.push(`padding="${state.padding}"`)
  if (state.actions) props.push('actions={<Badge color="success">Active</Badge>}')
  if (state.footer) props.push('footer={<Button size="sm" variant="outline">Open project</Button>}')
  const imports = ["import { Card } from './components/card'"]
  if (state.actions) imports.push("import { Badge } from './components/badge'")
  if (state.footer) imports.push("import { Button } from './components/button'")
  return [
    ...imports,
    '',
    jsxElement('Card', props, ['<p>A refresh of the marketing site, launching in Q4.</p>']),
  ].join('\n')
}

const cardProps: PropDoc[] = [
  { name: 'title', type: 'ReactNode', description: 'Card heading.' },
  {
    name: 'titleAs',
    type: "'h2' | 'h3' | 'h4'",
    default: "'h3'",
    description: 'Heading level, to fit the page outline.',
  },
  { name: 'description', type: 'ReactNode', description: 'Supporting line under the title.' },
  {
    name: 'media',
    type: 'ReactNode',
    description: 'Image or media shown edge to edge at the top.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description: 'Small controls at the top right, e.g. a Menu or Badge.',
  },
  { name: 'children', type: 'ReactNode', description: 'Body content.' },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Actions or meta along the bottom, above a divider.',
  },
  {
    name: 'variant',
    type: "'outlined' | 'elevated'",
    default: "'outlined'",
    description: 'Border only, or with a shadow.',
  },
  {
    name: 'padding',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: '12, 20 or 28px inside.',
  },
  {
    name: 'stretchLink',
    type: 'boolean',
    default: 'false',
    description:
      'The link in the title covers the whole card: one big click target, still one link for screen readers. Buttons inside stay usable.',
  },
  {
    name: 'as',
    type: 'ElementType',
    default: "'div'",
    description: "Use 'article' for standalone items like posts.",
  },
]

const Thumb = styled.div`
  height: 120px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.subtleActive},
    ${({ theme }) => theme.colors.info.subtleActive}
  );
`

const Narrow = styled.div`
  width: 100%;
  max-width: 360px;
`

export function CardPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Card</PageTitle>
      <PageIntro>
        A surface that groups content and actions about one subject, like a project or an article.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Narrow>
              <Card
                title={state.title || undefined}
                description={state.description || undefined}
                variant={state.variant}
                padding={state.padding}
                actions={state.actions ? <Badge color="success">Active</Badge> : undefined}
                footer={
                  state.footer ? (
                    <Button size="sm" variant="outline">
                      Open project
                    </Button>
                  ) : undefined
                }
              >
                <p>A refresh of the marketing site, launching in Q4.</p>
              </Card>
            </Narrow>
          </Stage>
          <Controls>
            <TextField label="title" value={state.title} onChange={set('title')} />
            <TextField
              label="description"
              value={state.description}
              onChange={set('description')}
            />
            <SelectField
              label="variant"
              value={state.variant}
              options={variants}
              onChange={set('variant')}
            />
            <SelectField
              label="padding"
              value={state.padding}
              options={paddings}
              onChange={set('padding')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField label="footer" checked={state.footer} onChange={set('footer')} />
              <CheckboxField label="actions" checked={state.actions} onChange={set('actions')} />
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
        <PropsTable props={cardProps} />
      </Section>

      <Section>
        <Heading>Clickable cards</Heading>
        <Description>
          stretchLink makes the whole card open the title link. The menu still works on its own.
        </Description>
        <Preview>
          <Grid>
            {['Design system', 'Mobile app', 'Docs site'].map((name) => (
              <Card
                key={name}
                as="article"
                stretchLink
                media={<Thumb />}
                title={
                  <Link href={`#${name}`} color="inherit" onClick={(e) => e.preventDefault()}>
                    {name}
                  </Link>
                }
                description="12 files · Updated today"
                actions={
                  <Menu
                    trigger={
                      <Button
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        aria-label={`More actions for ${name}`}
                      >
                        •••
                      </Button>
                    }
                    align="end"
                    items={[
                      { label: 'Rename', onSelect: () => {} },
                      { label: 'Delete', onSelect: () => {}, danger: true },
                    ]}
                  />
                }
              />
            ))}
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>One subject per card. If it needs tabs or lots of scrolling, it’s a page.</li>
          <li>
            For clickable cards, use stretchLink rather than wrapping the card in a link: wrapping
            makes screen readers read the whole card as one long link name.
          </li>
          <li>Keep actions to one or two; put more in a Menu.</li>
          <li>
            Use cards for items people compare or scan in a grid. For long lists, a table or list is
            denser.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { Alert } from '../../components/alert'
import { Button } from '../../components/button'
import { Link } from '../../components/link'
import type { LinkColor } from '../../components/link'
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

const colors = ['primary', 'inherit'] as const satisfies readonly LinkColor[]

type State = { text: string; href: string; external: boolean; color: LinkColor }
const defaults: State = {
  text: 'Read the accessibility guide',
  href: 'https://www.w3.org/WAI/fundamentals/',
  external: true,
  color: 'primary',
}

function buildCode(state: State) {
  const props = [jsxString('href', state.href)]
  if (state.external) props.push('external')
  if (state.color !== 'primary') props.push(`color="${state.color}"`)
  return [
    "import { Link } from './components/link'",
    '',
    jsxElement('Link', props, state.text),
  ].join('\n')
}

const routerCode = `import { Link as RouterLink } from 'react-router'
import { Link } from './components/link'

<Link as={RouterLink} to="/settings">
  Account settings
</Link>`

const linkProps: PropDoc[] = [
  { name: 'href', type: 'string', description: 'Destination, as on a normal anchor.' },
  {
    name: 'as',
    type: 'ElementType',
    default: "'a'",
    description:
      'Render through another component, e.g. a router Link. Its own props (like to) work too.',
  },
  {
    name: 'external',
    type: 'boolean',
    default: 'false',
    description:
      'Opens in a new tab with rel="noopener noreferrer", shows ↗, and says "(opens in a new tab)" to screen readers.',
  },
  {
    name: 'color',
    type: "'primary' | 'inherit'",
    default: "'primary'",
    description: "'inherit' matches the surrounding text, for links inside colored surfaces.",
  },
  {
    name: '...rest',
    type: 'AnchorHTMLAttributes',
    description: 'Native anchor attributes are passed through.',
  },
]

export function LinkPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Link</PageTitle>
      <PageIntro>
        Text that takes users somewhere else. Always underlined, so it's recognizable without
        relying on color.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <p>
              Before you ship,{' '}
              <Link href={state.href} external={state.external} color={state.color}>
                {state.text}
              </Link>
              .
            </p>
          </Stage>
          <Controls>
            <TextField label="children" value={state.text} onChange={set('text')} />
            <TextField label="href" value={state.href} onChange={set('href')} />
            <SelectField
              label="color"
              value={state.color}
              options={colors}
              onChange={set('color')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField label="external" checked={state.external} onChange={set('external')} />
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
        <PropsTable props={linkProps} />
      </Section>

      <Section>
        <Heading>With a router</Heading>
        <Description>
          Pass your router's link as as, and its props alongside. This one goes to the Button page
          without a full page load.
        </Description>
        <Preview>
          <p>
            See the{' '}
            <Link as={RouterLink} to="/button">
              Button docs
            </Link>{' '}
            for actions.
          </p>
        </Preview>
        <CodeWrapper>
          <CodeBlock code={routerCode} label="Router link code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Inside colored surfaces</Heading>
        <Preview>
          <Alert status="warning" title="Billing details missing">
            Add a card in{' '}
            <Link href="#billing" color="inherit">
              billing settings
            </Link>{' '}
            to avoid interruptions.
          </Alert>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Links go places; buttons do things. If it submits, deletes or opens a dialog, use a
            Button.
          </li>
          <li>
            Make the text say where it goes: "Read the billing guide", never "click here" (screen
            reader users often browse a list of links out of context).
          </li>
          <li>
            Only open new tabs when leaving would lose work, and use external so users are told.
          </li>
          <li>Keep links underlined in body text. Color alone isn't enough to spot them.</li>
        </Guidelines>
      </Section>
    </>
  )
}

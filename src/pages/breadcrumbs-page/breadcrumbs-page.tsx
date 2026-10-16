import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Button } from '../../components/button'
import { Link } from '../../components/link'
import { CodeBlock } from '../../docs/code-block'
import { SelectField } from '../../docs/form-controls'
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
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Website redesign', href: '/projects/website' },
  { label: 'Files', href: '/projects/website/files' },
  { label: 'Homepage mockup.fig' },
]
const depths = ['2', '3', '4', '5'] as const

type State = { depth: (typeof depths)[number] }
const defaults: State = { depth: '4' }

const itemsFor = (depth: number) => [...trail.slice(0, depth - 1), trail[trail.length - 1]]

function buildCode(state: State) {
  const items = itemsFor(Number(state.depth)).map((item) =>
    item.href
      ? `    { label: '${item.label}', href: '${item.href}' },`
      : `    { label: '${item.label}' },`,
  )
  return [
    "import { Breadcrumbs } from './components/breadcrumbs'",
    '',
    jsxElement('Breadcrumbs', [['items={[', ...items, '  ]}'].join('\n')]),
  ].join('\n')
}

const routerCode = `import { Link as RouterLink } from 'react-router'
import { Breadcrumbs } from './components/breadcrumbs'
import { Link } from './components/link'

<Breadcrumbs
  items={items}
  renderLink={({ href, children }) => (
    <Link as={RouterLink} to={href}>
      {children}
    </Link>
  )}
/>`

const breadcrumbProps: PropDoc[] = [
  {
    name: 'items',
    required: true,
    type: '{ label: ReactNode; href?: string }[]',
    description:
      'From the top level down. The last item is the current page: shown as text and marked aria-current.',
  },
  {
    name: 'renderLink',
    type: '({ href, children }) => ReactNode',
    description: 'How each link renders, e.g. with your router. Defaults to Link with an href.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Breadcrumb'",
    description: 'Names the navigation landmark for screen readers.',
  },
]

export function BreadcrumbsPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Breadcrumbs</PageTitle>
      <PageIntro>
        Shows where the current page sits in the hierarchy, with links back to each level above it.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            {/* Links prevented here so clicking around the playground doesn't leave the page */}
            <Breadcrumbs
              label="Breadcrumb (playground)"
              items={itemsFor(Number(state.depth))}
              renderLink={({ href, children }) => (
                <Link href={href} onClick={(e) => e.preventDefault()}>
                  {children}
                </Link>
              )}
            />
          </Stage>
          <Controls>
            <SelectField
              label="Depth"
              value={state.depth}
              options={depths}
              onChange={set('depth')}
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
        <PropsTable props={breadcrumbProps} />
      </Section>

      <Section>
        <Heading>With a router</Heading>
        <Description>These links really navigate within this docs site.</Description>
        <Preview>
          <Breadcrumbs
            label="Breadcrumb (router example)"
            items={[
              { label: 'Components', href: '/button' },
              { label: 'Navigation', href: '/link' },
              { label: 'Breadcrumbs' },
            ]}
            renderLink={({ href, children }) => (
              <Link as={RouterLink} to={href}>
                {children}
              </Link>
            )}
          />
        </Preview>
        <CodeWrapper>
          <CodeBlock code={routerCode} label="Router code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use breadcrumbs for sites with three or more levels of hierarchy, not for flat sites.
          </li>
          <li>They show location, not history. Don't build them from the pages a user visited.</li>
          <li>Place them at the top of the page, above the page title.</li>
          <li>Keep labels the same as the page titles they link to.</li>
        </Guidelines>
      </Section>
    </>
  )
}

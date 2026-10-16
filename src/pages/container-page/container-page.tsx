import styled from 'styled-components'
import { CodeBlock } from '../../docs/code-block'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Section,
} from '../../docs/page-layout'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { ContainerPlayground } from './container-playground'

const containerProps: PropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
    default: "'lg'",
    description:
      'Maximum width: 640, 768, 1024 or 1280px, or no limit. Includes the gutters, so it lines up with the breakpoints.',
  },
  {
    name: 'gutters',
    type: 'boolean',
    default: 'true',
    description:
      'Side padding of 16px, 24px from 768px and 32px from 1024px, so content never touches the screen edge. Turn off when nesting.',
  },
  {
    name: 'as',
    type: 'ElementType',
    default: "'div'",
    description: "Element to render. Use 'main' for the page's main content, 'section' for parts.",
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as className, id and aria-* are passed through.',
  },
]

const sizeRows = [
  ['sm', '640px', 'Reading and focused tasks: articles, sign-in, single-column forms.'],
  ['md', '768px', 'Settings pages and longer forms.'],
  ['lg', '1024px', 'Default for most app pages.'],
  ['xl', '1280px', 'Dashboards and data-dense pages.'],
  ['full', 'none', 'Edge-to-edge tools like maps, editors or wide tables.'],
]

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  th {
    color: ${({ theme }) => theme.text.muted};
    font-weight: 600;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
`

const TableScroller = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
`

const pageCode = `import { Container } from './components/container'
import { Flex } from './components/flex'

function SettingsPage() {
  return (
    <Container as="main" size="md">
      <Flex direction="column" gap={8}>
        <h1>Settings</h1>
        <Flex as="section" direction="column" gap={4}>
          {/* fields */}
        </Flex>
      </Flex>
    </Container>
  )
}`

export function ContainerPage() {
  return (
    <>
      <PageTitle>Container</PageTitle>
      <PageIntro>
        Centers page content and caps its width, with side padding that grows with the screen.
        Usually the outermost layout component on a page.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the size to see how much of a wide screen the content uses.
        </Description>
        <ContainerPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={containerProps} />
      </Section>

      <Section>
        <Heading>Choosing a size</Heading>
        <TableScroller>
          <SizeTable>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Max width</th>
                <th scope="col">Good for</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.map(([size, width, use]) => (
                <tr key={size}>
                  <td>
                    <code>{size}</code>
                  </td>
                  <td>{width}</td>
                  <td>{use}</td>
                </tr>
              ))}
            </tbody>
          </SizeTable>
        </TableScroller>
      </Section>

      <Section>
        <Heading>With Flex</Heading>
        <Description>
          Container sets the page width once; Flex arranges everything inside it.
        </Description>
        <CodeBlock code={pageCode} label="Page layout code" />
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use one Container per page region, at the outside. Don't nest Containers; inside one,
            use Flex.
          </li>
          <li>
            Pick the size for the content, not the screen. Long lines of text are hard to read, so
            text-heavy pages should use sm or md even on large monitors.
          </li>
          <li>
            Keep gutters on unless an outer element already provides side padding, so content never
            touches the screen edge on phones.
          </li>
          <li>
            Use the same size for pages of the same kind, so content doesn't jump in width as users
            navigate.
          </li>
          <li>
            Backgrounds that should run edge to edge (like a header bar) go outside the Container,
            with a Container inside them for the content.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

import { Link } from 'react-router'
import styled from 'styled-components'
import { Card } from '../../components/card'
import { CodeBlock } from '../../docs/code-block'
import { Description, Grid, Heading, PageIntro, PageTitle, Section } from '../../docs/page-layout'
import { componentPages, navGroups } from '../component-pages'

const installCode = 'yarn add react-ui-components react react-dom styled-components'

const setupCode = `import { Button, Input, UIProvider } from 'react-ui-components'

createRoot(document.getElementById('root')!).render(
  <UIProvider>
    <Input label="Email" type="email" />
    <Button>Save</Button>
  </UIProvider>,
)`

const LinkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.9;
`

export function HomePage() {
  return (
    <>
      <PageTitle>React UI Components</PageTitle>
      <PageIntro>
        Accessible React components with light and dark themes, built with styled-components.{' '}
        {componentPages.length} components, each with a live playground and code you can copy.
      </PageIntro>

      <Section>
        <Heading>Install</Heading>
        <Description>React, React DOM and styled-components are peer dependencies.</Description>
        <CodeBlock code={installCode} label="Terminal" />
      </Section>

      <Section>
        <Heading>Set up</Heading>
        <Description>
          Wrap your app once in UIProvider. It sets up the theme, light and dark colors, and toasts.
        </Description>
        <CodeBlock code={setupCode} label="main.tsx" />
      </Section>

      <Section>
        <Heading>Components</Heading>
        <Grid>
          {navGroups.map(({ group, pages }) => (
            <Card key={group} title={group} titleAs="h3">
              <LinkList>
                {pages.map((page) => (
                  <li key={page.path}>
                    <Link to={`/${page.path}`}>{page.title}</Link>
                  </li>
                ))}
              </LinkList>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  )
}

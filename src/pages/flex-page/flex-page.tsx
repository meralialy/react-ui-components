import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex, FlexItem } from '../../components/flex'
import { Input } from '../../components/input'
import { CodeBlock } from '../../docs/code-block'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Section,
} from '../../docs/page-layout'
import { CodeWrapper } from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { space } from '../../theme/theme'
import { DemoBox } from './demo-box'
import { FlexPlayground } from './flex-playground'

const responsiveNote = 'Responsive: pass { base, sm, md, lg, xl } to change it at breakpoints.'

const flexProps: PropDoc[] = [
  {
    name: 'direction',
    type: "'row' | 'column' | 'row-reverse' | 'column-reverse'",
    default: "'row'",
    description: `Main axis. ${responsiveNote}`,
  },
  {
    name: 'gap',
    type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16',
    description: `Space between children, from the spacing scale (4 = 16px). ${responsiveNote}`,
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
    description: `Cross-axis alignment (align-items). Defaults to the browser's stretch. ${responsiveNote}`,
  },
  {
    name: 'justify',
    type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
    description: `Main-axis distribution (justify-content). ${responsiveNote}`,
  },
  {
    name: 'wrap',
    type: 'boolean',
    default: 'false',
    description: `Let children flow onto new lines when they run out of room. ${responsiveNote}`,
  },
  {
    name: 'grow',
    type: 'boolean | number',
    description: `When this Flex is inside another Flex: take up the remaining space. A number sets its share among other growing items. ${responsiveNote}`,
  },
  {
    name: 'shrink',
    type: 'boolean',
    description: `When inside another Flex: false keeps its natural size when space is tight. ${responsiveNote}`,
  },
  {
    name: 'inline',
    type: 'boolean',
    default: 'false',
    description: 'Render as inline-flex, taking only the width of its content.',
  },
  {
    name: 'as',
    type: 'ElementType',
    default: "'div'",
    description:
      'Element to render. Use ul for lists, nav for navigation, so semantics stay right.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as className, id and aria-* are passed through.',
  },
]

const flexItemProps: PropDoc[] = [
  {
    name: 'grow',
    type: 'boolean | number',
    description: `Take up the remaining space. true = 1; a number sets its share among other growing items. ${responsiveNote}`,
  },
  {
    name: 'shrink',
    type: 'boolean',
    description: `false keeps its natural size when space is tight, e.g. a button next to a long field. ${responsiveNote}`,
  },
  {
    name: 'basis',
    type: 'number | string',
    description: `Starting size along the main axis (flex-basis): width in a row, height in a column. A number is pixels; strings take CSS lengths like '25%'. ${responsiveNote}`,
  },
  {
    name: 'as',
    type: 'ElementType',
    default: "'div'",
    description: "Element to render, e.g. 'li' inside a Flex rendered as 'ul'.",
  },
  {
    name: '...rest',
    type: 'HTMLAttributes',
    description: 'Native attributes such as className, style and aria-* are passed through.',
  },
]

const ScaleRow = styled.div`
  display: grid;
  grid-template-columns: 40px 56px 1fr;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }

  span:nth-child(2) {
    color: ${({ theme }) => theme.text.muted};
  }
`

const ScaleBar = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 12px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.primary.main};
`

const TagList = styled(Flex)`
  margin: 0;
  padding: 0;
  list-style: none;
`

const Tag = styled.span`
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  font-size: 0.8125rem;
`

const Card = styled.div`
  flex: 1;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};

  h3 {
    margin: 0 0 4px;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text.muted};
  }
`

const ToolbarTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`

const formCode = `<Flex as="form" direction="column" gap={4}>
  <Input label="Name" />
  <Input label="Email" type="email" />
  <Flex justify="end" gap={3}>
    <Button variant="outline" color="secondary">Cancel</Button>
    <Button type="submit">Save</Button>
  </Flex>
</Flex>`

export function FlexPage() {
  return (
    <>
      <PageTitle>Flex</PageTitle>
      <PageIntro>
        Lays out children in a row or column with consistent spacing from the theme's scale. The
        building block for most layouts.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the layout update, then copy the generated code.
        </Description>
        <FlexPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={flexProps} />
      </Section>

      <Section>
        <Heading>FlexItem props</Heading>
        <Description>
          Wrap any child of a Flex in FlexItem to control how it grows or shrinks.
        </Description>
        <PropsTable props={flexItemProps} />
      </Section>

      <Section>
        <Heading>Spacing scale</Heading>
        <Description>
          gap takes a key from this scale (in the theme as theme.space), so spacing stays consistent
          across the product.
        </Description>
        <Preview>
          <Flex direction="column" gap={2}>
            {Object.entries(space).map(([key, value]) => (
              <ScaleRow key={key}>
                <code>{key}</code>
                <span>{value}</span>
                <ScaleBar $width={value} />
              </ScaleRow>
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Toolbar</Heading>
        <Description>justify="between" pushes the title and actions to opposite ends.</Description>
        <Preview>
          <Flex justify="between" align="center" gap={4} wrap>
            <ToolbarTitle>Invoices</ToolbarTitle>
            <Flex gap={2}>
              <Button variant="outline" color="secondary" size="sm">
                Export
              </Button>
              <Button size="sm">New invoice</Button>
            </Flex>
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Growing items</Heading>
        <Description>
          FlexItem grow makes the field take all the room the button doesn't need.
        </Description>
        <Preview>
          <Flex gap={2} align="end">
            <FlexItem grow>
              <Input label="Search" hideLabel placeholder="Search invoices" />
            </FlexItem>
            <Button>Search</Button>
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Form layout</Heading>
        <Description>
          A column with gap={4} between fields, and a row of actions aligned to the end.
        </Description>
        <Preview>
          <Flex as="form" direction="column" gap={4} onSubmit={(e) => e.preventDefault()}>
            <Input label="Name" />
            <Input label="Email" type="email" />
            <Flex justify="end" gap={3}>
              <Button variant="outline" color="secondary">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Flex>
          </Flex>
        </Preview>
        <CodeWrapper>
          <CodeBlock code={formCode} label="Form layout code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Responsive</Heading>
        <Description>
          {"direction={{ base: 'column', md: 'row' }}"}: cards stack on phones and sit side by side
          from 768px. Resize the window to see it.
        </Description>
        <Preview>
          <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 4 }}>
            <Card>
              <h3>Starter</h3>
              <p>For individuals getting started.</p>
            </Card>
            <Card>
              <h3>Team</h3>
              <p>Collaboration for small teams.</p>
            </Card>
            <Card>
              <h3>Business</h3>
              <p>Advanced controls and support.</p>
            </Card>
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Wrapping</Heading>
        <Description>
          wrap lets items flow onto new lines, keeping the same gap both ways.
        </Description>
        <Preview>
          <TagList forwardedAs="ul" wrap gap={2}>
            {['Design', 'Accessibility', 'React', 'TypeScript', 'Testing', 'Performance'].map(
              (tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ),
            )}
          </TagList>
        </Preview>
      </Section>

      <Section>
        <Heading>Alignment</Heading>
        <Preview>
          <Flex gap={3} align="center">
            <DemoBox>1</DemoBox>
            <DemoBox $tall>2</DemoBox>
            <DemoBox>3</DemoBox>
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            There's deliberately no margin prop: spacing between things belongs to their parent's
            gap, so components look right wherever they're reused.
          </li>
          <li>
            Space things with gap, not margins on the children. Gap only adds space between items,
            so there's no stray margin at the ends and children stay reusable anywhere.
          </li>
          <li>
            Stick to the spacing scale. Smaller gaps (1–3) group related items; larger gaps (6+)
            separate sections. That contrast is what makes a layout readable.
          </li>
          <li>
            Use as to keep the right semantics: a list of items should still be a ul, navigation a
            nav.
          </li>
          <li>
            Don't use row-reverse or column-reverse to reorder content: screen readers and keyboard
            focus follow the code order, not the visual one.
          </li>
          <li>
            Flex is for one direction. For two-dimensional layouts like card grids, use CSS grid.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

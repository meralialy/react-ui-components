import { SplitButton } from '../../components/split-button'
import type { ButtonSize, ButtonVariant } from '../../components/button'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Row,
  RowLabel,
  Section,
} from '../../docs/page-layout'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { colorNames } from '../../theme/theme'
import { SplitButtonPlayground } from './split-button-playground'

const variants: ButtonVariant[] = ['solid', 'outline', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const noop = () => {}
const demoActions = [
  { label: 'Save as draft', onSelect: noop },
  { label: 'Save and close', onSelect: noop },
]

const splitButtonProps: PropDoc[] = [
  {
    name: 'children',
    required: true,
    type: 'ReactNode',
    description: 'Label of the main action: the one most people want, most of the time.',
  },
  {
    name: 'onClick',
    type: '(e: MouseEvent) => void',
    description: 'Runs the main action.',
  },
  {
    name: 'actions',
    required: true,
    type: 'SplitButtonAction[]',
    description: 'Related, less common actions shown in the menu. See the table below.',
  },
  {
    name: 'menuLabel',
    type: 'string',
    default: "'More actions'",
    description:
      'Accessible name for the arrow toggle, which has no visible text. Make it specific if there are several on a page, e.g. "More save options".',
  },
  {
    name: 'align',
    type: "'start' | 'end'",
    default: "'end'",
    description:
      'Edge the menu lines up with. Use end near the right of the screen, start near the left. The menu opens upward automatically if there is no room below.',
  },
  {
    name: 'color',
    type: colorNames.map((c) => `'${c}'`).join(' | '),
    default: "'primary'",
    description: 'Same as Button. Applies to both halves.',
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'ghost'",
    default: "'solid'",
    description: 'Same as Button. Applies to both halves.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Same as Button. The toggle stays square at every size.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Shows a spinner on the main action and disables the menu until it finishes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables both the main action and the menu.',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description: 'Icon before the main label.',
  },
]

const actionProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'string',
    description: 'A short verb phrase. Also used for type-ahead, so start with a distinct word.',
  },
  {
    name: 'onSelect',
    required: true,
    type: '() => void',
    description: 'Runs when the action is chosen. The menu closes and focus returns first.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Optional icon before the label. Use icons on all actions or none.',
  },
  {
    name: 'danger',
    type: 'boolean',
    default: 'false',
    description: 'Shows the action in red, for destructive actions like Delete.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Greys the action out but keeps it focusable, so keyboard and screen reader users know it exists.',
  },
]

export function SplitButtonPage() {
  return (
    <>
      <PageTitle>Split button</PageTitle>
      <PageIntro>
        A main action with a menu of related actions, like Save with "Save as draft" and "Save and
        close". Keeps the common choice one click away without hiding the alternatives.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Click the main action or open the menu. With the keyboard, focus the arrow and press Down,
          then use arrows, Home/End, a letter, or Escape.
        </Description>
        <SplitButtonPlayground />
      </Section>

      <Section>
        <Heading>SplitButton props</Heading>
        <PropsTable props={splitButtonProps} />
      </Section>

      <Section>
        <Heading>Action props</Heading>
        <PropsTable props={actionProps} />
      </Section>

      <Section>
        <Heading>Colors &amp; variants</Heading>
        <Preview>
          {variants.map((variant) => (
            <Row key={variant}>
              <RowLabel>{capitalize(variant)}</RowLabel>
              {colorNames.slice(0, 4).map((color) => (
                <SplitButton key={color} color={color} variant={variant} actions={demoActions}>
                  {capitalize(color)}
                </SplitButton>
              ))}
            </Row>
          ))}
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes &amp; states</Heading>
        <Preview>
          <Row>
            {sizes.map((size) => (
              <SplitButton key={size} size={size} actions={demoActions}>
                Size {size}
              </SplitButton>
            ))}
          </Row>
          <Row>
            <SplitButton actions={demoActions} disabled>
              Disabled
            </SplitButton>
            <SplitButton actions={demoActions} loading>
              Loading
            </SplitButton>
            <SplitButton
              variant="outline"
              color="secondary"
              align="start"
              actions={[
                { label: 'Export as CSV', onSelect: noop },
                { label: 'Export as PDF', onSelect: noop },
                { label: 'Delete report', onSelect: noop, danger: true },
              ]}
            >
              Export
            </SplitButton>
          </Row>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use a split button when one action is clearly the most common and the others are
            variations of it (Save → Save as draft). If the actions are unrelated, use separate
            buttons or a plain menu.
          </li>
          <li>
            Never make a destructive action the main one. Put it last in the menu, marked as danger.
          </li>
          <li>Keep the menu short, roughly 2–7 actions, ordered by how often they're used.</li>
          <li>Label actions with verbs and keep them as short and parallel as the main label.</li>
          <li>
            If the actions are important for most users, show them as visible buttons instead. Items
            in a menu are easy to miss.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

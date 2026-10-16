import { Button } from '../../components/button'
import type { ButtonSize, ButtonVariant } from '../../components/button'
import {
  Description,
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
import { ButtonPlayground } from './button-playground'
import { PlusIcon } from '../../components/icon'

const variants: ButtonVariant[] = ['solid', 'outline', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const buttonProps: PropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'The button label. Keep it a short verb phrase, e.g. "Save changes".',
  },
  {
    name: 'color',
    type: colorNames.map((c) => `'${c}'`).join(' | '),
    default: "'primary'",
    description: 'Conveys intent. Use one primary action per view; danger for destructive actions.',
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'ghost'",
    default: "'solid'",
    description:
      'Visual emphasis. Solid for the main action, outline for secondary, ghost for low-priority.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height of 32, 40 or 48px. Prefer md or lg on touch screens.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description:
      'Shows a spinner and ignores clicks, keeping its width. Stays focusable (aria-disabled, aria-busy) so keyboard users don’t lose their place.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction. Prefer explaining why an action is unavailable.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Stretches to fill its container, e.g. in forms or on mobile.',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description: 'Icon before the label. Mark decorative icons aria-hidden.',
  },
  {
    name: 'endIcon',
    type: 'ReactNode',
    description: 'Icon after the label, e.g. a chevron for "Next".',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description: 'Set to submit inside forms. Defaults to button to avoid accidental submits.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLButtonElement>',
    description: 'Forwarded to the <button>, e.g. to focus it or anchor a popover.',
  },
  {
    name: '...rest',
    type: 'ButtonHTMLAttributes',
    description: 'Any native button attribute (onClick, aria-label, form, etc.) is passed through.',
  },
]

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function ButtonPage() {
  return (
    <>
      <PageTitle>Button</PageTitle>
      <PageIntro>Triggers an action, such as submitting a form or opening a dialog.</PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the button update live, then copy the generated code.
        </Description>
        <ButtonPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={buttonProps} />
      </Section>

      <Section>
        <Heading>Colors &amp; variants</Heading>
        <Preview>
          {variants.map((variant) => (
            <Row key={variant}>
              <RowLabel>{capitalize(variant)}</RowLabel>
              {colorNames.map((color) => (
                <Button key={color} color={color} variant={variant}>
                  {capitalize(color)}
                </Button>
              ))}
            </Row>
          ))}
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          <Row>
            {sizes.map((size) => (
              <Button key={size} size={size}>
                Size {size}
              </Button>
            ))}
          </Row>
        </Preview>
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          {variants.map((variant) => (
            <Row key={variant}>
              <RowLabel>{capitalize(variant)}</RowLabel>
              <Button variant={variant}>Default</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
              <Button variant={variant} loading>
                Loading
              </Button>
            </Row>
          ))}
        </Preview>
      </Section>

      <Section>
        <Heading>With icons</Heading>
        <Preview>
          <Row>
            <Button startIcon={<PlusIcon />}>Add item</Button>
            <Button variant="outline" endIcon={<PlusIcon />}>
              Add item
            </Button>
          </Row>
        </Preview>
      </Section>

      <Section>
        <Heading>Full width</Heading>
        <Preview>
          <Button fullWidth>Continue</Button>
        </Preview>
      </Section>
    </>
  )
}

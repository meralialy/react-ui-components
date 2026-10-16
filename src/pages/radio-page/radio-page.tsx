import { Radio, RadioGroup } from '../../components/radio'
import type { RadioSize } from '../../components/radio'
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
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { FormExample } from './form-example'
import { RadioPlayground } from './radio-playground'

const sizes: RadioSize[] = ['sm', 'md', 'lg']

const groupProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'The question the options answer. Rendered as the fieldset legend.',
  },
  {
    name: 'children',
    required: true,
    type: 'ReactNode',
    description: 'The Radio options.',
  },
  {
    name: 'value',
    type: 'string',
    description: "Selected value (controlled). Use '' for no selection. Pair with onChange.",
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initially selected value when uncontrolled.',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    description: 'Called with the newly selected value.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Shared by every radio in the group. Generated if omitted; set it for native form submission.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Guidance for the whole group.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Group error, e.g. "Choose a delivery option". Marks every option aria-invalid and replaces the helper text.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Sets the size of every option in the group.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description:
      'Hides the label visually but keeps it for screen readers, when a nearby heading names the group.',
  },
  {
    name: 'orientation',
    type: "'vertical' | 'horizontal'",
    default: "'vertical'",
    description: 'Stack options or lay them in a wrapping row. Vertical scans faster.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description:
      'Shows an asterisk and sets native required on the radios, so a choice is needed to submit.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables every option.',
  },
]

const radioProps: PropDoc[] = [
  {
    name: 'value',
    required: true,
    type: 'string',
    description: 'Identifies this option. Passed to the group onChange when selected.',
  },
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Text next to the circle. Clicking it selects the option too.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Describes this option, e.g. a price or delivery time.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables just this option. Explain why nearby if it isn’t obvious.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description: 'Hides the label visually but keeps it for screen readers.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description: 'Forwarded to the native <input type="radio">, e.g. to focus it.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes',
    description:
      'Other native attributes are passed through. Inside a group, name, checked and required come from the group.',
  },
]

export function RadioPage() {
  return (
    <>
      <PageTitle>Radio</PageTitle>
      <PageIntro>
        Lets users choose exactly one option from a short list. Always used inside a RadioGroup.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the group update live, then copy the generated code. Use the
          arrow keys to move between options.
        </Description>
        <RadioPlayground />
      </Section>

      <Section>
        <Heading>RadioGroup props</Heading>
        <PropsTable props={groupProps} />
      </Section>

      <Section>
        <Heading>Radio props</Heading>
        <PropsTable props={radioProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <RadioGroup label="Default" defaultValue="b">
              <Radio value="a" label="Unselected" />
              <Radio value="b" label="Selected" />
              <Radio value="c" label="Disabled option" disabled />
            </RadioGroup>
            <RadioGroup label="Disabled group" defaultValue="b" disabled>
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
            </RadioGroup>
            <RadioGroup label="Error" required error="Choose an option to continue.">
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
            </RadioGroup>
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <RadioGroup key={size} label={`Size ${size}`} size={size} defaultValue="a">
                <Radio value="a" label="Option A" />
                <Radio value="b" label="Option B" />
              </RadioGroup>
            ))}
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Option descriptions</Heading>
        <Description>
          Use helperText on each Radio when options differ in ways the label can't say.
        </Description>
        <Preview>
          <RadioGroup label="Delivery" defaultValue="standard">
            <Radio value="standard" label="Standard" helperText="3–5 business days · Free" />
            <Radio value="express" label="Express" helperText="1–2 business days · $9.99" />
            <Radio
              value="same-day"
              label="Same day"
              helperText="Not available for your postcode"
              disabled
            />
          </RadioGroup>
        </Preview>
      </Section>

      <Section>
        <Heading>Horizontal</Heading>
        <Description>For two or three short options, like yes/no.</Description>
        <Preview>
          <RadioGroup label="Do you have a referral code?" orientation="horizontal">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </Preview>
      </Section>

      <Section>
        <Heading>Form validation</Heading>
        <Description>
          Submit without choosing to see the error. Focus moves to the group.
        </Description>
        <Preview>
          <FormExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use radios when exactly one option must be chosen and all options fit on screen. For
            many options (roughly 7+), use a select. For any number of choices, use checkboxes.
          </li>
          <li>
            Preselect the safest or most common option when there is one. Leave none selected only
            when choosing must be a deliberate act, and then mark the group required.
          </li>
          <li>
            Once selected, a radio group can't be cleared. If "none" is a valid answer, add it as an
            option.
          </li>
          <li>Order options logically: by frequency, size, or a natural sequence.</li>
          <li>
            Keep labels short and parallel. Put extra detail, like prices, in each option's
            helperText.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

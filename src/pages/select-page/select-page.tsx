import styled from 'styled-components'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Select } from '../../components/select'
import type { SelectSize } from '../../components/select'
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
import { SelectPlayground } from './select-playground'

const sizes: SelectSize[] = ['sm', 'md', 'lg']

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const selectProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Visible label above the field. The placeholder is not a substitute.',
  },
  {
    name: 'options',
    type: '{ value: string; label: string; disabled?: boolean }[]',
    description: 'The choices. For grouped options, pass <optgroup> and <option> children instead.',
  },
  {
    name: 'value',
    type: 'string',
    description: "Selected value (controlled). Use '' for nothing selected. Pair with onChange.",
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLSelectElement>) => void',
    description: 'Fires when the selection changes. Read the new value from e.target.value.',
  },
  {
    name: 'placeholder',
    type: 'string',
    description:
      'Shown while nothing is selected. Can be re-selected to clear an optional field; not selectable once required.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Guidance below the field. Linked via aria-describedby.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Puts the field in an error state, sets aria-invalid and replaces the helper text.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height of 32, 40 or 48px, matching Input and Button.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description: 'Hides the label visually but keeps it for screen readers.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Marks the label with an asterisk and sets the native required attribute.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLSelectElement>',
    description: 'Forwarded to the native <select>, e.g. to focus it.',
  },
  {
    name: '...rest',
    type: 'SelectHTMLAttributes',
    description:
      'Native attributes such as name, defaultValue and autoComplete are passed through.',
  },
]

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px;

  > :not(button) {
    flex: 1 1 160px;
  }
`

const NarrowField = styled.div`
  max-width: 360px;
`

export function SelectPage() {
  return (
    <>
      <PageTitle>Select</PageTitle>
      <PageIntro>
        Lets users choose one option from a list that's too long to show as radio buttons.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the select update live, then copy the generated code.
        </Description>
        <SelectPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={selectProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <Select label="Placeholder" placeholder="Choose a fruit" options={fruit} />
            <Select label="Selected" options={fruit} defaultValue="banana" />
            <Select
              label="With helper text"
              placeholder="Choose a fruit"
              helperText="Pick your favourite."
              options={fruit}
            />
            <Select
              label="Error"
              placeholder="Choose a fruit"
              error="Select a fruit to continue."
              options={fruit}
            />
            <Select label="Required" placeholder="Choose a fruit" required options={fruit} />
            <Select label="Disabled" options={fruit} defaultValue="apple" disabled />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Description>Heights match Input and Button, so they line up in a row.</Description>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <Select key={size} label={`Size ${size}`} size={size} options={fruit} />
            ))}
          </Grid>
          <FieldRow>
            <Input label="Search" placeholder="Search orders" />
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'open', label: 'Open' },
                { value: 'shipped', label: 'Shipped' },
              ]}
            />
            <Button>Apply</Button>
          </FieldRow>
        </Preview>
      </Section>

      <Section>
        <Heading>Option groups</Heading>
        <Description>
          For long lists with natural categories, pass optgroup children instead of options.
        </Description>
        <Preview>
          <NarrowField>
            <Select label="Time zone" placeholder="Select a time zone">
              <optgroup label="Europe">
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Europe/Athens">Athens (EET)</option>
              </optgroup>
              <optgroup label="Americas">
                <option value="America/New_York">New York (ET)</option>
                <option value="America/Chicago">Chicago (CT)</option>
                <option value="America/Los_Angeles">Los Angeles (PT)</option>
              </optgroup>
            </Select>
          </NarrowField>
        </Preview>
      </Section>

      <Section>
        <Heading>Form validation</Heading>
        <Description>
          Submit without choosing to see the error. Focus moves to the select.
        </Description>
        <Preview>
          <FormExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            For roughly 2–6 options, use radio buttons instead: users can compare every option
            without opening anything.
          </li>
          <li>
            Order options in a way users expect: alphabetically, numerically, or by frequency. Put a
            common default first only if it really is the most likely answer.
          </li>
          <li>
            Use a placeholder like "Select a country" when there's no sensible default, but never
            instead of a label.
          </li>
          <li>
            Don't trigger actions or navigation on change. Users expect to confirm their choice, and
            keyboard users move through options one at a time.
          </li>
          <li>
            For very long lists users would rather type into (like all countries in the world),
            consider a searchable combobox.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

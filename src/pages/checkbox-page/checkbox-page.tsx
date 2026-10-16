import { Checkbox, CheckboxGroup } from '../../components/checkbox'
import type { CheckboxSize } from '../../components/checkbox'
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
import { CheckboxPlayground } from './checkbox-playground'
import { FormExample } from './form-example'
import { SelectAllExample } from './select-all-example'

const sizes: CheckboxSize[] = ['sm', 'md', 'lg']

const checkboxProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Text next to the box. Clicking it toggles the checkbox too.',
  },
  {
    name: 'checked',
    type: 'boolean',
    description: 'Controlled checked state. Pair with onChange, or use defaultChecked instead.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLInputElement>) => void',
    description: 'Fires on toggle. Read the new state from e.target.checked.',
  },
  {
    name: 'value',
    type: 'string',
    description:
      'Identifies this option inside a CheckboxGroup that manages selection. Also submitted with the form.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Extra context below the label. Linked via aria-describedby.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Puts the checkbox in an error state, sets aria-invalid and replaces the helper text.',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description:
      'Shows a dash for a partial selection, e.g. a "select all" parent. Visual only; you still control checked.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description:
      'Box of 16, 20 or 24px with matching label text. Inside a CheckboxGroup, the group sets it.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description:
      'Hides the label visually but keeps it for screen readers, e.g. row selection in a table.',
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
    type: 'Ref<HTMLInputElement>',
    description: 'Forwarded to the native <input type="checkbox">.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes',
    description: 'Native attributes such as name, value and defaultChecked are passed through.',
  },
]

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
    description: 'The Checkbox components in the group.',
  },
  {
    name: 'value',
    type: 'string[]',
    description:
      'Checked values (controlled). Pair with onChange. Each Checkbox needs a value for this to work.',
  },
  {
    name: 'defaultValue',
    type: 'string[]',
    description: 'Initially checked values when uncontrolled.',
  },
  {
    name: 'onChange',
    type: '(value: string[]) => void',
    description: 'Called with the new array of checked values.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Shared by every checkbox in the group, for native form submission.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Guidance for the whole group, e.g. "Select all that apply".',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Group-level error, e.g. "Choose at least one". Marks every option aria-invalid and replaces the helper text.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Sets the size of every checkbox in the group.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables every checkbox in the group.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description:
      'Shows an asterisk and tells screen readers the group is required. Enforce the rule in your own validation.',
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
]

export function CheckboxPage() {
  return (
    <>
      <PageTitle>Checkbox</PageTitle>
      <PageIntro>
        Lets users turn an option on or off, or pick any number of options from a list.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Switch between a CheckboxGroup and a single Checkbox, change the props, then copy the
          generated code.
        </Description>
        <CheckboxPlayground />
      </Section>

      <Section>
        <Heading>Checkbox props</Heading>
        <PropsTable props={checkboxProps} />
      </Section>

      <Section>
        <Heading>CheckboxGroup props</Heading>
        <PropsTable props={groupProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
            <Checkbox label="Required" required />
            <Checkbox label="With helper text" helperText="Shown below the label." />
            <Checkbox label="Error" error="This option is required." />
            <Checkbox label="Error checked" defaultChecked error="Can't combine with trial." />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <Checkbox key={size} size={size} label={`Size ${size}`} defaultChecked />
            ))}
          </Grid>
          <Checkbox
            label="Long labels wrap and the box stays aligned with the first line. Keep labels short where you can, but when they can't be, this is how they behave."
            defaultChecked
          />
        </Preview>
      </Section>

      <Section>
        <Heading>Groups</Heading>
        <Preview>
          <Grid>
            <CheckboxGroup
              label="Dietary needs"
              helperText="Select all that apply."
              defaultValue={['gluten-free']}
            >
              <Checkbox value="vegetarian" label="Vegetarian" />
              <Checkbox value="vegan" label="Vegan" />
              <Checkbox value="gluten-free" label="Gluten-free" />
            </CheckboxGroup>
            <CheckboxGroup
              label="Days available"
              orientation="horizontal"
              defaultValue={['mon', 'wed']}
            >
              <Checkbox value="mon" label="Mon" />
              <Checkbox value="tue" label="Tue" />
              <Checkbox value="wed" label="Wed" />
              <Checkbox value="thu" label="Thu" />
              <Checkbox value="fri" label="Fri" />
            </CheckboxGroup>
            <CheckboxGroup label="Disabled group" disabled defaultValue={['a']}>
              <Checkbox value="a" label="Option A" />
              <Checkbox value="b" label="Option B" />
            </CheckboxGroup>
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Select all</Heading>
        <Description>
          The parent shows a dash when only some children are checked. Try it.
        </Description>
        <Preview>
          <SelectAllExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Form validation</Heading>
        <Description>
          Submit without choosing to see a group error and a single-checkbox error.
        </Description>
        <Preview>
          <FormExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use checkboxes for independent on/off choices, or to pick any number from a list. For
            exactly one choice, use radio buttons.
          </li>
          <li>
            Label the positive action ("Send me updates"), not the negative ("Don't send me
            updates"), so checked always means yes.
          </li>
          <li>
            A checkbox should only change a setting when a form is submitted. For changes that apply
            instantly, use a switch.
          </li>
          <li>
            Wrap related checkboxes in a CheckboxGroup so screen readers announce the question along
            with each option.
          </li>
          <li>
            Don't pre-check options that benefit you rather than the user, such as marketing
            consent.
          </li>
          <li>List options vertically, one per line, in a logical order. It's faster to scan.</li>
        </Guidelines>
      </Section>
    </>
  )
}

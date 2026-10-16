import styled from 'styled-components'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import type { InputSize } from '../../components/input'
import { MailIcon, SearchIcon } from '../../components/icon'
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
import { InputPlayground } from './input-playground'

const sizes: InputSize[] = ['sm', 'md', 'lg']

const inputProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description:
      'Visible label above the field. Always provide one; placeholders are not a substitute.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description:
      'Guidance shown below the field, such as format hints. Linked via aria-describedby.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Puts the field in an error state, sets aria-invalid and replaces the helper text. Say how to fix it, not just what is wrong.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height of 32, 40 or 48px, matching Button so they line up side by side.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description:
      'Hides the label visually but keeps it for screen readers. Only when context makes the purpose obvious, e.g. search.',
  },
  {
    name: 'startAdornment',
    type: 'ReactNode',
    description: 'Icon or text inside the field before the value, e.g. a search icon or "$".',
  },
  {
    name: 'endAdornment',
    type: 'ReactNode',
    description: 'Icon or text inside the field after the value, e.g. a unit like "kg".',
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
    description: 'Prevents interaction and excludes the value from form submission.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Value can be selected and copied but not edited, and is still submitted.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description: 'Forwarded to the <input>, e.g. to focus it or for form libraries.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes',
    description:
      'Any native input attribute (type, value, onChange, name, autoComplete, etc.) is passed to the <input>.',
  },
]

const SearchRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 480px;
`

export function InputPage() {
  return (
    <>
      <PageTitle>Input</PageTitle>
      <PageIntro>
        A single-line text field with a label, optional helper text and an error state.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the input update live, then copy the generated code. Type
          into the error field to see the error state.
        </Description>
        <InputPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={inputProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <Input label="Default" placeholder="Placeholder text" />
            <Input label="With helper text" helperText="Use 8 or more characters." />
            <Input
              label="Error"
              defaultValue="jane@"
              error="Enter an email address like name@example.com."
            />
            <Input label="Required" required helperText="Asterisk marks required fields." />
            <Input label="Disabled" defaultValue="Can't change this" disabled />
            <Input label="Read-only" defaultValue="INV-2041" readOnly />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Description>Heights match Button, so fields and actions align in a row.</Description>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <Input key={size} label={`Size ${size}`} size={size} placeholder="Placeholder" />
            ))}
          </Grid>
          <SearchRow>
            <Input
              label="Search components"
              hideLabel
              type="search"
              placeholder="Search components"
              startAdornment={<SearchIcon />}
            />
            <Button>Search</Button>
          </SearchRow>
        </Preview>
      </Section>

      <Section>
        <Heading>Adornments</Heading>
        <Preview>
          <Grid>
            <Input label="Email" type="email" startAdornment={<MailIcon />} />
            <Input label="Price" inputMode="decimal" startAdornment="$" endAdornment="USD" />
            <Input label="Weight" inputMode="decimal" endAdornment="kg" />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Form validation</Heading>
        <Description>
          Submit empty to see errors. Focus moves to the first invalid field, and errors clear as
          you fix them.
        </Description>
        <Preview>
          <FormExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Always give a visible label. Placeholder text disappears on typing and is often too
            faint to read.
          </li>
          <li>
            Validate on submit or when the user leaves a field, not on every keystroke before they
            finish.
          </li>
          <li>
            Write errors that say how to fix the problem: "Enter a date like 31/12/2026", not
            "Invalid date".
          </li>
          <li>
            Use the right <code>type</code>, <code>inputMode</code> and <code>autoComplete</code> so
            mobile keyboards and autofill help users.
          </li>
          <li>
            Size the field to its expected content; a postcode field shouldn't span the whole page.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

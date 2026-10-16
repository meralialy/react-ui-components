import { Toggle } from '../../components/toggle'
import type { ToggleSize } from '../../components/toggle'
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
import { SettingsExample } from './settings-example'
import { TogglePlayground } from './toggle-playground'

const sizes: ToggleSize[] = ['sm', 'md', 'lg']

const toggleProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Names the setting, e.g. "Email notifications". Clicking it flips the toggle too.',
  },
  {
    name: 'checked',
    type: 'boolean',
    description: 'On or off (controlled). Pair with onChange, or use defaultChecked instead.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLInputElement>) => void',
    description: 'Fires when flipped. Read the new state from e.target.checked.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description: 'Explains what the setting does. Linked via aria-describedby.',
  },
  {
    name: 'labelPlacement',
    type: "'start' | 'end'",
    default: "'end'",
    description:
      "'start' puts the label first and the switch at the far edge, as in settings lists.",
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Track of 28×16, 36×20 or 44×24px with matching label text.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description: 'Hides the label visually but keeps it for screen readers.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction. Explain nearby why the setting is unavailable.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description: 'Forwarded to the native <input type="checkbox" role="switch">.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes',
    description: 'Native attributes such as name and defaultChecked are passed through.',
  },
]

export function TogglePage() {
  return (
    <>
      <PageTitle>Toggle</PageTitle>
      <PageIntro>
        Turns a setting on or off, taking effect immediately. Screen readers announce it as a
        switch.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below to see the toggle update live, then copy the generated code.
        </Description>
        <TogglePlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={toggleProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <Toggle label="Off" />
            <Toggle label="On" defaultChecked />
            <Toggle label="Disabled off" disabled />
            <Toggle label="Disabled on" disabled defaultChecked />
            <Toggle label="With helper text" helperText="Explains what this controls." />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <Toggle key={size} size={size} label={`Size ${size}`} defaultChecked />
            ))}
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Settings list</Heading>
        <Description>
          With labelPlacement="start", labels line up on the left and switches on the right. Each
          change applies straight away, with a short confirmation.
        </Description>
        <Preview>
          <SettingsExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use a toggle when the change takes effect immediately. If the choice is only applied
            when a form is submitted, use a checkbox.
          </li>
          <li>
            Label the setting, not the action: "Email notifications", not "Turn on email
            notifications". The switch itself shows on or off.
          </li>
          <li>
            Don't add "On/Off" text next to the switch or change the label with the state; it makes
            users unsure whether the label shows the current state or what will happen.
          </li>
          <li>
            Confirm changes that save to a server, and if saving fails, flip the toggle back and say
            why.
          </li>
          <li>
            For choices between two named options ("List / Grid"), use radio buttons or a segmented
            control, not a toggle.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Tabs } from '../../components/tabs'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, TextField } from '../../docs/form-controls'
import { jsxElement, jsxString } from '../../docs/jsx'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Section,
} from '../../docs/page-layout'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

type State = { label: string; fullWidth: boolean; disableOne: boolean }
const defaults: State = { label: 'Account settings', fullWidth: false, disableOne: false }

function buildCode(state: State) {
  const items = [
    "    { value: 'profile', label: 'Profile', content: <ProfileForm /> },",
    "    { value: 'security', label: 'Security', content: <SecuritySettings /> },",
    `    { value: 'billing', label: 'Billing', content: <BillingSettings />${state.disableOne ? ', disabled: true' : ''} },`,
  ]
  const props = [jsxString('label', state.label), ['items={[', ...items, '  ]}'].join('\n')]
  if (state.fullWidth) props.push('fullWidth')
  return [
    "import { Tabs } from './components/tabs'",
    '',
    '// Your panel content',
    'const ProfileForm = () => <p>Profile</p>',
    'const SecuritySettings = () => <p>Security</p>',
    'const BillingSettings = () => <p>Billing</p>',
    '',
    jsxElement('Tabs', props),
  ].join('\n')
}

const tabsProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'string',
    description: 'Names the tab list for screen readers, e.g. "Account settings".',
  },
  {
    name: 'items',
    required: true,
    type: '{ value; label; content; icon?; disabled? }[]',
    description:
      'The tabs and their panels. Panels stay mounted when hidden, so form input is kept.',
  },
  {
    name: 'value / onChange',
    type: 'string / (value) => void',
    description: 'Controlled mode, e.g. to keep the tab in the URL.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initially selected tab. Defaults to the first enabled one.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Tabs share the full width equally.',
  },
]

const FullWidth = styled.div`
  width: 100%;
`

export function TabsPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Tabs</PageTitle>
      <PageIntro>
        Switches between panels of related content on the same page. Arrow keys move between tabs;
        Tab moves into the panel.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <FullWidth>
              <Tabs
                label={state.label}
                fullWidth={state.fullWidth}
                items={[
                  {
                    value: 'profile',
                    label: 'Profile',
                    content: <Input label="Display name" defaultValue="Ada Lovelace" />,
                  },
                  {
                    value: 'security',
                    label: 'Security',
                    content: <p>Two-factor authentication is on.</p>,
                  },
                  {
                    value: 'billing',
                    label: 'Billing',
                    content: <p>Next invoice on 1 November.</p>,
                    disabled: state.disableOne,
                  },
                ]}
              />
            </FullWidth>
          </Stage>
          <Controls>
            <TextField label="label" value={state.label} onChange={set('label')} />
            <Options>
              <legend>Options</legend>
              <CheckboxField
                label="fullWidth"
                checked={state.fullWidth}
                onChange={set('fullWidth')}
              />
              <CheckboxField
                label="Disable a tab"
                checked={state.disableOne}
                onChange={set('disableOne')}
              />
            </Options>
          </Controls>
          <PlaygroundFooter>
            <Button size="sm" variant="ghost" color="secondary" onClick={() => setState(defaults)}>
              Reset
            </Button>
          </PlaygroundFooter>
        </PlaygroundCard>
        <CodeWrapper>
          <CodeBlock code={buildCode(state)} label="Generated code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={tabsProps} />
      </Section>

      <Section>
        <Heading>Many tabs</Heading>
        <Description>
          When tabs don't fit, the list scrolls sideways instead of wrapping.
        </Description>
        <Preview>
          <Tabs
            label="Report sections"
            items={[
              'Overview',
              'Revenue',
              'Customers',
              'Retention',
              'Acquisition',
              'Support',
              'Forecast',
            ].map((name) => ({
              value: name.toLowerCase(),
              label: name,
              content: <p>{name} details.</p>,
            }))}
          />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Tabs switch between views of the same thing. If each tab is really a different page, use
            links in the navigation instead.
          </li>
          <li>
            Tabs vs Segmented control: tabs swap whole panels of content; a segmented control
            changes one setting, like a view mode, for content that stays put.
          </li>
          <li>Keep labels to one or two words, and don't make people compare across tabs.</li>
          <li>Keep the tab in the URL for important views, so links and the back button work.</li>
        </Guidelines>
      </Section>
    </>
  )
}

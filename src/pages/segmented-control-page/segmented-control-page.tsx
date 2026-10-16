import { SegmentedControl } from '../../components/segmented-control'
import type { SegmentedControlSize } from '../../components/segmented-control'
import {
  Description,
  Guidelines,
  Heading,
  PageIntro,
  PageTitle,
  Preview,
  Row,
  Section,
} from '../../docs/page-layout'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { BoardIcon, GridIcon, ListIcon } from './icons'
import { SegmentedControlPlayground } from './segmented-control-playground'
import { ViewSwitcherExample } from './view-switcher-example'

const sizes: SegmentedControlSize[] = ['sm', 'md', 'lg']

const periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const props: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Names the choice, e.g. "View". Rendered as the fieldset legend.',
  },
  {
    name: 'options',
    required: true,
    type: '{ value: string; label: string; icon?: ReactNode; disabled?: boolean }[]',
    description: 'The segments, in order. Keep to 2–5 with short labels.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Selected value (controlled). Pair with onChange.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initially selected value when uncontrolled. Defaults to the first option.',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    description: 'Called with the newly selected value.',
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    default: 'false',
    description:
      'Hides the label visually but keeps it for screen readers, when a nearby heading makes the purpose clear.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height of 32, 40 or 48px, matching Button and Input.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Stretches to the container with equal-width segments.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    default: 'false',
    description:
      'Shows only icons. Option labels are still read by screen readers and shown as tooltips.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables every segment.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Shared by the underlying radios. Set it to submit the value with a form.',
  },
]

export function SegmentedControlPage() {
  return (
    <>
      <PageTitle>Segmented control</PageTitle>
      <PageIntro>
        Picks one of a few options shown side by side, like List / Grid or Day / Week / Month.
        Usually switches a view immediately.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below, then copy the generated code. Tab in, then use arrow keys to move
          the selection.
        </Description>
        <SegmentedControlPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={props} />
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          {sizes.map((size) => (
            <Row key={size}>
              <SegmentedControl label={`Size ${size}`} size={size} options={periods} />
            </Row>
          ))}
        </Preview>
      </Section>

      <Section>
        <Heading>With icons</Heading>
        <Preview>
          <Row>
            <SegmentedControl
              label="Layout"
              options={[
                { value: 'list', label: 'List', icon: <ListIcon /> },
                { value: 'grid', label: 'Grid', icon: <GridIcon /> },
                { value: 'board', label: 'Board', icon: <BoardIcon /> },
              ]}
            />
            <SegmentedControl
              label="Icon only"
              iconOnly
              options={[
                { value: 'list', label: 'List', icon: <ListIcon /> },
                { value: 'grid', label: 'Grid', icon: <GridIcon /> },
                { value: 'board', label: 'Board', icon: <BoardIcon /> },
              ]}
            />
          </Row>
        </Preview>
      </Section>

      <Section>
        <Heading>Full width &amp; disabled</Heading>
        <Preview>
          <SegmentedControl
            label="Billing"
            fullWidth
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <Row>
            <SegmentedControl
              label="One option disabled"
              options={[...periods, { value: 'year', label: 'Year', disabled: true }]}
            />
            <SegmentedControl label="All disabled" disabled options={periods} />
          </Row>
        </Preview>
      </Section>

      <Section>
        <Heading>Switching a view</Heading>
        <Description>
          The most common use. Here the label is visually hidden because the heading gives context,
          and the segments are icon-only.
        </Description>
        <Preview>
          <ViewSwitcherExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use it for 2–5 mutually exclusive options with short labels, where seeing all options at
            once helps. For more options, or long labels, use radio buttons or a select.
          </li>
          <li>
            Changes should apply immediately, like switching a view or filter. Don't use it in a
            form that's submitted later; use radio buttons.
          </li>
          <li>
            It's a choice, not a set of actions. For buttons that do things, use buttons or a split
            button.
          </li>
          <li>For a single on/off setting, use a toggle.</li>
          <li>
            Icon-only segments need icons users already recognize; the label still has to be
            provided for screen readers and tooltips.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

import { Textarea } from '../../components/textarea'
import type { TextareaSize } from '../../components/textarea'
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
import { TextareaPlayground } from './textarea-playground'

const sizes: TextareaSize[] = ['sm', 'md', 'lg']

const textareaProps: PropDoc[] = [
  {
    name: 'label',
    required: true,
    type: 'ReactNode',
    description: 'Visible label above the field. Placeholders are not a substitute.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Current text (controlled). Pair with onChange, or use defaultValue instead.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLTextAreaElement>) => void',
    description: 'Fires on every edit. Read the text from e.target.value.',
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
    name: 'rows',
    type: 'number',
    default: '3',
    description:
      'Visible lines. Size it to the answer you expect, so users know how much to write.',
  },
  {
    name: 'autoResize',
    type: 'boolean',
    default: 'false',
    description: 'Grows with the content instead of scrolling, starting at rows.',
  },
  {
    name: 'maxRows',
    type: 'number',
    description: 'With autoResize, the height to stop growing at and scroll instead.',
  },
  {
    name: 'characterLimit',
    type: 'number',
    description:
      'Shows a count and a soft limit. Users can go over and see how much to cut, rather than pasted text being cut off. Validate the limit yourself.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Text size and padding, matching Input.',
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
    description: 'Prevents interaction and excludes the value from form submission.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Text can be selected and copied but not edited, and is still submitted.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLTextAreaElement>',
    description: 'Forwarded to the native <textarea>, e.g. to focus it.',
  },
  {
    name: '...rest',
    type: 'TextareaHTMLAttributes',
    description:
      'Native attributes such as name, placeholder and maxLength (a hard limit) are passed through.',
  },
]

export function TextareaPage() {
  return (
    <>
      <PageTitle>Textarea</PageTitle>
      <PageIntro>
        A multi-line text field for longer answers, like comments, descriptions or feedback.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <Description>
          Change the props below and type into the field, then copy the generated code. Type past
          the character limit to see the soft limit.
        </Description>
        <TextareaPlayground />
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={textareaProps} />
      </Section>

      <Section>
        <Heading>States</Heading>
        <Preview>
          <Grid>
            <Textarea label="Default" placeholder="Placeholder text" />
            <Textarea label="With helper text" helperText="Markdown is supported." />
            <Textarea
              label="Error"
              defaultValue="Too short"
              error="Enter at least 20 characters."
            />
            <Textarea label="Required" required />
            <Textarea label="Disabled" defaultValue="Can't edit this" disabled />
            <Textarea label="Read-only" defaultValue="Submitted on 3 March." readOnly />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Character limit</Heading>
        <Description>
          The count turns into "N characters too many" when over, instead of blocking typing.
        </Description>
        <Preview>
          <Grid>
            <Textarea label="Bio" characterLimit={160} defaultValue="Designer and runner." />
            <Textarea
              label="Over the limit"
              characterLimit={40}
              defaultValue="This sentence is quite a bit longer than forty characters."
            />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Auto-resize</Heading>
        <Description>Starts small and grows as you type, up to maxRows, then scrolls.</Description>
        <Preview>
          <Grid>
            <Textarea label="Comment" rows={2} autoResize maxRows={6} placeholder="Add a comment" />
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Sizes</Heading>
        <Preview>
          <Grid>
            {sizes.map((size) => (
              <Textarea key={size} label={`Size ${size}`} size={size} rows={2} />
            ))}
          </Grid>
        </Preview>
      </Section>

      <Section>
        <Heading>Form validation</Heading>
        <Description>
          Submit empty, or with more than 200 characters, to see the error. Focus moves to the
          field.
        </Description>
        <Preview>
          <FormExample />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use a textarea when answers may run to more than one sentence. For a short, single-line
            answer like a name, use Input.
          </li>
          <li>
            Make the height fit the expected answer. A big box invites a long reply; a small one
            signals a short one.
          </li>
          <li>
            Prefer a soft characterLimit over maxLength. A hard limit silently cuts off pasted text,
            and users may not notice.
          </li>
          <li>
            Don't disable resizing unless the layout truly needs it; some users need more room to
            review what they wrote.
          </li>
          <li>Say what to write in the label or helper text, not in a placeholder.</li>
        </Guidelines>
      </Section>
    </>
  )
}

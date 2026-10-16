import { useState } from 'react'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Input } from '../../components/input'
import { Modal } from '../../components/modal'
import type { ModalSize } from '../../components/modal'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField, TextField } from '../../docs/form-controls'
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

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly ModalSize[]

type State = {
  title: string
  description: string
  size: ModalSize
  dismissible: boolean
  longContent: boolean
}

const defaults: State = {
  title: 'Delete project?',
  description: 'This permanently deletes "Website redesign" and its 24 files.',
  size: 'sm',
  dismissible: true,
  longContent: false,
}

function buildCode(state: State) {
  const props: string[] = [
    'open={open}',
    'onClose={() => setOpen(false)}',
    jsxString('title', state.title),
  ]
  if (state.description) props.push(jsxString('description', state.description))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (!state.dismissible) props.push('dismissible={false}')
  props.push(
    [
      'footer={',
      '    <>',
      '      <Button variant="outline" color="secondary" onClick={() => setOpen(false)}>',
      '        Cancel',
      '      </Button>',
      '      <Button color="danger" onClick={() => setOpen(false)}>',
      '        Delete project',
      '      </Button>',
      '    </>',
      '  }',
    ].join('\n'),
  )

  return [
    "import { useState } from 'react'",
    "import { Button } from './components/button'",
    "import { Modal } from './components/modal'",
    '',
    'const [open, setOpen] = useState(false)',
    '',
    '<>',
    '  <Button onClick={() => setOpen(true)}>Delete project</Button>',
    jsxElement('Modal', props)
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n'),
    '</>',
  ].join('\n')
}

const modalProps: PropDoc[] = [
  { name: 'open', required: true, type: 'boolean', description: 'Whether the modal is showing.' },
  {
    name: 'onClose',
    required: true,
    type: '() => void',
    description: 'Called when the user asks to close: Escape, the close button, or the backdrop.',
  },
  {
    name: 'title',
    required: true,
    type: 'ReactNode',
    description:
      'Heading, and the dialog’s name for screen readers. Phrase decisions as a question.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description: 'A line under the title, read by screen readers when the dialog opens.',
  },
  { name: 'children', type: 'ReactNode', description: 'Body content. Scrolls if it’s long.' },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Actions aligned to the end. Put the primary action last.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Max width: 400, 560 or 720px.',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    default: 'true',
    description:
      'When false, Escape, the backdrop and close button do nothing, so the user must pick an action.',
  },
]

function FormModalExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Invite teammate
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a teammate"
        description="They'll get an email with a link to join."
        footer={
          <>
            <Button variant="outline" color="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-form">
              Send invite
            </Button>
          </>
        }
      >
        <Flex
          as="form"
          id="invite-form"
          direction="column"
          gap={4}
          onSubmit={(e) => {
            e.preventDefault()
            setOpen(false)
          }}
        >
          <Input label="Email" type="email" required autoComplete="off" />
        </Flex>
      </Modal>
    </>
  )
}

export function ModalPage() {
  const [state, setState] = useState(defaults)
  const [open, setOpen] = useState(false)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Modal</PageTitle>
      <PageIntro>
        A dialog that blocks the rest of the page until the user responds. Built on the native
        dialog element, so focus is trapped inside and returns to the trigger on close.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Button color="danger" onClick={() => setOpen(true)}>
              Delete project
            </Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title={state.title}
              description={state.description || undefined}
              size={state.size}
              dismissible={state.dismissible}
              footer={
                <>
                  <Button variant="outline" color="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="danger" onClick={() => setOpen(false)}>
                    Delete project
                  </Button>
                </>
              }
            >
              {state.longContent &&
                Array.from({ length: 12 }, (_, i) => (
                  <p key={i}>
                    Paragraph {i + 1}. Long content scrolls inside the modal while the title and
                    actions stay in view.
                  </p>
                ))}
            </Modal>
          </Stage>
          <Controls>
            <TextField label="title" value={state.title} onChange={set('title')} />
            <TextField
              label="description"
              value={state.description}
              onChange={set('description')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <Options>
              <legend>Options</legend>
              <CheckboxField
                label="dismissible"
                checked={state.dismissible}
                onChange={set('dismissible')}
              />
              <CheckboxField
                label="Long content"
                checked={state.longContent}
                onChange={set('longContent')}
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
        <PropsTable props={modalProps} />
      </Section>

      <Section>
        <Heading>With a form</Heading>
        <Description>
          The submit button sits in the footer and points at the form with its form attribute, so
          Enter in the field submits too.
        </Description>
        <Preview>
          <div>
            <FormModalExample />
          </div>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use a modal only when the user must deal with something before continuing: confirming a
            destructive action, or a short focused task. Otherwise, show content in the page.
          </li>
          <li>
            Phrase confirmation titles as the question ("Delete project?") and label buttons with
            the action ("Delete project"), not "OK" / "Yes".
          </li>
          <li>Keep it short. If it needs scrolling or several steps, it probably wants a page.</li>
          <li>
            Only make it non-dismissible when skipping the decision isn’t possible; being trapped is
            frustrating.
          </li>
          <li>Never open a modal on page load or on top of another modal.</li>
        </Guidelines>
      </Section>
    </>
  )
}

import { useState } from 'react'
import styled from 'styled-components'
import { Avatar } from '../../components/avatar'
import type { AvatarSize } from '../../components/avatar'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
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

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly AvatarSize[]

// A tiny inline SVG "photo", so the docs work offline and never depend on an external image
const samplePhoto = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#94a3b8"/><circle cx="32" cy="26" r="12" fill="#e2e8f0"/><path d="M10 64c2-14 12-20 22-20s20 6 22 20z" fill="#e2e8f0"/></svg>',
)}`

type State = { name: string; size: AvatarSize; withPhoto: boolean; brokenPhoto: boolean }
const defaults: State = { name: 'Ada Lovelace', size: 'lg', withPhoto: false, brokenPhoto: false }

function buildCode(state: State) {
  const props = [jsxString('name', state.name)]
  if (state.withPhoto)
    props.push(jsxString('src', state.brokenPhoto ? '/missing.jpg' : '/photos/ada.jpg'))
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  return ["import { Avatar } from './components/avatar'", '', jsxElement('Avatar', props)].join(
    '\n',
  )
}

const avatarProps: PropDoc[] = [
  {
    name: 'name',
    required: true,
    type: 'string',
    description:
      'The person’s name: used as alt text, for initials, and to pick a consistent color.',
  },
  {
    name: 'src',
    type: 'string',
    description: 'Photo URL. Falls back to initials if missing or it fails to load.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    default: "'md'",
    description: '24, 32, 40, 48 or 64px.',
  },
  {
    name: 'decorative',
    type: 'boolean',
    default: 'false',
    description: 'Hides it from screen readers when the name is already shown next to it.',
  },
]

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  strong {
    display: block;
  }
`

// Its own component, so the muted color can't leak into the avatar's initials
const PersonRole = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.muted};
`

export function AvatarPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const src = state.withPhoto ? (state.brokenPhoto ? '/missing-photo.jpg' : samplePhoto) : undefined

  return (
    <>
      <PageTitle>Avatar</PageTitle>
      <PageIntro>
        A person’s photo, or their initials when there’s no photo. The same name always gets the
        same color.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Avatar key={src} name={state.name} src={src} size={state.size} />
          </Stage>
          <Controls>
            <TextField label="name" value={state.name} onChange={set('name')} />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <Options>
              <legend>Options</legend>
              <CheckboxField
                label="src (photo)"
                checked={state.withPhoto}
                onChange={set('withPhoto')}
              />
              <CheckboxField
                label="Photo fails to load"
                checked={state.brokenPhoto}
                onChange={set('brokenPhoto')}
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
        <PropsTable props={avatarProps} />
      </Section>

      <Section>
        <Heading>Sizes &amp; colors</Heading>
        <Preview>
          <Flex gap={3} align="center" wrap>
            {sizes.map((size) => (
              <Avatar key={size} name="Grace Hopper" size={size} />
            ))}
          </Flex>
          <Flex gap={2} wrap>
            {[
              'Alan Turing',
              'Katherine Johnson',
              'Tim Berners-Lee',
              'Margaret Hamilton',
              'Linus',
              'Radia Perlman',
            ].map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>With a name</Heading>
        <Description>
          When the name is shown beside it, mark the avatar decorative so it isn’t read twice.
        </Description>
        <Preview>
          <Person>
            <Avatar name="Ada Lovelace" decorative />
            <div>
              <strong>Ada Lovelace</strong>
              <PersonRole>Engineering</PersonRole>
            </div>
          </Person>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>Always pass the real name, even with a photo: it’s the alt text and the fallback.</li>
          <li>
            Show the name as text next to avatars where identity matters; faces and initials alone
            are ambiguous.
          </li>
          <li>Use one size per context, e.g. xs in dense lists, lg on profile headers.</li>
        </Guidelines>
      </Section>
    </>
  )
}

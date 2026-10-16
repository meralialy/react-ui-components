import type { ComponentType } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Heading as UIHeading } from '../../components/heading'
import * as Icons from '../../components/icon'
import type { IconProps, IconSize } from '../../components/icon'
import { Input } from '../../components/input'
import { Text } from '../../components/text'
import { useToast } from '../../components/toast'
import { Tooltip } from '../../components/tooltip'
import { CodeBlock } from '../../docs/code-block'
import { SelectField, TextField } from '../../docs/form-controls'
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
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'
import { colorNames } from '../../theme/theme'
import type { ColorName } from '../../theme/theme'
import { iconGroups } from './icon-groups'

type IconName = (typeof iconGroups)[number]['names'][number]
const iconByName = Icons as unknown as Record<IconName, ComponentType<IconProps>>
const allNames = iconGroups.flatMap((g) => g.names) as IconName[]

const sizes = ['1em (default)', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['inherit', ...colorNames] as const

type State = {
  icon: IconName
  size: (typeof sizes)[number]
  color: (typeof colors)[number]
  label: string
}
const defaults: State = { icon: 'SearchIcon', size: 'lg', color: 'inherit', label: '' }

function buildCode(state: State) {
  const props: string[] = []
  if (!state.size.startsWith('1em')) props.push(`size="${state.size}"`)
  if (state.label) props.push(jsxString('label', state.label))
  return [
    `import { ${state.icon} } from './components/icon'`,
    '',
    jsxElement(state.icon, props),
  ].join('\n')
}

const iconProps: PropDoc[] = [
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
    default: '1em',
    description:
      '12, 16, 20, 24 or 32px, or any px. By default it matches the surrounding text size.',
  },
  {
    name: 'label',
    type: 'string',
    description:
      'Gives a standalone icon a name for screen readers (role="img"). Leave out for decorative icons next to text; they’re then hidden.',
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '1.75',
    description: 'Line thickness on the 24px grid.',
  },
  {
    name: '...rest',
    type: 'SVGProps',
    description:
      'Native SVG attributes such as className and style. Color comes from the CSS color property.',
  },
]

const Gallery = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Tile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px 8px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.card};
  color: ${({ theme }) => theme.text.default};
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.field.borderHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  span {
    overflow-wrap: anywhere;
  }
`

const ColorBox = styled.span<{ $color: ColorName | 'inherit' }>`
  display: inline-flex;
  color: ${({ theme, $color }) => ($color === 'inherit' ? 'inherit' : theme.colors[$color].text)};
`

function IconGallery() {
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const groups = iconGroups
    .map((g) => ({ ...g, names: g.names.filter((n) => n.toLowerCase().includes(q)) }))
    .filter((g) => g.names.length)

  async function copy(name: IconName) {
    try {
      await navigator.clipboard.writeText(`import { ${name} } from 'react-ui-components'`)
      toast({ title: `Copied import for ${name}`, status: 'success', duration: 2500 })
    } catch {
      toast({ title: 'Couldn’t copy to the clipboard', status: 'warning' })
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Input
        label="Filter icons"
        hideLabel
        type="search"
        placeholder="Filter icons, e.g. arrow"
        startAdornment={<Icons.SearchIcon />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Text size="sm" color="muted" aria-live="polite">
        {groups.reduce((n, g) => n + g.names.length, 0)} icons. Click one to copy its import.
      </Text>
      {groups.map((group) => (
        <Flex key={group.title} direction="column" gap={3}>
          <UIHeading level={3} size="sm" color="muted">
            {group.title}
          </UIHeading>
          <Gallery>
            {group.names.map((name) => {
              const Icon = iconByName[name]
              return (
                <li key={name}>
                  <Tile type="button" onClick={() => copy(name)}>
                    <Icon size="lg" />
                    <span>{name.replace(/Icon$/, '')}</span>
                  </Tile>
                </li>
              )
            })}
          </Gallery>
        </Flex>
      ))}
    </Flex>
  )
}

function PasswordExample() {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      label="Password"
      type={visible ? 'text' : 'password'}
      autoComplete="current-password"
      startAdornment={<Icons.LockIcon />}
      endAdornment={
        <Button
          size="sm"
          variant="ghost"
          color="secondary"
          // The name says what pressing does; aria-pressed says whether it's on
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <Icons.EyeOffIcon /> : <Icons.EyeIcon />}
        </Button>
      }
    />
  )
}

const passwordCode = `import { useState } from 'react'
import { Button } from './components/button'
import { EyeIcon, EyeOffIcon, LockIcon } from './components/icon'
import { Input } from './components/input'

const [visible, setVisible] = useState(false)

<Input
  label="Password"
  type={visible ? 'text' : 'password'}
  startAdornment={<LockIcon />}
  endAdornment={
    <Button
      size="sm"
      variant="ghost"
      color="secondary"
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      onClick={() => setVisible((v) => !v)}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  }
/>`

const Narrow = styled.div`
  width: 100%;
  max-width: 360px;
`

export function IconPage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))
  const Selected = iconByName[state.icon]

  return (
    <>
      <PageTitle>Icon</PageTitle>
      <PageIntro>
        {allNames.length} line icons on a shared 24px grid. Each is its own component, so apps only
        bundle the icons they use. They take the color and size of the text around them.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <ColorBox $color={state.color}>
              <Selected
                size={state.size.startsWith('1em') ? undefined : (state.size as IconSize)}
                label={state.label || undefined}
              />
            </ColorBox>
          </Stage>
          <Controls>
            <SelectField
              label="icon"
              value={state.icon}
              options={allNames}
              onChange={set('icon')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="color (parent text color)"
              value={state.color}
              options={colors}
              onChange={set('color')}
            />
            <TextField label="label" value={state.label} onChange={set('label')} />
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
        <Heading>All icons</Heading>
        <Preview>
          <IconGallery />
        </Preview>
      </Section>

      <Section>
        <Heading>Props</Heading>
        <PropsTable props={iconProps} />
      </Section>

      <Section>
        <Heading>Show / hide password</Heading>
        <Description>
          Eye and EyeOff are the convention for revealing a password. Lock and Unlock show a
          security state (a locked account, a private item), not visibility.
        </Description>
        <Preview>
          <Narrow>
            <PasswordExample />
          </Narrow>
        </Preview>
        <CodeWrapper>
          <CodeBlock code={passwordCode} label="Password field code" />
        </CodeWrapper>
      </Section>

      <Section>
        <Heading>Decorative vs meaningful</Heading>
        <Preview>
          <Flex gap={3} align="center" wrap>
            <Button startIcon={<Icons.DownloadIcon />}>Download</Button>
            <Tooltip content="Delete">
              <Button variant="outline" color="danger" aria-label="Delete">
                <Icons.TrashIcon />
              </Button>
            </Tooltip>
            <Text as="span">
              <Icons.SuccessIcon label="Verified" /> Ada Lovelace
            </Text>
          </Flex>
        </Preview>
        <Description>
          Left: the label names the button, so the icon is decorative. Middle: an icon-only button
          gets its name from aria-label (and a tooltip shows it). Right: a standalone icon that
          carries meaning gets a label.
        </Description>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Pair icons with text where you can. Few icons are universally understood on their own.
          </li>
          <li>
            Icon-only buttons need an aria-label, and ideally a tooltip showing the same name.
          </li>
          <li>Give an icon a label only when it adds meaning that isn’t in nearby text.</li>
          <li>Use one icon per meaning across the product, e.g. always Trash for delete.</li>
          <li>Don’t use color as the only signal; status icons already differ in shape.</li>
        </Guidelines>
      </Section>
    </>
  )
}

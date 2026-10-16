import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Flex, FlexItem } from '../../components/flex'
import type { FlexAlign, FlexDirection, FlexJustify } from '../../components/flex'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
import {
  CodeWrapper,
  Controls,
  Options,
  PlaygroundCard,
  PlaygroundFooter,
  Stage,
  StageNote,
} from '../../docs/playground'
import { space } from '../../theme/theme'
import type { SpaceKey } from '../../theme/theme'
import { DemoBox } from './demo-box'

const directions = [
  'row',
  'column',
  'row-reverse',
  'column-reverse',
] as const satisfies readonly FlexDirection[]
const aligns = [
  'stretch',
  'start',
  'center',
  'end',
  'baseline',
] as const satisfies readonly FlexAlign[]
const justifies = [
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
] as const satisfies readonly FlexJustify[]
const gaps = Object.keys(space) as `${SpaceKey}`[]
const counts = ['3', '5', '8'] as const

type PlaygroundState = {
  direction: FlexDirection
  gap: `${SpaceKey}`
  align: FlexAlign
  justify: FlexJustify
  wrap: boolean
  inline: boolean
  stackOnMobile: boolean
  count: (typeof counts)[number]
  growFirst: boolean
}

const defaults: PlaygroundState = {
  direction: 'row',
  gap: '3',
  align: 'stretch',
  justify: 'start',
  wrap: false,
  inline: false,
  stackOnMobile: false,
  count: '3',
  growFirst: false,
}

// Every 4th item (starting with Item 3) gets a basis, so differing widths show up in the code too.
const itemProps = (i: number, growFirst: boolean) => [
  ...(i === 0 && growFirst ? ['grow'] : []),
  ...(i % 4 === 2 ? ['basis={120}'] : []),
]

// Only props that differ from the defaults appear in the generated code.
function buildCode(state: PlaygroundState) {
  const props: string[] = []
  if (state.stackOnMobile) props.push(`direction={{ base: 'column', md: '${state.direction}' }}`)
  else if (state.direction !== 'row') props.push(`direction="${state.direction}"`)
  props.push(`gap={${state.gap}}`)
  if (state.align !== 'stretch') props.push(`align="${state.align}"`)
  if (state.justify !== 'start') props.push(`justify="${state.justify}"`)
  if (state.wrap) props.push('wrap')
  if (state.inline) props.push('inline')

  // FlexItem is the natural child of a Flex, so the grow option is just a prop on it
  const children = Array.from({ length: Number(state.count) }, (_, i) =>
    jsxElement('FlexItem', itemProps(i, state.growFirst), `Item ${i + 1}`),
  )

  return [
    "import { Flex, FlexItem } from './components/flex'",
    '',
    jsxElement('Flex', props, children),
  ].join('\n')
}

// Extra height so align (cross axis) and justify (column main axis) have room to show.
// The tint makes the Flex's own area visible.
// The Flex itself, outlined and tinted so its bounds are visible. Rows size to their tallest
// item (so stretch looks natural); columns get extra height so justify has room to show.
const PreviewFlex = styled(Flex)<{ $column: boolean }>`
  ${({ $column }) => $column && 'min-height: 320px;'}
  outline: 1px dashed ${({ theme }) => theme.field.border};
  outline-offset: 0;
  background-color: ${({ theme }) => theme.colors.secondary.subtle};
`

const PreviewArea = styled.div`
  width: 100%;
`

export function FlexPlayground() {
  const [state, setState] = useState(defaults)

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const isColumn = state.direction.startsWith('column')

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <PreviewArea>
            <PreviewFlex
              $column={isColumn}
              direction={
                state.stackOnMobile ? { base: 'column', md: state.direction } : state.direction
              }
              gap={Number(state.gap) as SpaceKey}
              align={state.align}
              justify={state.justify}
              wrap={state.wrap}
              inline={state.inline}
            >
              {Array.from({ length: Number(state.count) }, (_, i) => (
                // Same props as the generated code; taller boxes make align differences visible
                <FlexItem
                  key={i}
                  grow={i === 0 && state.growFirst}
                  basis={i % 4 === 2 ? 120 : undefined}
                >
                  <DemoBox $tall={i % 3 === 1}>Item {i + 1}</DemoBox>
                </FlexItem>
              ))}
            </PreviewFlex>
          </PreviewArea>
          <StageNote>
            The dashed, tinted area is the Flex. It fills the width unless inline is on.
          </StageNote>
        </Stage>

        <Controls>
          <SelectField
            label="direction"
            value={state.direction}
            options={directions}
            onChange={set('direction')}
          />
          <SelectField label="gap" value={state.gap} options={gaps} onChange={set('gap')} />
          <SelectField label="align" value={state.align} options={aligns} onChange={set('align')} />
          <SelectField
            label="justify"
            value={state.justify}
            options={justifies}
            onChange={set('justify')}
          />
          <SelectField label="Items" value={state.count} options={counts} onChange={set('count')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="wrap" checked={state.wrap} onChange={set('wrap')} />
            <CheckboxField label="inline" checked={state.inline} onChange={set('inline')} />
            <CheckboxField
              label="First item grows (FlexItem)"
              checked={state.growFirst}
              onChange={set('growFirst')}
            />
            <CheckboxField
              label="Column on mobile (responsive direction)"
              checked={state.stackOnMobile}
              onChange={set('stackOnMobile')}
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
    </>
  )
}

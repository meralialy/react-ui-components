import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Container } from '../../components/container'
import type { ContainerSize } from '../../components/container'
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

const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const satisfies readonly ContainerSize[]
const elements = ['div', 'main', 'section'] as const
const widths: Record<ContainerSize, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: 'none',
}

// The preview renders a 1440px-wide "screen", scaled down to fit, so sizes show at true proportion.
const VIEWPORT = 1440
const VIEWPORT_HEIGHT = 360

type PlaygroundState = {
  size: ContainerSize
  gutters: boolean
  as: (typeof elements)[number]
}

const defaults: PlaygroundState = { size: 'lg', gutters: true, as: 'main' }

function buildCode(state: PlaygroundState) {
  const props: string[] = []
  if (state.as !== 'div') props.push(`as="${state.as}"`)
  if (state.size !== 'lg') props.push(`size="${state.size}"`)
  if (!state.gutters) props.push('gutters={false}')
  return [
    "import { Container } from './components/container'",
    '',
    jsxElement('Container', props, ['{/* page content */}']),
  ].join('\n')
}

const Frame = styled.div<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.background.page};
`

const Screen = styled.div<{ $scale: number }>`
  width: ${VIEWPORT}px;
  height: ${VIEWPORT_HEIGHT}px;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: top left;
`

const FakeHeader = styled.div`
  height: 56px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background.card};
`

// The container's padding (gutters) shows as a striped band; content shows as solid.
const Outline = styled(Container)`
  height: 260px;
  outline: 2px dashed ${({ theme }) => theme.colors.primary.text};
  background: repeating-linear-gradient(
    45deg,
    ${({ theme }) => theme.colors.primary.subtle} 0 8px,
    transparent 8px 16px
  );
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary.subtleActive};
  color: ${({ theme }) => theme.colors.primary.text};
  font-size: 28px;
  font-weight: 600;
`

function useScale(viewport: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / viewport))
    observer.observe(el)
    return () => observer.disconnect()
  }, [viewport])
  return [ref, scale] as const
}

export function ContainerPlayground() {
  const [state, setState] = useState(defaults)
  const [frameRef, scale] = useScale(VIEWPORT)

  const set =
    <K extends keyof PlaygroundState>(key: K) =>
    (next: PlaygroundState[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PlaygroundCard>
        <Stage>
          <Frame ref={frameRef} $height={VIEWPORT_HEIGHT * scale}>
            <Screen $scale={scale} aria-hidden="true">
              <FakeHeader />
              <Outline size={state.size} gutters={state.gutters}>
                <Content>
                  max-width: {widths[state.size]}
                  {state.gutters ? ' · striped = gutters' : ''}
                </Content>
              </Outline>
            </Screen>
          </Frame>
          <StageNote>
            A 1440px-wide screen, scaled to fit. Gutter width follows your real window (16px on
            phones, 24px from 768px, 32px from 1024px).
          </StageNote>
        </Stage>

        <Controls>
          <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
          <SelectField label="as" value={state.as} options={elements} onChange={set('as')} />
          <Options>
            <legend>Options</legend>
            <CheckboxField label="gutters" checked={state.gutters} onChange={set('gutters')} />
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

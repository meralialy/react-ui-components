import { useState } from 'react'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Pagination } from '../../components/pagination'
import type { PaginationSize } from '../../components/pagination'
import { CodeBlock } from '../../docs/code-block'
import { SelectField } from '../../docs/form-controls'
import { jsxElement } from '../../docs/jsx'
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
  StageNote,
} from '../../docs/playground'
import { PropsTable } from '../../docs/props-table'
import type { PropDoc } from '../../docs/props-table'

const sizes = ['sm', 'md'] as const satisfies readonly PaginationSize[]
const totals = ['5', '10', '50'] as const
const siblings = ['0', '1', '2'] as const
const variants = ['full', 'compact'] as const

type State = {
  total: (typeof totals)[number]
  siblingCount: (typeof siblings)[number]
  size: PaginationSize
  variant: (typeof variants)[number]
}
const defaults: State = { total: '10', siblingCount: '1', size: 'md', variant: 'full' }

function buildCode(state: State) {
  const props = ['page={page}', `totalPages={${state.total}}`, 'onChange={setPage}']
  if (state.siblingCount !== '1') props.push(`siblingCount={${state.siblingCount}}`)
  if (state.size !== 'md') props.push(`size="${state.size}"`)
  if (state.variant !== 'full') props.push(`variant="${state.variant}"`)
  return [
    "import { useState } from 'react'",
    "import { Pagination } from './components/pagination'",
    '',
    'const [page, setPage] = useState(1)',
    '',
    jsxElement('Pagination', props),
  ].join('\n')
}

const paginationProps: PropDoc[] = [
  { name: 'page', required: true, type: 'number', description: 'Current page, starting at 1.' },
  { name: 'totalPages', required: true, type: 'number', description: 'How many pages there are.' },
  {
    name: 'onChange',
    required: true,
    type: '(page: number) => void',
    description: 'Called with the page to show.',
  },
  {
    name: 'siblingCount',
    type: 'number',
    default: '1',
    description: 'Pages shown either side of the current one before collapsing to "…".',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: '32 or 40px, matching Button.',
  },
  {
    name: 'variant',
    type: "'full' | 'compact'",
    default: "'full'",
    description:
      '\'compact\' shows "Page 3 of 10" between Previous and Next, for phones and narrow spaces.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Pagination'",
    description:
      'Names the navigation landmark. Make it specific when there are several on a page.',
  },
]

export function PaginationPage() {
  const [state, setState] = useState(defaults)
  const [page, setPage] = useState(1)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  const total = Number(state.total)
  const current = Math.min(page, total)

  return (
    <>
      <PageTitle>Pagination</PageTitle>
      <PageIntro>Moves between pages of a long list, like search results or a table.</PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <Pagination
              label="Pagination (playground)"
              page={current}
              totalPages={total}
              onChange={setPage}
              siblingCount={Number(state.siblingCount)}
              size={state.size}
              variant={state.variant}
            />
            <StageNote aria-live="polite">
              Showing page {current} of {total}
            </StageNote>
          </Stage>
          <Controls>
            <SelectField
              label="totalPages"
              value={state.total}
              options={totals}
              onChange={set('total')}
            />
            <SelectField
              label="siblingCount"
              value={state.siblingCount}
              options={siblings}
              onChange={set('siblingCount')}
            />
            <SelectField label="size" value={state.size} options={sizes} onChange={set('size')} />
            <SelectField
              label="variant"
              value={state.variant}
              options={variants}
              onChange={set('variant')}
            />
          </Controls>
          <PlaygroundFooter>
            <Button
              size="sm"
              variant="ghost"
              color="secondary"
              onClick={() => {
                setState(defaults)
                setPage(1)
              }}
            >
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
        <PropsTable props={paginationProps} />
      </Section>

      <Section>
        <Heading>Compact</Heading>
        <Description>For narrow spaces, where a row of numbers wouldn't fit.</Description>
        <Preview>
          <Flex>
            <Pagination
              label="Pagination (compact example)"
              page={3}
              totalPages={12}
              onChange={() => {}}
              variant="compact"
              size="sm"
            />
          </Flex>
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            After changing page, move focus to the top of the new results (or their heading), so
            keyboard and screen reader users start at the new content.
          </li>
          <li>Keep the page in the URL, so the back button and shared links work.</li>
          <li>
            Show the total ("Page 3 of 12", or a result count) so people know how much is left.
          </li>
          <li>
            For feeds people browse rather than search, a "Load more" button often works better than
            pages.
          </li>
        </Guidelines>
      </Section>
    </>
  )
}

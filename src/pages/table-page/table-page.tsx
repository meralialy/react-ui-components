import { useState } from 'react'
import styled from 'styled-components'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Flex } from '../../components/flex'
import { Table } from '../../components/table'
import type { TableColumn } from '../../components/table'
import { CodeBlock } from '../../docs/code-block'
import { CheckboxField, SelectField } from '../../docs/form-controls'
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
import type { ColorName } from '../../theme/theme'

type Invoice = {
  id: string
  customer: string
  status: 'Paid' | 'Sent' | 'Overdue'
  amount: number
  due: string
}

const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind', status: 'Paid', amount: 1280, due: '2026-09-02' },
  { id: 'INV-1043', customer: 'Acme Corp', status: 'Overdue', amount: 640.5, due: '2026-09-14' },
  { id: 'INV-1044', customer: 'Globex', status: 'Sent', amount: 12400, due: '2026-10-20' },
  { id: 'INV-1045', customer: 'Initech', status: 'Paid', amount: 99, due: '2026-10-01' },
  { id: 'INV-1046', customer: 'Umbrella', status: 'Sent', amount: 3150, due: '2026-11-05' },
]

const statusColor: Record<Invoice['status'], ColorName> = {
  Paid: 'success',
  Sent: 'info',
  Overdue: 'danger',
}
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
// Date-only strings like '2026-09-02' are parsed as UTC midnight; format in UTC too, or the day
// shifts in time zones west of UTC.
const date = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const columns: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', sortable: true },
  {
    key: 'customer',
    header: 'Customer',
    sortable: true,
    cell: (row) => (
      <Flex gap={2} align="center">
        <Avatar name={row.customer} size="xs" decorative />
        {row.customer}
      </Flex>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <Badge color={statusColor[row.status]}>{row.status}</Badge>,
  },
  {
    key: 'due',
    header: 'Due',
    sortable: true,
    cell: (row) => date.format(new Date(row.due)),
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'end',
    sortable: true,
    cell: (row) => money.format(row.amount),
  },
]

const densities = ['comfortable', 'compact'] as const

type State = {
  density: (typeof densities)[number]
  striped: boolean
  empty: boolean
  hideCaption: boolean
}
const defaults: State = { density: 'comfortable', striped: false, empty: false, hideCaption: false }

function buildCode(state: State) {
  const props = [
    'caption="Invoices"',
    'columns={columns}',
    `rows={${state.empty ? '[]' : 'invoices'}}`,
    'getRowKey={(row) => row.id}',
  ]
  if (state.hideCaption) props.push('hideCaption')
  if (state.density !== 'comfortable') props.push(`density="${state.density}"`)
  if (state.striped) props.push('striped')
  if (state.empty) props.push('emptyState="No invoices yet. Create one to get started."')
  return [
    "import { Table } from './components/table'",
    "import type { TableColumn } from './components/table'",
    '',
    'type Invoice = { id: string; customer: string; amount: number }',
    '',
    // Sample data only when it's used; the empty-state version passes rows={[]}
    ...(state.empty
      ? []
      : [
          'const invoices: Invoice[] = [',
          "  { id: 'INV-1042', customer: 'Northwind', amount: 1280 },",
          "  { id: 'INV-1043', customer: 'Acme Corp', amount: 640.5 },",
          ']',
          '',
        ]),
    'const columns: TableColumn<Invoice>[] = [',
    "  { key: 'id', header: 'Invoice', sortable: true },",
    "  { key: 'customer', header: 'Customer', sortable: true },",
    "  { key: 'amount', header: 'Amount', align: 'end', sortable: true, cell: (row) => `$${row.amount}` },",
    ']',
    '',
    `<Table\n  ${props.join('\n  ')}\n/>`,
  ].join('\n')
}

const tableProps: PropDoc[] = [
  {
    name: 'caption',
    required: true,
    type: 'ReactNode',
    description: 'Describes the table; names it for screen readers.',
  },
  {
    name: 'columns',
    required: true,
    type: 'TableColumn<T>[]',
    description: 'Column definitions (see below).',
  },
  { name: 'rows', required: true, type: 'T[]', description: 'The data.' },
  {
    name: 'getRowKey',
    required: true,
    type: '(row: T) => string',
    description: 'A stable, unique key per row.',
  },
  {
    name: 'hideCaption',
    type: 'boolean',
    default: 'false',
    description: 'Hides the caption visually when a heading already names the table.',
  },
  {
    name: 'density',
    type: "'comfortable' | 'compact'",
    default: "'comfortable'",
    description: 'Row spacing. Compact for data-dense screens.',
  },
  {
    name: 'striped',
    type: 'boolean',
    default: 'false',
    description: 'Tints every other row, which helps reading across wide rows.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    default: "'No results'",
    description: 'Shown when there are no rows. Say why and what to do.',
  },
  {
    name: 'defaultSort',
    type: '{ key; direction }',
    description: 'Initial sort when the table sorts by itself.',
  },
  {
    name: 'sort / onSortChange',
    type: '{ key; direction } / (sort) => void',
    description:
      'Controlled sorting, e.g. when the server sorts. Rows are shown in the order you give.',
  },
]

const columnProps: PropDoc[] = [
  {
    name: 'key',
    required: true,
    type: 'string',
    description: 'Unique id; also the row field shown by default.',
  },
  { name: 'header', required: true, type: 'ReactNode', description: 'Column heading.' },
  {
    name: 'cell',
    type: '(row: T) => ReactNode',
    description: 'Custom cell content, e.g. a Badge or formatted number.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    default: "'start'",
    description: "Use 'end' for numbers so digits line up.",
  },
  {
    name: 'sortable',
    type: 'boolean',
    default: 'false',
    description: 'Makes the header a sort button and announces the sort state.',
  },
  {
    name: 'sortValue',
    type: '(row: T) => string | number',
    description: 'What to sort by when it differs from the field.',
  },
  { name: 'width', type: 'string', description: "Column width, e.g. '120px' or '20%'." },
]

const FullWidth = styled.div`
  width: 100%;
`

export function TablePage() {
  const [state, setState] = useState(defaults)
  const set =
    <K extends keyof State>(key: K) =>
    (next: State[K]) =>
      setState((prev) => ({ ...prev, [key]: next }))

  return (
    <>
      <PageTitle>Table</PageTitle>
      <PageIntro>
        Shows rows of data for comparing and scanning, with sortable columns. Typed: columns know
        the shape of your rows.
      </PageIntro>

      <Section>
        <Heading>Playground</Heading>
        <PlaygroundCard>
          <Stage>
            <FullWidth>
              <Table
                caption="Invoices"
                hideCaption={state.hideCaption}
                columns={columns}
                rows={state.empty ? [] : invoices}
                getRowKey={(row) => row.id}
                density={state.density}
                striped={state.striped}
                emptyState="No invoices yet. Create one to get started."
              />
            </FullWidth>
          </Stage>
          <Controls>
            <SelectField
              label="density"
              value={state.density}
              options={densities}
              onChange={set('density')}
            />
            <Options>
              <legend>Options</legend>
              <CheckboxField label="striped" checked={state.striped} onChange={set('striped')} />
              <CheckboxField
                label="No rows (empty state)"
                checked={state.empty}
                onChange={set('empty')}
              />
              <CheckboxField
                label="hideCaption"
                checked={state.hideCaption}
                onChange={set('hideCaption')}
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
        <Heading>Table props</Heading>
        <PropsTable props={tableProps} />
      </Section>

      <Section>
        <Heading>Column props</Heading>
        <PropsTable props={columnProps} />
      </Section>

      <Section>
        <Heading>Narrow screens</Heading>
        <Description>
          Wide tables scroll sideways inside their frame (try it on a phone). The scroll area can be
          focused and scrolled with arrow keys.
        </Description>
        <Preview>
          <Table
            caption="Invoices, sorted by amount"
            columns={columns}
            rows={invoices}
            getRowKey={(row) => row.id}
            defaultSort={{ key: 'amount', direction: 'descending' }}
            density="compact"
          />
        </Preview>
      </Section>

      <Section>
        <Heading>Guidelines</Heading>
        <Guidelines>
          <li>
            Use tables for data people compare across rows. For a few items with rich content, use
            cards.
          </li>
          <li>Right-align numbers and use the same number of decimals, so values line up.</li>
          <li>
            Give it a caption (or a heading plus hideCaption) so screen reader users know what it
            holds.
          </li>
          <li>Make the empty state helpful: say why it’s empty and what to do next.</li>
          <li>For long data, paginate or filter; don’t render thousands of rows at once.</li>
        </Guidelines>
      </Section>
    </>
  )
}

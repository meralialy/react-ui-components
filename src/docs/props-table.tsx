import styled from 'styled-components'

export type PropDoc = {
  name: string
  required?: boolean
  type: string
  default?: string
  description: string
}

export type PropsTableProps = {
  props: PropDoc[]
}

// Scrolls horizontally on narrow screens instead of squashing the type column.
const Scroller = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;

  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }

  th {
    font-weight: 600;
    color: ${({ theme }) => theme.text.muted};
    white-space: nowrap;
  }
`

const Code = styled.code`
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
`

const RequiredBadge = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger.text};
`

const NameCell = styled.td`
  white-space: nowrap;
`

// Union types are long; let them wrap but stay readable.
const TypeCell = styled.td`
  min-width: 160px;
`

const DescriptionCell = styled.td`
  min-width: 240px;
`

export function PropsTable({ props }: PropsTableProps) {
  return (
    <Scroller>
      <Table>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <NameCell>
                <Code>{prop.name}</Code>
                {prop.required && <RequiredBadge>required</RequiredBadge>}
              </NameCell>
              <TypeCell>
                <Code>{prop.type}</Code>
              </TypeCell>
              <NameCell>{prop.default ? <Code>{prop.default}</Code> : '—'}</NameCell>
              <DescriptionCell>{prop.description}</DescriptionCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </Scroller>
  )
}

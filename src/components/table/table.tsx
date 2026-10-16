import type { ReactNode } from 'react'
import { useId, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { visuallyHidden } from '../shared/visually-hidden'

export type SortDirection = 'ascending' | 'descending'
export type TableSort = { key: string; direction: SortDirection }

export type TableColumn<T> = {
  key: string
  header: ReactNode
  /** What to show in the cell. Defaults to row[key]. */
  cell?: (row: T) => ReactNode
  /** 'end' for numbers, so digits line up. */
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  /** Value to sort by, when it differs from what's displayed (e.g. a date shown formatted). */
  sortValue?: (row: T) => string | number
  width?: string
}

export type TableProps<T> = {
  /** Describes the table; read by screen readers and used to name its scroll area. */
  caption: ReactNode
  hideCaption?: boolean
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  density?: 'comfortable' | 'compact'
  striped?: boolean
  /** Shown in place of rows when there are none. Say why, and what to do. */
  emptyState?: ReactNode
  /** Initial sort when uncontrolled. */
  defaultSort?: TableSort
  /** Controlled sort, e.g. when the server sorts. Rows are then shown in the order given. */
  sort?: TableSort | null
  onSortChange?: (sort: TableSort) => void
}

const Scroller = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }
`

const StyledTable = styled.table<{ $compact: boolean; $striped: boolean }>`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.default};

  th,
  td {
    padding: ${({ $compact }) => ($compact ? '8px 12px' : '12px 16px')};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    vertical-align: middle;
  }

  thead th {
    font-weight: 600;
    color: ${({ theme }) => theme.text.muted};
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  ${({ $striped, theme }) =>
    $striped &&
    css`
      tbody tr:nth-child(even) td {
        background-color: ${theme.colors.secondary.subtle};
      }
    `}
`

const Caption = styled.caption<{ $hidden: boolean }>`
  padding: 12px 16px 0;
  font-weight: 600;
  text-align: left;

  ${({ $hidden }) => $hidden && visuallyHidden}
`

const alignments = { start: 'left', center: 'center', end: 'right' } as const

const Cell = styled.td<{ $align: 'start' | 'center' | 'end' }>`
  text-align: ${({ $align }) => alignments[$align]};
  ${({ $align }) => $align === 'end' && 'font-variant-numeric: tabular-nums;'}
`

const HeaderCell = styled.th<{ $align: 'start' | 'center' | 'end'; $width?: string }>`
  text-align: ${({ $align }) => alignments[$align]};
  ${({ $width }) => $width && `width: ${$width};`}
`

const SortButton = styled.button<{ $align: 'start' | 'center' | 'end' }>`
  display: inline-flex;
  flex-direction: ${({ $align }) => ($align === 'end' ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 4px;
  margin: -4px -6px;
  padding: 4px 6px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.default};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
  }
`

const Empty = styled.td`
  padding: 40px 16px !important;
  text-align: center;
  color: ${({ theme }) => theme.text.muted};
`

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 1.5 9 5H3l3-3.5Z"
        fill="currentColor"
        opacity={direction === 'ascending' ? 1 : 0.35}
      />
      <path
        d="M6 10.5 3 7h6l-3 3.5Z"
        fill="currentColor"
        opacity={direction === 'descending' ? 1 : 0.35}
      />
    </svg>
  )
}

const compare = (a: string | number, b: string | number) =>
  typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })

/**
 * A data table with optional sortable columns. Headers announce their sort state (aria-sort),
 * and the table scrolls sideways inside a keyboard-reachable region when it's too wide.
 */
export function Table<T>({
  caption,
  hideCaption = false,
  columns,
  rows,
  getRowKey,
  density = 'comfortable',
  striped = false,
  emptyState = 'No results',
  defaultSort,
  sort: controlledSort,
  onSortChange,
}: TableProps<T>) {
  const captionId = useId()
  const [uncontrolledSort, setUncontrolledSort] = useState<TableSort | null>(defaultSort ?? null)
  const isControlled = controlledSort !== undefined
  const sort = isControlled ? controlledSort : uncontrolledSort

  const sortedRows = useMemo(() => {
    if (isControlled || !sort) return rows
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return rows
    const valueOf =
      column.sortValue ?? ((row: T) => (row as Record<string, string | number>)[column.key])
    const sorted = [...rows].sort((a, b) => compare(valueOf(a), valueOf(b)))
    return sort.direction === 'descending' ? sorted.reverse() : sorted
  }, [rows, columns, sort, isControlled])

  function toggleSort(key: string) {
    const next: TableSort = {
      key,
      direction: sort?.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending',
    }
    if (!isControlled) setUncontrolledSort(next)
    onSortChange?.(next)
  }

  return (
    // Focusable so keyboard users can scroll it when the table is wider than the screen
    <Scroller role="region" aria-labelledby={captionId} tabIndex={0}>
      <StyledTable $compact={density === 'compact'} $striped={striped}>
        <Caption id={captionId} $hidden={hideCaption}>
          {caption}
        </Caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const align = column.align ?? 'start'
              const direction = sort?.key === column.key ? sort.direction : undefined
              return (
                <HeaderCell
                  key={column.key}
                  scope="col"
                  $align={align}
                  $width={column.width}
                  aria-sort={column.sortable ? (direction ?? 'none') : undefined}
                >
                  {column.sortable ? (
                    <SortButton type="button" $align={align} onClick={() => toggleSort(column.key)}>
                      {column.header}
                      <SortIcon direction={direction} />
                    </SortButton>
                  ) : (
                    column.header
                  )}
                </HeaderCell>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <Empty colSpan={columns.length}>{emptyState}</Empty>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <Cell key={column.key} $align={column.align ?? 'start'}>
                    {column.cell
                      ? column.cell(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </Cell>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </Scroller>
  )
}

import type { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type PaginationSize = 'sm' | 'md'

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  /** Current page, starting at 1. */
  page: number
  totalPages: number
  onChange: (page: number) => void
  /** How many pages to show on each side of the current one before an ellipsis. */
  siblingCount?: number
  size?: PaginationSize
  /** 'compact' shows "Page 3 of 10" between Previous and Next; good for phones and tight spaces. */
  variant?: 'full' | 'compact'
  /** Name of the navigation landmark. Make it specific if there are several, e.g. "Invoices pages". */
  label?: string
}

const heights: Record<PaginationSize, string> = { sm: '32px', md: '40px' }

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ${({ theme }) => theme.fontFamily};
`

const PageButton = styled.button<{ $size: PaginationSize; $current?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: ${({ $size }) => heights[$size]};
  height: ${({ $size }) => heights[$size]};
  padding: 0 ${({ $size }) => ($size === 'sm' ? '8px' : '12px')};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.default};
  font: inherit;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.875rem' : '0.9375rem')};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $current, theme }) =>
    $current &&
    css`
      border-color: ${theme.colors.primary.text};
      background-color: ${theme.colors.primary.main};
      color: ${theme.colors.primary.contrastText};
      font-weight: 600;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary.hover};
      }
    `}
`

const Ellipsis = styled.span`
  min-width: 24px;
  text-align: center;
  color: ${({ theme }) => theme.text.muted};
`

const Status = styled.span`
  padding: 0 8px;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.text.default};
  font-variant-numeric: tabular-nums;
`

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10 3.5 5.5 8l4.5 4.5' : 'm6 3.5 4.5 4.5L6 12.5'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page numbers to show, with 'gap' where pages are skipped: 1 … 4 5 6 … 10. */
function pageRange(page: number, total: number, siblings: number): (number | 'gap')[] {
  const first = Math.max(2, page - siblings)
  const last = Math.min(total - 1, page + siblings)
  const range: (number | 'gap')[] = [1]
  // Show the page number instead of a gap when only one page would be hidden
  if (first > 3) range.push('gap')
  else for (let p = 2; p < first; p++) range.push(p)
  for (let p = first; p <= last; p++) range.push(p)
  if (last < total - 2) range.push('gap')
  else for (let p = last + 1; p < total; p++) range.push(p)
  if (total > 1) range.push(total)
  return range
}

/** Moves between pages of a long list. Buttons, so it works with client-side data. */
export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  size = 'md',
  variant = 'full',
  label = 'Pagination',
  ...rest
}: PaginationProps) {
  const go = (p: number) => onChange(Math.min(Math.max(p, 1), totalPages))

  return (
    <nav aria-label={label} {...rest}>
      <List>
        <li>
          <PageButton
            type="button"
            $size={size}
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <Chevron direction="left" />
            <span aria-hidden="true">Previous</span>
          </PageButton>
        </li>
        {variant === 'compact' ? (
          <li>
            <Status aria-current="page">
              Page {page} of {totalPages}
            </Status>
          </li>
        ) : (
          pageRange(page, totalPages, siblingCount).map((item, i) =>
            item === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden="true">
                <Ellipsis>…</Ellipsis>
              </li>
            ) : (
              <li key={item}>
                <PageButton
                  type="button"
                  $size={size}
                  $current={item === page}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => go(item)}
                >
                  {item}
                </PageButton>
              </li>
            ),
          )
        )}
        <li>
          <PageButton
            type="button"
            $size={size}
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <span aria-hidden="true">Next</span>
            <Chevron direction="right" />
          </PageButton>
        </li>
      </List>
    </nav>
  )
}

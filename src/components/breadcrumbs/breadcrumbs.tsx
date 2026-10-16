import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from '../link'

export type BreadcrumbItem = {
  label: ReactNode
  /** Where the crumb links to. The last item is the current page and isn't a link. */
  href?: string
}

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  items: BreadcrumbItem[]
  /**
   * Renders each link, e.g. with your router:
   * renderLink={({ href, children }) => <Link as={RouterLink} to={href}>{children}</Link>}
   */
  renderLink?: (link: { href: string; children: ReactNode }) => ReactNode
  /** Name of the navigation landmark. */
  label?: string
}

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.875rem;
`

const Item = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text.muted};
`

const Current = styled.span`
  color: ${({ theme }) => theme.text.default};
  font-weight: 600;
`

function Separator() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m6 3.5 4.5 4.5L6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const defaultRenderLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href}>{children}</Link>
)

/** Shows where the current page sits in the site's hierarchy, with links back up. */
export function Breadcrumbs({
  items,
  renderLink = defaultRenderLink,
  label = 'Breadcrumb',
  ...rest
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} {...rest}>
      <List>
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return (
            <Item key={i}>
              {isCurrent || !item.href ? (
                <Current aria-current={isCurrent ? 'page' : undefined}>{item.label}</Current>
              ) : (
                renderLink({ href: item.href, children: item.label })
              )}
              {!isCurrent && <Separator />}
            </Item>
          )
        })}
      </List>
    </nav>
  )
}

import { useEffect, useRef } from 'react'
import {
  Link,
  NavLink as RouterNavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
} from 'react-router'
import styled from 'styled-components'
import { ColorModeToggle } from '../components/color-mode-toggle'
import { navGroups } from '../pages/component-pages'
import type { RouteHandle } from '../router'
import { useColorMode } from '../theme/use-color-mode'

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background.card};
`

const SiteTitle = styled(Link)`
  font-weight: 700;
  color: inherit;
  text-decoration: none;
`

// Sidebar on wide screens; a horizontal, scrollable bar on narrow ones.
const Body = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const Nav = styled.nav`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (min-width: 768px) {
    flex: 0 0 200px;
    padding: 32px 16px;
    border-bottom: none;
  }
`

// On phones the groups run together as one scrolling row; from 768px they stack with headings.
const NavGroups = styled.div`
  position: relative;
  display: flex;
  gap: 4px;
  overflow-x: auto;

  @media (min-width: 768px) {
    flex-direction: column;
    gap: 24px;
    overflow-x: visible;
  }
`

const NavHeading = styled.h2`
  margin: 0 0 8px;
  padding: 0 12px;
  /* Sentence case, not text-transform: uppercase, which Chrome passes on to screen readers */
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.muted};

  @media (max-width: 767px) {
    display: none;
  }
`

const NavList = styled.ul`
  display: flex;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 768px) {
    flex-direction: column;
  }
`

// NavLink sets aria-current="page" on the active route, which the styles below key off.
const NavLink = styled(RouterNavLink)`
  display: block;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.text.muted};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  &[aria-current='page'] {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary.text};
    background-color: ${({ theme }) => theme.colors.primary.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: 32px 16px 64px;

  @media (min-width: 768px) {
    padding: 32px 32px 64px;
  }
`

// On phones the nav is a horizontal row; keep the current page's link in view after navigating.
// Only the row scrolls, never the page.
function useActiveLinkInView() {
  const rowRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const row = rowRef.current
    const active = row?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!row || !active || row.scrollWidth <= row.clientWidth) return
    const linkBox = active.getBoundingClientRect()
    const rowBox = row.getBoundingClientRect()
    row.scrollLeft += linkBox.left - rowBox.left - (row.clientWidth - linkBox.width) / 2
  }, [pathname])

  return rowRef
}

function useDocumentTitle() {
  const matches = useMatches()
  const title = (matches.at(-1)?.handle as RouteHandle | undefined)?.title

  useEffect(() => {
    document.title = title ? `${title} · React UI Components` : 'React UI Components'
  }, [title])
}

export function DocsLayout() {
  const [colorMode, setColorMode] = useColorMode()
  useDocumentTitle()
  const navRowRef = useActiveLinkInView()

  return (
    <>
      <Header>
        <SiteTitle to="/">React UI Components</SiteTitle>
        <ColorModeToggle value={colorMode} onChange={setColorMode} />
      </Header>
      <Body>
        <Nav aria-label="Docs">
          <NavGroups ref={navRowRef}>
            <NavList>
              <li>
                {/* end: stay inactive on component pages, which all sit under / */}
                <NavLink to="/" end>
                  Overview
                </NavLink>
              </li>
            </NavList>
            {navGroups.map(({ group, pages }) => {
              const headingId = `nav-${group.toLowerCase().replace(/\s+/g, '-')}`
              return (
                <div key={group}>
                  <NavHeading id={headingId}>{group}</NavHeading>
                  <NavList aria-labelledby={headingId}>
                    {pages.map((page) => (
                      <li key={page.path}>
                        <NavLink to={`/${page.path}`}>{page.title}</NavLink>
                      </li>
                    ))}
                  </NavList>
                </div>
              )
            })}
          </NavGroups>
        </Nav>
        <Main>
          <Outlet />
        </Main>
      </Body>
      {/* Scrolls to top on navigation and restores position on back/forward */}
      <ScrollRestoration />
    </>
  )
}

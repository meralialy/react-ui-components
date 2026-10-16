import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import styled from 'styled-components'
import { visuallyHidden } from '../shared/visually-hidden'

export type LinkColor = 'primary' | 'inherit'

export type LinkProps<C extends ElementType = 'a'> = {
  /** Render as another component, e.g. a router's Link: <Link as={RouterLink} to="/settings">. */
  as?: C
  /** Opens in a new tab, adds a ↗ icon, and tells screen readers it opens a new tab. */
  external?: boolean
  /** 'inherit' takes the surrounding text color, e.g. inside an Alert. */
  color?: LinkColor
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'color' | 'children'>

const StyledLink = styled.a<{ $color: LinkColor }>`
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  border-radius: 2px;
  color: ${({ theme, $color }) => ($color === 'inherit' ? 'inherit' : theme.colors.primary.text)};
  font-weight: 500;
  /* Always underlined: color alone isn't enough to tell links from text (WCAG 1.4.1) */
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    text-decoration-thickness: 2px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    align-self: center;
  }
`

const Hidden = styled.span`
  ${visuallyHidden}
`

function ExternalIcon() {
  return (
    <svg width="0.8em" height="0.8em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V10M9 2h5v5M14 2 7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A text link. Underlined, with a visible focus ring; works with router links via `as`. */
export function Link<C extends ElementType = 'a'>({
  as,
  external = false,
  color = 'primary',
  children,
  ...rest
}: LinkProps<C>) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <StyledLink as={as} $color={color} {...externalProps} {...rest}>
      {children}
      {external && (
        <>
          <ExternalIcon />
          <Hidden> (opens in a new tab)</Hidden>
        </>
      )}
    </StyledLink>
  )
}

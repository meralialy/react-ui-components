import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

export type CardVariant = 'outlined' | 'elevated'
export type CardPadding = 'sm' | 'md' | 'lg'

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Element to render, e.g. 'article' for a standalone item like a post. Defaults to 'div'. */
  as?: ElementType
  title?: ReactNode
  /** Heading level for the title, to fit the page's outline. */
  titleAs?: 'h2' | 'h3' | 'h4'
  description?: ReactNode
  /** Image or other media shown edge to edge at the top. */
  media?: ReactNode
  /** Small controls in the header's top-right, e.g. a Menu. */
  actions?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  variant?: CardVariant
  padding?: CardPadding
  /**
   * Makes the link inside the title cover the whole card, so the card is one big click target
   * while screen readers still hear one clear link. Buttons in the card stay clickable.
   */
  stretchLink?: boolean
}

const paddings: Record<CardPadding, string> = { sm: '12px', md: '20px', lg: '28px' }

const Root = styled.div<{ $variant: CardVariant; $padding: CardPadding; $stretch: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
  color: ${({ theme }) => theme.text.default};
  font-family: ${({ theme }) => theme.fontFamily};
  ${({ $variant, theme }) =>
    $variant === 'elevated' &&
    css`
      box-shadow: ${theme.shadow.popover};
    `}

  --card-padding: ${({ $padding }) => paddings[$padding]};

  ${({ $stretch, theme }) =>
    $stretch &&
    css`
      transition: border-color 120ms ease;

      &:hover {
        border-color: ${theme.field.borderHover};
      }

      /* The title link's box grows to cover the card */
      [data-card-title] a::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      /* The focus ring goes around the whole card, matching the click target */
      [data-card-title] a:focus-visible {
        outline: none;
      }

      &:has([data-card-title] a:focus-visible) {
        outline: 2px solid ${theme.focusRing};
        outline-offset: 2px;
      }

      /* Other interactive elements sit above the stretched link so they stay usable */
      button,
      [data-card-actions] a,
      [data-card-footer] a {
        position: relative;
        z-index: 2;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `}
`

const Media = styled.div`
  > img {
    display: block;
    width: 100%;
    height: auto;
  }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: var(--card-padding) var(--card-padding) 0;
`

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.4;
`

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.muted};
`

const Body = styled.div`
  flex: 1;
  padding: var(--card-padding) var(--card-padding) 0;
  font-size: 0.9375rem;
  line-height: 1.5;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: var(--card-padding);
  padding: 12px var(--card-padding);
  border-top: 1px solid ${({ theme }) => theme.border};
`

// Bottom padding lives on a spacer so it's right whether or not there's a footer.
const EndSpacer = styled.div`
  height: var(--card-padding);
`

/** A surface that groups related content and actions about one subject. */
export function Card({
  as,
  title,
  titleAs = 'h3',
  description,
  media,
  actions,
  footer,
  children,
  variant = 'outlined',
  padding = 'md',
  stretchLink = false,
  ...rest
}: CardProps) {
  const hasHeader = Boolean(title || description || actions)
  return (
    <Root as={as} $variant={variant} $padding={padding} $stretch={stretchLink} {...rest}>
      {media && <Media>{media}</Media>}
      {hasHeader && (
        <Header>
          <Titles>
            {title && (
              <Title as={titleAs} data-card-title="">
                {title}
              </Title>
            )}
            {description && <Description>{description}</Description>}
          </Titles>
          {actions && <div data-card-actions="">{actions}</div>}
        </Header>
      )}
      {children && <Body>{children}</Body>}
      {footer ? <Footer data-card-footer="">{footer}</Footer> : <EndSpacer />}
    </Root>
  )
}

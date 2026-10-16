import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { fontSizes, fontWeights, lineHeights } from '../../theme/theme'
import type { ColorName, FontSize, FontWeight, LineHeight } from '../../theme/theme'

/** Theme text colors only, so every option passes contrast in both modes. */
export type TextColor = 'default' | 'muted' | ColorName

export type TextProps<C extends ElementType = 'p'> = {
  /** Element to render: 'p' (default) for paragraphs, 'span' inline, 'label', 'strong', etc. */
  as?: C
  size?: FontSize
  weight?: FontWeight
  color?: TextColor
  align?: 'start' | 'center' | 'end'
  lineHeight?: LineHeight
  /** Caps the line length at about 65 characters, the comfortable range for reading. */
  measure?: boolean
  /**
   * Cuts text off with "…": true for one line, or a number of lines. The full text stays in the
   * page for screen readers, and plain-text children also get a tooltip (title).
   */
  truncate?: boolean | number
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'color' | 'children'>

type StyledProps = {
  $size: FontSize
  $weight: FontWeight
  $color: TextColor
  $align?: 'start' | 'center' | 'end'
  $lineHeight: LineHeight
  $measure: boolean
  $truncate?: boolean | number
}

const StyledText = styled.p<StyledProps>`
  /* Spacing between blocks comes from the parent's gap (e.g. Flex), not from text margins */
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ $size }) => fontSizes[$size]};
  font-weight: ${({ $weight }) => fontWeights[$weight]};
  line-height: ${({ $lineHeight }) => lineHeights[$lineHeight]};
  color: ${({ theme, $color }) =>
    $color === 'default'
      ? theme.text.default
      : $color === 'muted'
        ? theme.text.muted
        : theme.colors[$color].text};
  ${({ $align }) => $align && `text-align: ${$align};`}
  ${({ $measure }) => $measure && 'max-width: 65ch;'}

  ${({ $truncate }) =>
    $truncate === true || $truncate === 1
      ? css`
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `
      : typeof $truncate === 'number' &&
        css`
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${$truncate};
        `}
`

/** Body text in the theme's type scale and colors. For headings, use Heading. */
export function Text<C extends ElementType = 'p'>({
  as,
  size = 'md',
  weight = 'regular',
  color = 'default',
  align,
  lineHeight = 'normal',
  measure = false,
  truncate,
  children,
  ...rest
}: TextProps<C>) {
  // Truncated plain text gets the full version as a tooltip, unless the caller set a title
  const title = truncate && typeof children === 'string' ? children : undefined
  return (
    <StyledText
      as={as}
      $size={size}
      $weight={weight}
      $color={color}
      $align={align}
      $lineHeight={lineHeight}
      $measure={measure}
      $truncate={truncate}
      title={title}
      {...rest}
    >
      {children}
    </StyledText>
  )
}

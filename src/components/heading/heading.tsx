import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import type { FontSize, FontWeight } from '../../theme/theme'
import { Text } from '../text'
import type { TextColor } from '../text'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'color'> & {
  /**
   * Where the heading sits in the page outline, which screen reader users navigate by. Follow
   * the structure (one h1, then h2s, h3s under them…) and set the look with `size`.
   */
  level: HeadingLevel
  /** Visual size. Defaults to a size that suits the level. */
  size?: FontSize
  weight?: FontWeight
  color?: TextColor
  align?: 'start' | 'center' | 'end'
  /** Cuts the heading off with "…": true for one line, or a number of lines. */
  truncate?: boolean | number
  children: ReactNode
}

const sizeForLevel: Record<HeadingLevel, FontSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
}

// Balanced line breaks keep a long title from leaving one word alone on its last line
const Balanced = styled(Text)`
  text-wrap: balance;
`

/** A section heading. The level sets the HTML element (h1–h6); size sets how it looks. */
export function Heading({
  level,
  size,
  weight,
  color = 'default',
  align,
  truncate,
  children,
  ...rest
}: HeadingProps) {
  return (
    <Balanced
      // forwardedAs passes the element through to Text; plain `as` would replace Text entirely
      forwardedAs={`h${level}`}
      size={size ?? sizeForLevel[level]}
      weight={weight ?? (level <= 2 ? 'bold' : 'semibold')}
      lineHeight="tight"
      color={color}
      align={align}
      truncate={truncate}
      {...rest}
    >
      {children}
    </Balanced>
  )
}

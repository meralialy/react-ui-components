import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import styled from 'styled-components'
import { space } from '../../theme/theme'
import type { SpaceKey } from '../../theme/theme'
import { responsive } from '../shared/responsive'
import type { Responsive } from '../shared/responsive'
import { flexChildStyles } from './flex-child'
import type { FlexChildProps, FlexChildStyleProps } from './flex-child'

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export type FlexProps = HTMLAttributes<HTMLElement> &
  FlexChildProps & {
    /** Element to render, e.g. 'ul', 'nav' or 'section'. Defaults to 'div'. */
    as?: ElementType
    direction?: Responsive<FlexDirection>
    /** Space between children, from the theme's spacing scale (gap={4} → 16px). */
    gap?: Responsive<SpaceKey>
    /** Cross-axis alignment (align-items). */
    align?: Responsive<FlexAlign>
    /** Main-axis distribution (justify-content). */
    justify?: Responsive<FlexJustify>
    wrap?: Responsive<boolean>
    /** Render as inline-flex so it only takes the width of its content. */
    inline?: boolean
    children?: ReactNode
    ref?: Ref<HTMLElement>
  }

const alignValues: Record<FlexAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyValues: Record<FlexJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

type StyledProps = FlexChildStyleProps & {
  $direction: Responsive<FlexDirection>
  $gap?: Responsive<SpaceKey>
  $align?: Responsive<FlexAlign>
  $justify?: Responsive<FlexJustify>
  $wrap?: Responsive<boolean>
  $inline: boolean
}

const StyledFlex = styled.div<StyledProps>`
  display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};
  /* Lets flex children shrink below their content width instead of overflowing */
  min-width: 0;
  ${({ $direction }) => responsive($direction, (v) => `flex-direction: ${v};`)}
  ${({ $gap }) => responsive($gap, (v) => `gap: ${space[v]};`)}
  ${({ $align }) => responsive($align, (v) => `align-items: ${alignValues[v]};`)}
  ${({ $justify }) => responsive($justify, (v) => `justify-content: ${justifyValues[v]};`)}
  ${({ $wrap }) => responsive($wrap, (v) => `flex-wrap: ${v ? 'wrap' : 'nowrap'};`)}
  ${flexChildStyles}
`

/**
 * Lays out children in a row or column with consistent spacing. Every layout prop can change
 * at a breakpoint: direction={{ base: 'column', md: 'row' }}.
 */
export function Flex({
  as,
  direction = 'row',
  gap,
  align,
  justify,
  wrap,
  inline = false,
  grow,
  shrink,
  ref,
  children,
  ...rest
}: FlexProps) {
  return (
    <StyledFlex
      as={as}
      // styled.div types its ref as a div; any element is fine at runtime
      ref={ref as Ref<HTMLDivElement>}
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $inline={inline}
      $grow={grow}
      $shrink={shrink}
      {...rest}
    >
      {children}
    </StyledFlex>
  )
}

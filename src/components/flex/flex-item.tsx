import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import styled from 'styled-components'
import { responsive } from '../shared/responsive'
import type { Responsive } from '../shared/responsive'
import { flexChildStyles } from './flex-child'
import type { FlexChildProps, FlexChildStyleProps } from './flex-child'

export type FlexItemProps = HTMLAttributes<HTMLElement> &
  FlexChildProps & {
    /** Element to render, e.g. 'li' inside a Flex rendered as 'ul'. Defaults to 'div'. */
    as?: ElementType
    /**
     * Starting size along the main axis (flex-basis): width in a row, height in a column.
     * A number is pixels; strings take any CSS length, e.g. '25%'. Combines with grow/shrink.
     */
    basis?: Responsive<number | string>
    children?: ReactNode
    ref?: Ref<HTMLElement>
  }

const StyledItem = styled.div<FlexChildStyleProps & { $basis?: Responsive<number | string> }>`
  /* Lets the item shrink below its content width (e.g. long text) instead of overflowing */
  min-width: 0;
  ${flexChildStyles}
  ${({ $basis }) =>
    responsive($basis, (v) => `flex-basis: ${typeof v === 'number' ? `${v}px` : v};`)}
`

/** Wraps any child of a Flex to control how it grows or shrinks, e.g. a field that fills a row. */
export function FlexItem({ as, grow, shrink, basis, ref, children, ...rest }: FlexItemProps) {
  return (
    <StyledItem
      as={as}
      // styled.div types its ref as a div; any element is fine at runtime
      ref={ref as Ref<HTMLDivElement>}
      $grow={grow}
      $shrink={shrink}
      $basis={basis}
      {...rest}
    >
      {children}
    </StyledItem>
  )
}

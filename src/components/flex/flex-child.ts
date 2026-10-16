import { css } from 'styled-components'
import { responsive } from '../shared/responsive'
import type { Responsive } from '../shared/responsive'

// How an element behaves as a child of a Flex. Shared by Flex (when nested) and FlexItem.

export type FlexChildProps = {
  /** Take up remaining space. true = 1; a number sets its share relative to other growers. */
  grow?: Responsive<boolean | number>
  /** false keeps it at its natural size instead of shrinking when space is tight. */
  shrink?: Responsive<boolean>
}

export type FlexChildStyleProps = {
  $grow?: FlexChildProps['grow']
  $shrink?: FlexChildProps['shrink']
}

export const flexChildStyles = css<FlexChildStyleProps>`
  ${({ $grow }) => responsive($grow, (v) => `flex-grow: ${v === true ? 1 : v === false ? 0 : v};`)}
  ${({ $shrink }) => responsive($shrink, (v) => `flex-shrink: ${v ? 1 : 0};`)}
`

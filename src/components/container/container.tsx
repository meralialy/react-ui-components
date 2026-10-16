import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import styled from 'styled-components'
import { space } from '../../theme/theme'
import { responsive } from '../shared/responsive'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  /** Element to render, e.g. 'main' or 'section'. Defaults to 'div'. */
  as?: ElementType
  /** Maximum width. Matches the breakpoints, so `lg` content fits a 1024px screen exactly. */
  size?: ContainerSize
  /** Side padding that grows with the screen (16 → 24 → 32px), so content never touches the edge. */
  gutters?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

const containerWidths: Record<ContainerSize, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: 'none',
}

const StyledContainer = styled.div<{ $size: ContainerSize; $gutters: boolean }>`
  width: 100%;
  /* Includes the gutters, so the outer edge lines up with the breakpoint widths */
  max-width: ${({ $size }) => containerWidths[$size]};
  margin-inline: auto;
  ${({ $gutters }) =>
    $gutters &&
    responsive({ base: 4, md: 6, lg: 8 } as const, (v) => `padding-inline: ${space[v]};`)}
`

/** Centers page content and caps its width, with responsive side padding. */
export function Container({
  as,
  size = 'lg',
  gutters = true,
  ref,
  children,
  ...rest
}: ContainerProps) {
  return (
    <StyledContainer
      as={as}
      // styled.div types its ref as a div; any element is fine at runtime
      ref={ref as Ref<HTMLDivElement>}
      $size={size}
      $gutters={gutters}
      {...rest}
    >
      {children}
    </StyledContainer>
  )
}

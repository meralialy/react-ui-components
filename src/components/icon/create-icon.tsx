import type { ReactNode, SVGProps } from 'react'
import styled from 'styled-components'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref' | 'children'> & {
  /**
   * xs 12, sm 16, md 20, lg 24 or xl 32px, or any number of px. Defaults to 1em, so the icon
   * matches the text it sits next to.
   */
  size?: IconSize | number
  /**
   * Makes the icon meaningful to screen readers (role="img" with this name). Leave it out for
   * decorative icons next to visible text, which are then hidden from assistive tech.
   */
  label?: string
  strokeWidth?: number
}

const sizes: Record<IconSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }

const Svg = styled.svg`
  flex-shrink: 0;
  /* Sits on the text baseline when used inline */
  vertical-align: -0.125em;
`

/**
 * Turns 24×24 SVG content into an icon component. Strokes and fills use currentColor, so icons
 * take the surrounding text color.
 */
export function createIcon(displayName: string, content: ReactNode) {
  function Icon({ size, label, strokeWidth = 1.75, ...rest }: IconProps) {
    const px = size === undefined ? '1em' : typeof size === 'number' ? size : sizes[size]
    const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }
    return (
      <Svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        {...a11y}
        {...rest}
      >
        {content}
      </Svg>
    )
  }
  Icon.displayName = displayName
  return Icon
}

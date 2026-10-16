import { lightPalette } from './palettes'
import type { Palette } from './palettes'

export { colorNames } from './palettes'
export type { ColorName, ColorPalette, Palette } from './palettes'

type TokenTree = { [key: string]: string | TokenTree }

const toKebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** `{ colors: { primary: { main: '#2563eb' } } }` → `[['--colors-primary-main', '#2563eb']]` */
export function flattenTokens(tree: TokenTree, prefix = '-'): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const name = `${prefix}-${toKebab(key)}`
    return typeof value === 'string' ? [[name, value]] : flattenTokens(value, name)
  })
}

/** Same shape as the input, with every value replaced by its `var(--…)` reference. */
function toVarRefs<T extends TokenTree>(tree: T, prefix = '-'): T {
  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => {
      const name = `${prefix}-${toKebab(key)}`
      return [key, typeof value === 'string' ? `var(${name})` : toVarRefs(value, name)]
    }),
  ) as T
}

/** Spacing scale in 4px steps. Layout props like `gap` take these keys, e.g. gap={4} → 16px. */
export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export type SpaceKey = keyof typeof space

/** Min-width breakpoints, mobile first. */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const

export type Breakpoint = keyof typeof breakpoints

/** Type scale in rem, so text follows the user's browser font size setting (WCAG 1.4.4). */
export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
} as const

export type FontSize = keyof typeof fontSizes

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export type FontWeight = keyof typeof fontWeights

/** Unitless, so they scale with the font size. Body text uses `normal` or looser. */
export const lineHeights = {
  tight: 1.25,
  snug: 1.4,
  normal: 1.5,
  relaxed: 1.7,
} as const

export type LineHeight = keyof typeof lineHeights

export const theme = {
  ...toVarRefs<Palette>(lightPalette),
  space,
  breakpoints,
  fontSizes,
  fontWeights,
  lineHeights,
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  // Shadows only add depth; popovers also get a border so they stay distinct in dark mode.
  shadow: {
    popover: '0 8px 24px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.08)',
  },
  fontFamily: 'system-ui, sans-serif',
}

export type Theme = typeof theme

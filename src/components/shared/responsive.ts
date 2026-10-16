import { breakpoints } from '../../theme/theme'
import type { Breakpoint } from '../../theme/theme'

/**
 * A prop that's either one value, or different values from each breakpoint up (mobile first):
 * `direction={{ base: 'column', md: 'row' }}`.
 */
export type Responsive<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>)

const order: Breakpoint[] = ['sm', 'md', 'lg', 'xl']

const isBreakpointMap = <T>(
  value: Responsive<T>,
): value is { base?: T } & Partial<Record<Breakpoint, T>> =>
  typeof value === 'object' && value !== null

/** Turns a responsive prop into CSS: the base value, then a min-width media query per breakpoint. */
export function responsive<T>(value: Responsive<T> | undefined, toCss: (value: T) => string) {
  if (value === undefined) return ''
  if (!isBreakpointMap(value)) return toCss(value)

  const rules = value.base === undefined ? [] : [toCss(value.base)]
  for (const bp of order) {
    const v = value[bp]
    if (v !== undefined) rules.push(`@media (min-width: ${breakpoints[bp]}) { ${toCss(v)} }`)
  }
  return rules.join('\n')
}

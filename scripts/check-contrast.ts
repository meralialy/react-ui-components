// Verifies every palette pairing meets WCAG 2.2 AA in both color modes.
// 4.5:1 for text, 3:1 for non-text UI such as the focus ring.
import { colorNames, darkPalette, lightPalette } from '../src/theme/palettes.ts'
import type { Palette } from '../src/theme/palettes.ts'

type Rgba = [number, number, number, number]

function parse(color: string): Rgba {
  const hex = color.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1]
  }
  const rgba = color.match(/^rgba?\(([^)]+)\)$/)
  if (rgba) {
    const [r, g, b, a = 1] = rgba[1].split(',').map(Number)
    return [r, g, b, a]
  }
  throw new Error(`Unsupported color: ${color}`)
}

/** Flattens a translucent color onto the opaque color underneath it. */
function composite(top: string, [br, bg, bb]: Rgba): Rgba {
  const [r, g, b, a] = parse(top)
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1]
}

function luminance([r, g, b]: Rgba) {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function contrast(fg: Rgba, bg: Rgba) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

type Check = { label: string; fg: string; bg: string; over: string; min: number }

function checksFor(p: Palette): Check[] {
  const checks: Check[] = []
  const surfaces = { page: p.background.page, card: p.background.card }

  for (const [surfaceName, surface] of Object.entries(surfaces)) {
    const add = (label: string, fg: string, bg: string, min = 4.5) =>
      checks.push({ label: `${label} on ${surfaceName}`, fg, bg, over: surface, min })

    add('text.default', p.text.default, surface)
    add('text.muted', p.text.muted, surface)
    add('focusRing', p.focusRing, surface, 3)
    add('field.border', p.field.border, surface, 3)
    add('field.background vs field.border', p.field.border, p.field.background, 3)
    add('field text', p.text.default, p.field.background)
    add('field placeholder', p.field.placeholder, p.field.background)
    add('field helper text', p.text.muted, surface)
    add('field error border', p.colors.danger.text, p.field.background, 3)
    add('field disabled text', p.text.default, p.field.disabledBackground)
    // Toggle: off track against the page, and the white thumb against both track states
    add('toggle off track', p.field.border, surface, 3)
    add('toggle thumb / off track', p.colors.primary.contrastText, p.field.border, 3)
    add('toggle thumb / on track', p.colors.primary.contrastText, p.colors.primary.main, 3)
    // Alert / Toast: body text on each status tint (status-colored icon/title pairs are covered above)
    for (const status of ['info', 'success', 'warning', 'danger'] as const) {
      add(`alert text / ${status} tint`, p.text.default, p.colors[status].subtle)
      add(`alert accent / ${status}`, p.colors[status].text, surface, 3)
    }
    // Progress fill uses the status text shade so the bar stays 3:1 against the track and page
    add('progress fill / track', p.colors.primary.text, p.colors.secondary.subtle, 3)
    // Tabs: unselected label, selected label and indicator on the page
    add('tab unselected', p.text.muted, surface)
    add('tab selected + indicator', p.colors.primary.text, surface)
    // Links
    add('link', p.colors.primary.text, surface)
    // Badge / Avatar: subtle variants use text on tint (covered above); striped table rows
    add('table text / stripe', p.text.default, p.colors.secondary.subtle)
    add('table header', p.text.muted, surface)
    // Segmented control: selected segment against the track, and its label
    add('segmented selected / track', p.colors.primary.main, p.field.background, 3)
    // Menu items (e.g. SplitButton), at rest and highlighted
    add('menu item / highlighted', p.text.default, p.colors.secondary.subtle)
    add('menu danger item', p.colors.danger.text, surface)
    add('menu danger item / highlighted', p.colors.danger.text, p.colors.secondary.subtle)
    // Checked checkbox edge (the fill itself may be lower; the border carries the boundary)
    add('checkbox checked border', p.colors.primary.text, surface, 3)
    add('checkbox error border', p.colors.danger.text, surface, 3)

    for (const name of colorNames) {
      const c = p.colors[name]
      add(`${name}.contrastText / main`, c.contrastText, c.main)
      add(`${name}.contrastText / hover`, c.contrastText, c.hover)
      add(`${name}.contrastText / active`, c.contrastText, c.active)
      add(`${name}.text`, c.text, surface)
      add(`${name}.text / subtle`, c.text, c.subtle)
      add(`${name}.text / subtleActive`, c.text, c.subtleActive)
    }
  }
  return checks
}

let failures = 0
for (const [mode, palette] of Object.entries({ light: lightPalette, dark: darkPalette })) {
  for (const { label, fg, bg, over, min } of checksFor(palette)) {
    const background = composite(bg, parse(over))
    const ratio = contrast(composite(fg, background), background)
    if (ratio < min) {
      failures++
      console.log(`FAIL  ${mode.padEnd(5)}  ${label.padEnd(40)} ${ratio.toFixed(2)} < ${min}`)
    }
  }
}

if (failures) {
  console.log(`\n${failures} pairing(s) below WCAG AA.`)
  process.exit(1)
}
console.log('All pairings meet WCAG AA in light and dark mode.')

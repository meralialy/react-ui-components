// Public API of the package. Everything an app imports comes from here; the docs site
// (src/pages, src/docs) is not part of the package.

// Setup
export { UIProvider } from './provider/ui-provider'
export type { UIProviderProps } from './provider/ui-provider'

// Components
export * from './components/alert'
export * from './components/avatar'
export * from './components/badge'
export * from './components/breadcrumbs'
export * from './components/button'
export * from './components/card'
export * from './components/checkbox'
export * from './components/container'
export * from './components/flex'
export * from './components/heading'
export * from './components/icon'
export * from './components/input'
export * from './components/link'
export * from './components/menu'
export * from './components/modal'
export * from './components/pagination'
export * from './components/popover'
export * from './components/progress'
export * from './components/radio'
export * from './components/segmented-control'
export * from './components/select'
export * from './components/spinner'
export * from './components/split-button'
export * from './components/table'
export * from './components/tabs'
export * from './components/text'
export * from './components/textarea'
export * from './components/toast'
export * from './components/toggle'
export * from './components/tooltip'

// Theme tokens, for building your own components that match
export {
  theme,
  colorNames,
  space,
  breakpoints,
  fontSizes,
  fontWeights,
  lineHeights,
} from './theme/theme'
export type {
  Theme,
  ColorName,
  ColorPalette,
  Palette,
  SpaceKey,
  Breakpoint,
  FontSize,
  FontWeight,
  LineHeight,
} from './theme/theme'
export { lightPalette, darkPalette } from './theme/palettes'
// Light/dark/system switching, e.g. for a settings toggle
export { useColorMode } from './theme/use-color-mode'
export type { ColorMode } from './theme/use-color-mode'
// Responsive prop type used by Flex and FlexItem
export type { Responsive } from './components/shared/responsive'

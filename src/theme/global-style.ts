import { createGlobalStyle } from 'styled-components'
import { darkPalette, lightPalette } from './palettes'
import type { Palette } from './palettes'
import { flattenTokens } from './theme'

const declarations = (palette: Palette) =>
  flattenTokens(palette)
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n')

// Required by every component: the color variables for both modes, and border-box sizing (so a
// 40px field is exactly 40px). `data-theme` on <html> forces a mode; otherwise the OS decides.
export const ThemeVariables = createGlobalStyle`
  :root {
    ${declarations(lightPalette)}
    color-scheme: light;
  }

  :root[data-theme='dark'] {
    ${declarations(darkPalette)}
    color-scheme: dark;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
      ${declarations(darkPalette)}
      color-scheme: dark;
    }
  }

  /* Sizes include borders and padding, so a 40px field is 40px tall like a 40px button */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`

// Optional page defaults: the themed background, text color, font and link color.
export const BaseStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    background-color: ${({ theme }) => theme.background.page};
    color: ${({ theme }) => theme.text.default};
  }

  a {
    color: ${({ theme }) => theme.colors.primary.text};
  }
`

import { css } from 'styled-components'

/** Hides content visually while keeping it available to screen readers. */
export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`

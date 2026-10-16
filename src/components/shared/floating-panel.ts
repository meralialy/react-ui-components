import styled, { keyframes } from 'styled-components'

const appear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97);
  }
`

/**
 * Base for floating surfaces (Popover, Menu). Positioned by useFloating; rendered in a portal so
 * parent overflow or z-index can't clip it.
 */
export const FloatingPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.background.card};
  box-shadow: ${({ theme }) => theme.shadow.popover};
  color: ${({ theme }) => theme.text.default};
  font-family: ${({ theme }) => theme.fontFamily};
  animation: ${appear} 120ms ease-out;

  &:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

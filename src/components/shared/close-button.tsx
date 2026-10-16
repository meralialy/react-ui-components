import type { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

// Icon-only dismiss button for Alert and Toast. 32px keeps it an adequate touch target.
const StyledCloseButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -6px -6px -6px 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.colors.secondary.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 1px;
  }
`

export function CloseButton({
  label = 'Dismiss',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
  return (
    <StyledCloseButton type="button" aria-label={label} {...rest}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="m4 4 8 8M12 4l-8 8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </StyledCloseButton>
  )
}

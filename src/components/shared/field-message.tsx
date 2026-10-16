import type { ReactNode } from 'react'
import styled from 'styled-components'
import { ErrorIcon } from './error-icon'

export type FieldMessageProps = {
  id: string
  invalid: boolean
  /** Left indent, e.g. to line up with a checkbox's label text rather than its box. */
  indent?: string
  className?: string
  children: ReactNode
}

const Message = styled.p<{ $invalid: boolean; $indent?: string }>`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  padding-left: ${({ $indent }) => $indent ?? 0};
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${({ theme, $invalid }) => ($invalid ? theme.colors.danger.text : theme.text.muted)};

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

/** Helper text, or an error message with an icon, shown below a form control. */
export function FieldMessage({ id, invalid, indent, className, children }: FieldMessageProps) {
  return (
    <Message id={id} $invalid={invalid} $indent={indent} className={className}>
      {invalid && <ErrorIcon />}
      <span>{children}</span>
    </Message>
  )
}

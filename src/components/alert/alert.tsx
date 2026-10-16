import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { CloseButton } from '../shared/close-button'
import { StatusIcon } from '../shared/status-icon'
import type { Status } from '../shared/status-icon'

export type AlertStatus = Status

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  status?: AlertStatus
  /** Short summary in bold, e.g. "Payment failed". */
  title?: ReactNode
  /** Details and what to do next. */
  children?: ReactNode
  /** Buttons or links shown under the message, e.g. "Try again". */
  actions?: ReactNode
  /** Shows a dismiss button and calls this when it's pressed. You decide whether to hide it. */
  onDismiss?: () => void
  /**
   * Set when the alert appears in response to something the user did, so screen readers
   * announce it: warning/danger interrupt (role="alert"), info/success wait (role="status").
   * Leave off for alerts that are part of the page on load.
   */
  announce?: boolean
}

const Root = styled.div<{ $status: AlertStatus }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme, $status }) => theme.colors[$status].text};
  /* A thicker leading edge in the status color makes the type scannable at a glance */
  border-left-width: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, $status }) => theme.colors[$status].subtle};
  color: ${({ theme }) => theme.text.default};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.9375rem;
  line-height: 1.5;
`

const Icon = styled.span<{ $status: AlertStatus }>`
  display: inline-flex;
  flex-shrink: 0;
  /* Line the icon up with the first line of text */
  margin-top: 2px;
  color: ${({ theme, $status }) => theme.colors[$status].text};
`

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const Title = styled.p`
  margin: 0;
  font-weight: 600;
`

const Description = styled.div`
  > p {
    margin: 0;
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

const roles: Record<AlertStatus, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
}

/** An inline message about the page or a recent action, styled by status. */
export function Alert({
  status = 'info',
  title,
  children,
  actions,
  onDismiss,
  announce = false,
  ...rest
}: AlertProps) {
  return (
    <Root $status={status} role={announce ? roles[status] : undefined} {...rest}>
      <Icon $status={status}>
        <StatusIcon status={status} />
      </Icon>
      <Body>
        {title && <Title>{title}</Title>}
        {children && <Description>{children}</Description>}
        {actions && <Actions>{actions}</Actions>}
      </Body>
      {onDismiss && <CloseButton onClick={onDismiss} />}
    </Root>
  )
}

import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { CloseButton } from '../shared/close-button'

export type ModalSize = 'sm' | 'md' | 'lg'

export type ModalProps = {
  open: boolean
  /** Called when the user asks to close: Escape, the close button, or clicking the backdrop. */
  onClose: () => void
  /** Names the dialog for screen readers and is shown as its heading. */
  title: ReactNode
  /** Optional line under the title, also read by screen readers when the dialog opens. */
  description?: ReactNode
  children?: ReactNode
  /** Actions, usually buttons, aligned to the end. Put the primary action last. */
  footer?: ReactNode
  size?: ModalSize
  /**
   * When false, Escape, the backdrop and the close button don't close it, so the user has to
   * choose an action in the footer. For decisions that can't be skipped.
   */
  dismissible?: boolean
}

const widths: Record<ModalSize, string> = { sm: '400px', md: '560px', lg: '720px' }

const show = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
`

// The native <dialog> provides focus trapping, Escape, returning focus on close, and the top layer.
const Dialog = styled.dialog<{ $size: ModalSize }>`
  width: calc(100% - 32px);
  max-width: ${({ $size }) => widths[$size]};
  max-height: calc(100% - 64px);
  padding: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
  box-shadow: ${({ theme }) => theme.shadow.popover};
  color: ${({ theme }) => theme.text.default};
  font-family: ${({ theme }) => theme.fontFamily};

  &[open] {
    display: flex;
    flex-direction: column;
    animation: ${show} 160ms ease-out;
  }

  &::backdrop {
    background-color: rgba(15, 23, 42, 0.55);
    animation: ${fadeIn} 160ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    &[open],
    &::backdrop {
      animation: none;
    }
  }
`

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 16px;
`

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
`

const DescriptionText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.text.muted};
`

// Long content scrolls inside the body; the header and footer stay visible.
const Body = styled.div`
  flex: 1;
  padding: 0 24px 16px;
  overflow-y: auto;
  font-size: 0.9375rem;
  line-height: 1.5;
`

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`

/** A dialog that blocks the page until the user responds or dismisses it. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // Stop the page behind from scrolling while open
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  // A click whose target is the dialog element itself landed on the backdrop
  function onClick(e: MouseEvent<HTMLDialogElement>) {
    if (dismissible && e.target === e.currentTarget) onClose()
  }

  return (
    <Dialog
      ref={ref}
      $size={size}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={onClick}
      onCancel={(e) => {
        // Escape: keep React in charge of the open state
        e.preventDefault()
        if (dismissible) onClose()
      }}
    >
      {open && (
        <>
          <Header>
            <Titles>
              <Title id={titleId}>{title}</Title>
              {description && <DescriptionText id={descriptionId}>{description}</DescriptionText>}
            </Titles>
            {dismissible && <CloseButton label="Close" onClick={onClose} />}
          </Header>
          {children && <Body>{children}</Body>}
          {footer && <Footer>{footer}</Footer>}
        </>
      )}
    </Dialog>
  )
}

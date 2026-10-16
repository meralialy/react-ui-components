import type { FieldsetHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import { FieldMessage } from './field-message'
import { RequiredMark } from './required-mark'
import { visuallyHidden } from './visually-hidden'

type FieldGroupOrientation = 'vertical' | 'horizontal'

export type FieldGroupProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  /** The question the options answer, rendered as the fieldset's legend. */
  label: ReactNode
  /** Hides the legend visually but keeps it for screen readers, when a nearby heading names the group. */
  hideLabel?: boolean
  helperText?: ReactNode
  /** Group-level error. Replaces the helper text. */
  error?: ReactNode
  required?: boolean
  /** Add "(required)" for screen readers when the inputs can't carry native `required`. */
  announceRequired?: boolean
  orientation?: FieldGroupOrientation
  children: ReactNode
}

// A fieldset + legend, so screen readers announce the question along with each option.

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  font-family: ${({ theme }) => theme.fontFamily};
`

const Legend = styled.legend<{ $hidden: boolean }>`
  padding: 0;
  margin-bottom: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};

  ${({ $hidden }) => $hidden && visuallyHidden}
`

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`

const Options = styled.div<{ $orientation: FieldGroupOrientation }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'column' : 'row')};
  flex-wrap: wrap;
  gap: ${({ $orientation }) => ($orientation === 'vertical' ? '8px' : '8px 24px')};
`

const GroupMessage = styled(FieldMessage)`
  margin-top: 4px;
`

export function FieldGroup({
  label,
  hideLabel = false,
  helperText,
  error,
  required,
  announceRequired = false,
  orientation = 'vertical',
  children,
  id,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: FieldGroupProps) {
  const generatedId = useId()
  const messageId = `${id ?? generatedId}-message`

  const invalid = Boolean(error)
  const message = invalid ? error : helperText
  const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

  return (
    <Fieldset id={id} aria-describedby={describedBy || undefined} {...rest}>
      <Legend $hidden={hideLabel}>
        {label}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
        {required && announceRequired && <VisuallyHidden> (required)</VisuallyHidden>}
      </Legend>
      <Options $orientation={orientation}>{children}</Options>
      {message && (
        <GroupMessage id={messageId} invalid={invalid}>
          {message}
        </GroupMessage>
      )}
    </Fieldset>
  )
}

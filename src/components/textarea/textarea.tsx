import type { ChangeEvent, ReactNode, Ref, TextareaHTMLAttributes } from 'react'
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { mergeRefs } from '../../utils/merge-refs'
import { FieldLabel, FieldRoot, fieldBox, fieldSizes } from '../shared/field'
import type { FieldBoxProps, FieldSize } from '../shared/field'
import { FieldMessage } from '../shared/field-message'
import { RequiredMark } from '../shared/required-mark'
import { visuallyHidden } from '../shared/visually-hidden'

export type TextareaSize = FieldSize

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  /** Always required for accessibility; use `hideLabel` to hide it visually. */
  label: ReactNode
  hideLabel?: boolean
  helperText?: ReactNode
  /** Puts the field in an error state and replaces the helper text with this message. */
  error?: ReactNode
  size?: TextareaSize
  /** Visible lines before scrolling (or the starting height with autoResize). */
  rows?: number
  /** Grow with the content instead of scrolling, up to `maxRows`. */
  autoResize?: boolean
  maxRows?: number
  /**
   * Shows a character count and a soft limit: users can type past it and see how much to cut,
   * instead of pasted text being silently truncated. Enforce it in your validation.
   */
  characterLimit?: number
  ref?: Ref<HTMLTextAreaElement>
}

const paddingY = { sm: '6px', md: '8px', lg: '10px' }

const StyledTextarea = styled.textarea<FieldBoxProps & { $resize: 'vertical' | 'none' }>`
  ${fieldBox}
  display: block;
  width: 100%;
  margin: 0;
  padding: ${({ $size }) => `${paddingY[$size]} ${fieldSizes[$size].paddingX}`};
  font-family: inherit;
  line-height: 1.5;
  resize: ${({ $resize }) => $resize};
  outline-offset: 1px;

  &::placeholder {
    color: ${({ theme }) => theme.field.placeholder};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const Count = styled.span<{ $over: boolean }>`
  flex-shrink: 0;
  margin-left: auto;
  font-size: 0.8125rem;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $over }) => ($over ? theme.colors.danger.text : theme.text.muted)};
  font-weight: ${({ $over }) => ($over ? 600 : 400)};
`

// Visually hidden text: the full count for screen readers, and the debounced live announcement.
const LiveRegion = styled.span`
  ${visuallyHidden}
`

const countText = (length: number, limit: number) => {
  const remaining = limit - length
  if (remaining >= 0) return `${remaining} character${remaining === 1 ? '' : 's'} remaining`
  return `${-remaining} character${remaining === -1 ? '' : 's'} too many`
}

export function Textarea({
  label,
  hideLabel = false,
  helperText,
  error,
  size = 'md',
  rows = 3,
  autoResize = false,
  maxRows,
  characterLimit,
  id,
  required,
  disabled,
  className,
  style,
  ref,
  value,
  defaultValue,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const messageId = `${textareaId}-message`
  const countId = `${textareaId}-count`

  const innerRef = useRef<HTMLTextAreaElement>(null)
  const mergedRef = useMemo(() => mergeRefs(innerRef, ref), [ref])

  // Track length for the counter in both controlled and uncontrolled use.
  const [uncontrolledLength, setUncontrolledLength] = useState(String(defaultValue ?? '').length)
  const length = value !== undefined ? String(value).length : uncontrolledLength
  const over = characterLimit !== undefined && length > characterLimit

  // Announce the count only after the user types, and once typing pauses, so screen readers
  // aren't flooded per keystroke or on page load.
  const [hasTyped, setHasTyped] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    if (characterLimit === undefined || !hasTyped) return
    const timeout = setTimeout(() => setAnnouncement(countText(length, characterLimit)), 1000)
    return () => clearTimeout(timeout)
  }, [length, characterLimit, hasTyped])

  const resize = useCallback(() => {
    const el = innerRef.current
    if (!el || !autoResize) return
    const styles = getComputedStyle(el)
    const borders = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    const lineHeight = parseFloat(styles.lineHeight)
    const max = maxRows ? lineHeight * maxRows + padding + borders : Infinity

    el.style.height = 'auto'
    const needed = el.scrollHeight + borders
    el.style.height = `${Math.min(needed, max)}px`
    el.style.overflowY = needed > max ? 'auto' : 'hidden'
  }, [autoResize, maxRows])

  // Re-measure after every render that could change the content or the size rules.
  useLayoutEffect(() => {
    resize()
  }, [resize, value, size])

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (value === undefined) setUncontrolledLength(e.target.value.length)
    setHasTyped(true)
    resize()
    onChange?.(e)
  }

  const invalid = Boolean(error)
  const message = invalid ? error : helperText
  const describedBy = [
    ariaDescribedBy,
    message ? messageId : undefined,
    characterLimit !== undefined ? countId : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <FieldRoot className={className} style={style}>
      <FieldLabel htmlFor={textareaId} $hidden={hideLabel}>
        {label}
        {/* Screen readers announce "required" from the native attribute, so the mark is visual only */}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </FieldLabel>
      <StyledTextarea
        ref={mergedRef}
        id={textareaId}
        rows={rows}
        $size={size}
        $invalid={invalid || over}
        $disabled={Boolean(disabled)}
        $resize={autoResize ? 'none' : 'vertical'}
        required={required}
        disabled={disabled}
        aria-invalid={invalid || over || undefined}
        aria-describedby={describedBy || undefined}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...rest}
      />
      {(message || characterLimit !== undefined) && (
        <Footer>
          {message && (
            <FieldMessage id={messageId} invalid={invalid}>
              {message}
            </FieldMessage>
          )}
          {characterLimit !== undefined && (
            <>
              {/* Read on focus via aria-describedby; the live region handles updates */}
              <Count id={countId} $over={over}>
                <span aria-hidden="true">
                  {over ? countText(length, characterLimit) : `${length} / ${characterLimit}`}
                </span>
                <LiveRegion>{countText(length, characterLimit)}</LiveRegion>
              </Count>
              <LiveRegion aria-live="polite">{announcement}</LiveRegion>
            </>
          )}
        </Footer>
      )}
    </FieldRoot>
  )
}

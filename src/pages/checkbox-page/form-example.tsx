import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Checkbox, CheckboxGroup } from '../../components/checkbox'

const channels = ['Email', 'SMS', 'Push notifications']

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 480px;
`

const Success = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success.text};
`

/**
 * Two common rules: pick at least one from a group, and accept a single required checkbox.
 * Errors appear on submit and clear as soon as the rule is met.
 */
export function FormExample() {
  const [selected, setSelected] = useState<string[]>([])
  const [accepted, setAccepted] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firstChannelRef = useRef<HTMLInputElement>(null)
  const termsRef = useRef<HTMLInputElement>(null)

  const channelError =
    showErrors && selected.length === 0 ? 'Choose at least one channel.' : undefined
  const termsError = showErrors && !accepted ? 'Accept the terms to continue.' : undefined

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    if (selected.length === 0) firstChannelRef.current?.focus()
    else if (!accepted) termsRef.current?.focus()
    else setSubmitted(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <CheckboxGroup
        label="How should we contact you?"
        helperText="Select all that apply."
        error={channelError}
        required
        name="channels"
        value={selected}
        onChange={(next) => {
          setSelected(next)
          setSubmitted(false)
        }}
      >
        {channels.map((channel, i) => (
          <Checkbox
            key={channel}
            ref={i === 0 ? firstChannelRef : undefined}
            value={channel}
            label={channel}
          />
        ))}
      </CheckboxGroup>

      <Checkbox
        ref={termsRef}
        label="I agree to the terms of service"
        required
        checked={accepted}
        onChange={(e) => {
          setSubmitted(false)
          setAccepted(e.target.checked)
        }}
        error={termsError}
      />

      <div>
        <Button type="submit">Save preferences</Button>
      </div>
      <div aria-live="polite">{submitted && <Success>Preferences saved.</Success>}</div>
    </Form>
  )
}

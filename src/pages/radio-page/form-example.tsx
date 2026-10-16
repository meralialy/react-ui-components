import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Radio, RadioGroup } from '../../components/radio'

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
 * A required choice with no default: sometimes there's no safe option to preselect, so the
 * user must choose. Errors appear on submit and clear once an option is picked.
 */
export function FormExample() {
  const [contact, setContact] = useState('')
  const [showError, setShowError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firstOptionRef = useRef<HTMLInputElement>(null)

  const error = showError && !contact ? 'Choose how we should contact you.' : undefined

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setShowError(true)
    if (!contact) firstOptionRef.current?.focus()
    else setSubmitted(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <RadioGroup
        label="Preferred contact method"
        name="contact"
        required
        value={contact}
        onChange={(value) => {
          setContact(value)
          setSubmitted(false)
        }}
        error={error}
      >
        <Radio ref={firstOptionRef} value="email" label="Email" />
        <Radio value="phone" label="Phone" />
        <Radio value="post" label="Post" />
      </RadioGroup>
      <div>
        <Button type="submit">Continue</Button>
      </div>
      <div aria-live="polite">{submitted && <Success>Saved: {contact}.</Success>}</div>
    </Form>
  )
}

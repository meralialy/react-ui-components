import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Textarea } from '../../components/textarea'

const LIMIT = 200

function validate(feedback: string) {
  if (!feedback.trim()) return 'Enter your feedback.'
  if (feedback.length > LIMIT) return `Feedback must be ${LIMIT} characters or fewer.`
  return undefined
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
`

const Success = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success.text};
`

/**
 * Required, with a soft character limit: going over shows a count, and submitting shows an
 * error explaining the rule. Errors re-check as the user edits once they've appeared.
 */
export function FormExample() {
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextError = validate(feedback)
    setError(nextError)
    if (nextError) ref.current?.focus()
    else setSubmitted(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Textarea
        ref={ref}
        label="Feedback"
        name="feedback"
        required
        autoResize
        maxRows={8}
        characterLimit={LIMIT}
        helperText="What could we do better?"
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value)
          setSubmitted(false)
          if (error) setError(validate(e.target.value))
        }}
        error={error}
      />
      <div>
        <Button type="submit">Send feedback</Button>
      </div>
      <div aria-live="polite">{submitted && <Success>Thanks for your feedback.</Success>}</div>
    </Form>
  )
}

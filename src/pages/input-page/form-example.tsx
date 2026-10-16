import type { ChangeEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Input } from '../../components/input'

type Values = { name: string; email: string }
type Errors = Partial<Record<keyof Values, string>>

function validate({ name, email }: Values): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = 'Enter your full name.'
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter an email address like name@example.com.'
  }
  return errors
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
`

const Success = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success.text};
`

/**
 * Validates on submit, then live once a field has shown an error, so users aren't scolded
 * while still typing. Focus moves to the first invalid field.
 */
export function FormExample() {
  const [values, setValues] = useState<Values>({ name: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof Values) => (e: ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    setSubmitted(false)
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    // Fields in on-screen order, so focus lands on the first problem the user would reach.
    const firstInvalid = [
      { error: nextErrors.name, ref: nameRef },
      { error: nextErrors.email, ref: emailRef },
    ].find((field) => field.error)
    if (firstInvalid) firstInvalid.ref.current?.focus()
    else setSubmitted(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Input
        ref={nameRef}
        label="Full name"
        autoComplete="name"
        required
        value={values.name}
        onChange={update('name')}
        error={errors.name}
      />
      <Input
        ref={emailRef}
        label="Email"
        type="email"
        autoComplete="email"
        required
        helperText="We'll send a confirmation link."
        value={values.email}
        onChange={update('email')}
        error={errors.email}
      />
      <div>
        <Button type="submit">Create account</Button>
      </div>
      <div aria-live="polite">{submitted && <Success>Account created.</Success>}</div>
    </Form>
  )
}

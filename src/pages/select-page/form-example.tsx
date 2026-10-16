import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import { Select } from '../../components/select'

const roles = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product', label: 'Product' },
  { value: 'sales', label: 'Sales' },
  { value: 'other', label: 'Other' },
]

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

/** A required select with no default, validated on submit; the error clears once a choice is made. */
export function FormExample() {
  const [role, setRole] = useState('')
  const [showError, setShowError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  const error = showError && !role ? 'Select your role.' : undefined

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setShowError(true)
    if (!role) selectRef.current?.focus()
    else setSubmitted(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Select
        ref={selectRef}
        label="Role"
        name="role"
        placeholder="Select your role"
        required
        options={roles}
        value={role}
        onChange={(e) => {
          setRole(e.target.value)
          setSubmitted(false)
        }}
        error={error}
      />
      <div>
        <Button type="submit">Continue</Button>
      </div>
      <div aria-live="polite">{submitted && <Success>Saved.</Success>}</div>
    </Form>
  )
}

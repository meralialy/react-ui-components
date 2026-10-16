import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../components/button'

export type CodeBlockProps = {
  code: string
  /** Accessible name for the code region, e.g. "Generated code" */
  label?: string
}

const Wrapper = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.page};
`

// Copy lives in a toolbar rather than over the code, so it never covers long scrolling lines.
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.muted};
`

const Pre = styled.pre`
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.default};
`

export function CodeBlock({ code, label = 'Code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      // Clipboard blocked (e.g. insecure context); the code is still selectable.
    }
  }

  return (
    <Wrapper>
      <Toolbar>
        <span>{label}</span>
        <Button size="sm" variant="ghost" color="secondary" onClick={copy}>
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </Toolbar>
      <Pre aria-label={label} tabIndex={0}>
        <code>{code}</code>
      </Pre>
    </Wrapper>
  )
}

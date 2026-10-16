import { useState } from 'react'
import styled from 'styled-components'
import { Toggle } from '../../components/toggle'

const settings = [
  {
    key: 'mentions',
    label: 'Mentions',
    helperText: 'When someone @mentions you in a comment.',
  },
  {
    key: 'replies',
    label: 'Replies',
    helperText: 'When someone replies to a thread you started.',
  },
  {
    key: 'digest',
    label: 'Weekly digest',
    helperText: 'A summary of activity every Monday.',
  },
] as const

type SettingKey = (typeof settings)[number]['key']

const Panel = styled.div`
  max-width: 480px;
`

const PanelHeading = styled.h3`
  margin: 0 0 4px;
  font-size: 1rem;
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 14px 0;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  li:last-child {
    border-bottom: none;
  }
`

const Status = styled.p`
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.muted};
`

/** Toggles apply immediately: no Save button. A short status confirms each change. */
export function SettingsExample() {
  const [values, setValues] = useState<Record<SettingKey, boolean>>({
    mentions: true,
    replies: true,
    digest: false,
  })
  const [status, setStatus] = useState('')

  return (
    <Panel>
      <PanelHeading id="notify-heading">Email me about</PanelHeading>
      <List aria-labelledby="notify-heading">
        {settings.map((setting) => (
          <li key={setting.key}>
            <Toggle
              label={setting.label}
              helperText={setting.helperText}
              labelPlacement="start"
              checked={values[setting.key]}
              onChange={(e) => {
                const on = e.target.checked
                setValues((prev) => ({ ...prev, [setting.key]: on }))
                setStatus(`${setting.label} ${on ? 'on' : 'off'}. Saved.`)
              }}
            />
          </li>
        ))}
      </List>
      <Status aria-live="polite">{status}</Status>
    </Panel>
  )
}

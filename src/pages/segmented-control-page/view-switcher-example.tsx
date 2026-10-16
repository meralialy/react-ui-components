import { useState } from 'react'
import styled from 'styled-components'
import { SegmentedControl } from '../../components/segmented-control'
import { GridIcon, ListIcon } from './icons'

const files = ['Brief.pdf', 'Budget.xlsx', 'Logo.svg', 'Notes.md', 'Photo.jpg', 'Plan.docx']

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
`

const Items = styled.ul<{ $view: string }>`
  display: grid;
  grid-template-columns: ${({ $view }) =>
    $view === 'grid' ? 'repeat(auto-fill, minmax(120px, 1fr))' : '1fr'};
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: ${({ $view }) => ($view === 'grid' ? '28px 12px' : '10px 12px')};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radius.md};
    text-align: ${({ $view }) => ($view === 'grid' ? 'center' : 'left')};
    font-size: 0.875rem;
  }
`

/** A typical use: switching how content is shown. The label is hidden; the heading gives context. */
export function ViewSwitcherExample() {
  const [view, setView] = useState('list')

  return (
    <div>
      <Header>
        <Title>Files</Title>
        <SegmentedControl
          label="Show files as"
          hideLabel
          iconOnly
          size="sm"
          options={[
            { value: 'list', label: 'List', icon: <ListIcon /> },
            { value: 'grid', label: 'Grid', icon: <GridIcon /> },
          ]}
          value={view}
          onChange={setView}
        />
      </Header>
      <Items $view={view}>
        {files.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </Items>
    </div>
  )
}

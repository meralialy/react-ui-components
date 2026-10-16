import styled from 'styled-components'

// Layout shared by component playgrounds: a live preview stage above a grid of prop controls.

export const PlaygroundCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
  overflow: hidden;
`

export const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 160px;
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const StageNote = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.muted};
`

export const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px 24px;
  padding: 24px;
`

export const Options = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  grid-column: 1 / -1;
  margin: 0;
  padding: 0;
  border: none;

  legend {
    margin-bottom: 6px;
    padding: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.muted};
  }
`

export const PlaygroundFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 24px 24px;
`

export const CodeWrapper = styled.div`
  margin-top: 16px;
`

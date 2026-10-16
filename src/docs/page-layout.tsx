import styled from 'styled-components'

// Building blocks shared by every component docs page.

export const PageTitle = styled.h1`
  margin: 0 0 8px;
`

export const PageIntro = styled.p`
  margin: 0 0 32px;
  color: ${({ theme }) => theme.text.muted};
`

export const Section = styled.section`
  margin-bottom: 40px;
`

export const Heading = styled.h2`
  margin: 0 0 16px;
  font-size: 1.25rem;
`

export const Description = styled.p`
  margin: -8px 0 16px;
  color: ${({ theme }) => theme.text.muted};
`

export const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.background.card};
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const RowLabel = styled.span`
  width: 72px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.muted};
`

/** Responsive grid for examples that need room, like form fields. */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  align-items: start;
`

export const Guidelines = styled.ul`
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;

  li + li {
    margin-top: 6px;
  }
`

import styled from 'styled-components'

/** Placeholder child for layout demos, sized so alignment differences are visible. */
export const DemoBox = styled.div<{ $tall?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  /* Fill the FlexItem it sits in, so the item's size (basis, stretch) is what you see */
  height: 100%;
  min-height: ${({ $tall }) => ($tall ? '72px' : '40px')};
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary.text};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.primary.subtle};
  color: ${({ theme }) => theme.colors.primary.text};
  font-size: 0.875rem;
  font-weight: 600;
`

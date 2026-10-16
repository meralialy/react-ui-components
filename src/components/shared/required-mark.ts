import styled from 'styled-components'

/** Visual "*" after a label. Always render with aria-hidden; announce "required" another way. */
export const RequiredMark = styled.span`
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.danger.text};
`

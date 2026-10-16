import { Link } from 'react-router'
import { PageIntro, PageTitle } from '../../docs/page-layout'

export function NotFoundPage() {
  return (
    <>
      <PageTitle>Page not found</PageTitle>
      <PageIntro>
        There's no component at this address. Pick one from the list, or go to the{' '}
        <Link to="/">home page</Link>.
      </PageIntro>
    </>
  )
}

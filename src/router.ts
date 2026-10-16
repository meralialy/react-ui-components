import { createBrowserRouter } from 'react-router'
import { DocsLayout } from './docs/docs-layout'
import { componentPages } from './pages/component-pages'
import { HomePage } from './pages/home-page'
import { NotFoundPage } from './pages/not-found-page'

export type RouteHandle = { title?: string }

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DocsLayout,
    children: [
      { index: true, Component: HomePage },
      ...componentPages.map(({ path, title, Component }) => ({
        path,
        Component,
        handle: { title } satisfies RouteHandle,
      })),
      { path: '*', Component: NotFoundPage, handle: { title: 'Page not found' } },
    ],
  },
])

import { RouterProvider } from 'react-router/dom'
import { router } from './router'
import { UIProvider } from './provider/ui-provider'

// The docs site uses the same provider that apps consuming the package use.
function App() {
  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  )
}

export default App

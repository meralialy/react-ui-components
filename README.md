# React UI Components

Accessible React components with light and dark themes, built with styled-components. This repo
holds both the component package (`src/components`, built to `dist/`) and its docs site
(`src/pages`, `src/docs`, built to `dist-docs/`).

## Using the package in an app

Install it with its peer dependencies, which the app provides:

```sh
yarn add react-ui-components react react-dom styled-components
```

Wrap the app once in `UIProvider`. It sets up the theme, light/dark colors and toasts:

```tsx
import { Button, Input, UIProvider } from 'react-ui-components'

createRoot(document.getElementById('root')!).render(
  <UIProvider>
    <Input label="Email" type="email" />
    <Button>Save</Button>
  </UIProvider>,
)
```

`UIProvider` options:

- `baseStyles={false}`: skip the page defaults (body background, text color, font, link color)
  if your app styles those itself. Color variables and `box-sizing` always apply, because the
  components depend on them.
- `toast={{ placement: 'top-right' }}`: options for toasts.

Light/dark follows the OS by default. To let users choose, use `useColorMode()` (it sets
`data-theme` on `<html>`). To avoid a flash of the wrong theme on load, copy the small inline
script from this repo's `index.html` into your app's `<head>`.

TypeScript projects should use `"moduleResolution": "bundler"` (the default for Vite and
Next.js).

## Getting started

```sh
yarn install
yarn dev
```

## Scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `yarn dev`            | Start the dev server               |
| `yarn build`          | Type-check and build the docs site |
| `yarn build:lib`      | Build the package into `dist/`     |
| `yarn check:contrast` | Check theme colors meet WCAG AA    |
| `yarn preview`        | Preview the production build       |
| `yarn lint`           | Run ESLint                         |
| `yarn lint:fix`       | Run ESLint and fix problems        |
| `yarn format`         | Format all files with Prettier     |
| `yarn format:check`   | Check formatting                   |
| `yarn typecheck`      | Run the TypeScript compiler        |

## Git hooks

A Husky pre-commit hook runs lint-staged, which applies `eslint --fix` and `prettier --write` to staged files.

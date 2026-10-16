import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y-x'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import localNaming from './eslint-rules/kebab-case.js'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // Accessibility checks on JSX (labels, alt text, valid ARIA, keyboard support). Strict
      // preset; the maintained fork of eslint-plugin-jsx-a11y, which supports ESLint 10.
      jsxA11y.configs.strict,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*'],
    plugins: { 'local-naming': localNaming },
    rules: {
      'local-naming/kebab-case': 'error',
    },
  },
  prettier,
])

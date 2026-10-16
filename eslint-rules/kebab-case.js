import path from 'node:path'

// Enforces kebab-case file and folder names under src/ (e.g. split-button/split-button.tsx).
// A local rule instead of eslint-plugin-check-file, so linting pulls in no dependencies: that
// plugin's micromatch → braces chain carries an unpatched advisory (GHSA-vfj7-8cjw-p6xm).

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require kebab-case file and folder names under src/' },
    schema: [],
    messages: {
      file: 'File name "{{name}}" should be kebab-case, e.g. "split-button.tsx".',
      folder: 'Folder "{{name}}" should be kebab-case, e.g. "split-button".',
    },
  },
  create(context) {
    return {
      Program(node) {
        const segments = path.relative(context.cwd, context.filename).split(path.sep)
        const srcIndex = segments.indexOf('src')
        if (srcIndex === -1) return

        const fileName = segments.at(-1)
        // Only the part before the first dot, so "button.tsx" and "styled.d.ts" are judged as
        // "button" and "styled"
        if (!kebabCase.test(fileName.split('.')[0])) {
          context.report({ node, messageId: 'file', data: { name: fileName } })
        }
        for (const folder of segments.slice(srcIndex + 1, -1)) {
          if (!kebabCase.test(folder)) {
            context.report({ node, messageId: 'folder', data: { name: folder } })
          }
        }
      },
    }
  },
}

export default {
  meta: { name: 'local-naming' },
  rules: { 'kebab-case': rule },
}

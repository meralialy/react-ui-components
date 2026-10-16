// Helpers for playgrounds that generate JSX snippets.

/** Escapes text that JSX would otherwise treat as markup or an expression. */
const jsxText = (text: string) => (/[{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text)

/** `name="value"`, or `name={"…"}` when the value contains characters a plain attribute can't hold. */
export const jsxString = (name: string, value: string) =>
  /["{}\\\n]/.test(value) ? `${name}={${JSON.stringify(value)}}` : `${name}="${value}"`

const MAX_LINE = 80

const indent = (code: string) =>
  code
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')

/**
 * Formats an element, breaking props onto their own lines when the opening tag gets long.
 * `children` is either text, or already-formatted child elements (e.g. from jsxElement).
 */
export function jsxElement(tag: string, props: string[], children?: string | string[]) {
  const selfClosing = children === undefined
  const close = selfClosing ? ' />' : '>'
  const singleLine = props.length ? `<${tag} ${props.join(' ')}${close}` : `<${tag}${close}`
  const open =
    singleLine.length <= MAX_LINE
      ? singleLine
      : `<${tag}\n  ${props.join('\n  ')}\n${selfClosing ? '/>' : '>'}`

  if (selfClosing) return open
  const body = Array.isArray(children) ? children.join('\n') : jsxText(children)
  return `${open}\n${indent(body)}\n</${tag}>`
}

/**
 * Declares a stand-in icon so generated snippets compile when pasted. Users swap in their own
 * icon component (from an icon library or their design system).
 */
export const placeholderIcon = (name: string, glyph = '●') =>
  `const ${name} = () => <span aria-hidden="true">${glyph}</span> // replace with your icon`

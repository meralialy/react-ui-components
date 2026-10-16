import type { Ref, RefCallback } from 'react'

/** Combines refs so a component can keep its own ref while still forwarding the caller's. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) assignRef(ref, node)
  }
}

/** Sets a ref of either kind (callback or object) to a value. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

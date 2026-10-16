import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export type DismissReason = 'escape' | 'outside'

/**
 * Calls onDismiss when the user presses Escape or clicks/taps outside every element in `inside`
 * (typically the trigger and the floating panel). Only listens while open.
 */
export function useDismiss(
  open: boolean,
  inside: RefObject<HTMLElement | null>[],
  onDismiss: (reason: DismissReason) => void,
) {
  // Keep the latest callback without re-subscribing listeners on every render
  const callback = useRef(onDismiss)
  useEffect(() => {
    callback.current = onDismiss
  })

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!inside.some((ref) => ref.current?.contains(target))) callback.current('outside')
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') callback.current('escape')
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
    // `inside` is a fresh array each render; the refs inside it are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}

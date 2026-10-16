import type { RefObject } from 'react'
import { useLayoutEffect, useRef } from 'react'

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

type FloatingOptions = {
  open: boolean
  anchor: RefObject<HTMLElement | null>
  side?: Side
  align?: Align
  /** Gap between anchor and floating element, in px. */
  offset?: number
}

const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
const VIEWPORT_MARGIN = 8

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

/**
 * Positions a `position: fixed` element next to its anchor. Flips to the opposite side when
 * there isn't room, keeps it inside the viewport, and follows scroll and resize. Writes styles
 * directly to the element, so positioning never causes a React re-render. Attach the returned
 * ref to the floating element.
 */
export function useFloating<T extends HTMLElement = HTMLDivElement>({
  open,
  anchor,
  side = 'bottom',
  align = 'center',
  offset = 8,
}: FloatingOptions) {
  const floating = useRef<T>(null)

  useLayoutEffect(() => {
    const anchorEl = anchor.current
    const floatingEl = floating.current
    if (!open || !anchorEl || !floatingEl) return

    const update = () => {
      const a = anchorEl.getBoundingClientRect()
      const width = floatingEl.offsetWidth
      const height = floatingEl.offsetHeight
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight

      const space: Record<Side, number> = {
        top: a.top,
        bottom: vh - a.bottom,
        left: a.left,
        right: vw - a.right,
      }
      const needed = (side === 'top' || side === 'bottom' ? height : width) + offset
      const placed =
        space[side] < needed && space[opposite[side]] > space[side] ? opposite[side] : side

      let top: number
      let left: number
      if (placed === 'top' || placed === 'bottom') {
        top = placed === 'top' ? a.top - offset - height : a.bottom + offset
        left =
          align === 'start'
            ? a.left
            : align === 'end'
              ? a.right - width
              : a.left + (a.width - width) / 2
      } else {
        left = placed === 'left' ? a.left - offset - width : a.right + offset
        top =
          align === 'start'
            ? a.top
            : align === 'end'
              ? a.bottom - height
              : a.top + (a.height - height) / 2
      }

      floatingEl.style.left = `${clamp(left, VIEWPORT_MARGIN, vw - width - VIEWPORT_MARGIN)}px`
      floatingEl.style.top = `${clamp(top, VIEWPORT_MARGIN, vh - height - VIEWPORT_MARGIN)}px`
      // Exposed for styling, e.g. an entry animation from the right direction
      floatingEl.dataset.side = placed
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(anchorEl)
    observer.observe(floatingEl)
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, anchor, side, align, offset])

  return floating
}

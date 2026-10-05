import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'

type Go = (label: string, midway: () => void) => Promise<void>
const Ctx = createContext<Go>(async (_l, m) => m())
export const usePageTransition = () => useContext(Ctx)

/**
 * Two-layer curtain that sweeps up across the viewport, swaps content underneath
 * while covered, then exits through the top. Used for every "page" change.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())

  const run = useCallback<Go>((text, midway) => {
    if (prefersReducedMotion() || !root.current) {
      midway()
      return Promise.resolve()
    }
    const el = root.current
    const [a, b] = el.querySelectorAll<HTMLDivElement>('.curtain-layer')
    if (label.current) label.current.textContent = text
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
          gsap.set(el, { pointerEvents: 'none' })
          resolve()
        },
      })
      tl.set(el, { pointerEvents: 'all' })
        .set([a, b], { y: 0, visibility: 'visible', yPercent: 100, borderRadius: '50% 50% 0 0 / 12% 12% 0 0' })
        .set('.curtain-label-inner', { yPercent: 110 })
        .to(a, { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: 0.7 })
        .to(b, { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: 0.7 }, 0.08)
        .to('.curtain-label-inner', { yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.45)
        .add(() => midway(), 0.8)
        .to('.curtain-label-inner', { yPercent: -110, duration: 0.35, ease: 'expo.in' }, 1.0)
        .to(b, { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 12% 12%', duration: 0.75 }, 1.2)
        .to(a, { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 12% 12%', duration: 0.75 }, 1.28)
    })
  }, [])

  // transitions requested while one is running wait their turn instead of being dropped
  const go = useCallback<Go>((text, midway) => {
    const next = queue.current.then(() => run(text, midway))
    queue.current = next
    return next
  }, [run])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className="curtain" ref={root} aria-hidden>
        <div className="curtain-layer curtain-a" />
        <div className="curtain-layer curtain-b">
          <span className="curtain-label">
            <span className="curtain-label-inner">
              <span className="curtain-dot" />
              <span ref={label} />
            </span>
          </span>
        </div>
      </div>
    </Ctx.Provider>
  )
}

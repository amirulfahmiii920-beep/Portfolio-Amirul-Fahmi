import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  // runs exactly once (StrictMode double-invokes effects in dev); the intro is never torn down
  useEffect(() => {
    if (started.current) return
    started.current = true
    const el = root.current!
    if (prefersReducedMotion()) {
      el.style.display = 'none'
      onDone()
      return
    }
    const counter = { v: 0 }
    gsap.context(() => {
      // wait until the first heavy frames (WebGL shader compile) are out of the way
      const tl = gsap.timeline({ delay: 0.35 })
      tl.from('.pl-word .mask-inner', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 })
        .to(counter, {
          v: 100,
          duration: 2.1,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        }, 0.1)
        .to('.pl-bar-fill', { scaleX: 1, duration: 2.1, ease: 'power3.inOut' }, 0.1)
        .to('.pl-word .mask-inner, .pl-count, .pl-meta', { yPercent: -110, opacity: 0, duration: 0.6, ease: 'expo.in', stagger: 0.03 })
        .add(() => onDone(), '-=0.1')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
        .set(el, { display: 'none' })
    }, el)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={root}>
      <div className="pl-top">
        <span className="pl-meta mono">Portfolio — 2026</span>
        <span className="pl-meta mono">Kajang, Selangor</span>
      </div>
      <div className="pl-center">
        <span className="pl-word mask-line"><span className="mask-inner">Amirul</span></span>
        <span className="pl-word mask-line serif"><span className="mask-inner">Fahmi</span></span>
      </div>
      <div className="pl-bottom">
        <div className="pl-bar"><div className="pl-bar-fill" /></div>
        <span className="pl-count"><span ref={num}>000</span></span>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'
import type { Shot } from '../data'

/**
 * Pinned filmstrip: scrolling down slides the screens sideways. The screen nearest the
 * centre comes forward; the others turn away in 3D and dim. Counter, chapter and caption
 * follow the active screen.
 */
export function ScreenReel({ shots, scroller, onOpen }: { shots: Shot[]; scroller: HTMLElement | null; onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!scroller || !root.current || !track.current) return
    const items = gsap.utils.toArray<HTMLElement>('.reel-item', root.current)
    const reduced = prefersReducedMotion()
    let current = 0

    // depth effect from each screen's distance to the viewport centre
    const shade = () => {
      const mid = window.innerWidth / 2
      let best = 0
      let bestD = Infinity
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const d = (r.left + r.width / 2 - mid) / window.innerWidth
        const a = Math.min(1, Math.abs(d) * 1.6)
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i }
        if (reduced) return
        gsap.set(el.querySelector('.phone'), {
          rotateY: gsap.utils.clamp(-28, 28, -d * 55),
          scale: 1 - a * 0.2,
          z: -a * 120,
          filter: `brightness(${1 - a * 0.55})`,
        })
      })
      if (best !== current) { current = best; setActive(best) }
    }

    const ctx = gsap.context(() => {
      const distance = () => track.current!.scrollWidth - window.innerWidth
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        // shade on the scrubbed tween itself so depth and counter track what is on screen
        onUpdate: shade,
        scrollTrigger: {
          trigger: root.current,
          scroller,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('.reel-progress-fill', { scaleX: self.progress }),
        },
      })
      gsap.from('.reel-item', {
        y: 120, autoAlpha: 0, stagger: 0.08, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, scroller, start: 'top 75%' },
      })
    }, root)
    shade()
    return () => ctx.revert()
  }, [scroller, shots])

  const chapter = shots[active].group
  return (
    <section className="reel" ref={root} aria-label="Screenshots">
      <div className="reel-head">
        <span className="mono dim">Screens</span>
        <span className="reel-chapter mono" key={chapter}>{chapter ?? ''}</span>
        <span className="mono reel-count">
          <span key={active} className="reel-count-n">{String(active + 1).padStart(2, '0')}</span>
          <span className="dim"> / {String(shots.length).padStart(2, '0')}</span>
        </span>
      </div>

      <div className="reel-ghost" aria-hidden>
        <span key={active}>{String(active + 1).padStart(2, '0')}</span>
      </div>

      <div className="reel-track" ref={track}>
        {shots.map((s, i) => (
          <figure className={`reel-item ${i === active ? 'is-active' : ''}`} key={i}>
            <button className="phone" onClick={() => onOpen(i)} data-cursor="view" data-cursor-label="Open" aria-label={`Open ${s.caption}`}>
              <img src={s.src} alt={s.caption} decoding="async" draggable={false} />
              <span className="phone-glare" aria-hidden />
            </button>
          </figure>
        ))}
      </div>

      <div className="reel-foot">
        <p className="reel-caption" key={active}><span className="serif">{shots[active].caption}</span></p>
        <div className="reel-progress" aria-hidden><div className="reel-progress-fill" /></div>
        <span className="mono dim reel-hint">Scroll to browse · tap to enlarge</span>
      </div>
    </section>
  )
}

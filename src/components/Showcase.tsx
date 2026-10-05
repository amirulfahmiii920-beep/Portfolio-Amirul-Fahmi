import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'
import { pics, type Project } from '../data'
import { ProjectArt } from './ProjectArt'
import { PhonePromo } from './PhonePromo'

const DURATION = 6 // seconds each screen stays on the billboard

/**
 * Streaming-service style showcase. The active screen is the billboard (full bleed,
 * slowly panning down its whole height) with its title, meta row and overview; below it
 * a "Top 10" style row of numbered poster cards picks the screen. Autoplays, pauses on hover.
 */
export function Showcase({ p, onOpen }: { p: Project; onOpen: (i: number) => void }) {
  const shots = p.shots!
  const n = shots.length
  const withPics = pics(p)
  const open = (i: number) => { const k = withPics.indexOf(shots[i] as (typeof withPics)[number]); if (k >= 0) onOpen(k) }
  // placeholder slides reuse the project's art, each shifted a little in hue so they read as different scenes
  const art = (i: number) => <ProjectArt p={{ ...p, shots: undefined, hue: p.hue + i * 16 }} />
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const timer = useRef<gsap.core.Tween | null>(null)
  const pausedRef = useRef(false)
  pausedRef.current = paused

  useEffect(() => {
    const el = root.current!
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const bg = el.querySelector<HTMLElement>(`.nx-bg[data-i="${active}"]`)!
      gsap.fromTo(bg, { autoAlpha: 0, scale: shots[active].still ? 1 : 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' })
      if (shots[active].promo) {
        // PhonePromo runs its own sequence
      } else if (!reduced && !bg.querySelector('img')) {
        gsap.fromTo(bg.querySelector('.art'), { scale: 1 }, { scale: 1.14, xPercent: -3, duration: DURATION + 2, ease: 'sine.inOut' })
      } else if (shots[active].frame === 'window') {
        gsap.fromTo(bg.querySelector('.nx-window'), { y: 30, rotateX: 8 }, { y: 0, rotateX: 0, duration: 1.4, ease: 'expo.out' })
      } else if (shots[active].frame === 'phone') {
        if (!reduced) gsap.fromTo(bg.querySelector('.nx-frame-phone img'), { objectPosition: '50% 0%' }, { objectPosition: '50% 100%', duration: DURATION + 2, ease: 'sine.inOut' })
      } else if (shots[active].still) {
        // shown whole and still
      } else if (!reduced && p.showcase === 'photos') {
        gsap.fromTo(bg.querySelector('.nx-bg-main'), { scale: 1.02 }, { scale: 1.12, duration: DURATION + 2, ease: 'sine.inOut' })
      } else if (!reduced) {
        gsap.fromTo(bg.querySelectorAll('img'), { objectPosition: '50% 0%' }, { objectPosition: '50% 100%', duration: DURATION + 2, ease: 'sine.inOut' })
      }
      gsap.fromTo('.nx-info > *', { y: 24, autoAlpha: 0, filter: 'blur(6px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.07, duration: 1, ease: 'expo.out', delay: 0.15 })
      timer.current = gsap.fromTo(
        `.nx-card[data-i="${active}"] .nx-progress-fill`,
        { scaleX: 0 },
        { scaleX: 1, duration: shots[active].seconds ?? DURATION, ease: 'none', onComplete: () => setActive((a) => (a + 1) % n) },
      )
      if (pausedRef.current) timer.current.pause()
    }, el)
    return () => ctx.revert()
  }, [active, n])

  useEffect(() => {
    if (paused) timer.current?.pause()
    else timer.current?.resume()
  }, [paused])

  // framed screens must stop above the "Behind" row, so expose the free height to CSS
  useEffect(() => {
    const el = root.current
    const head = el?.querySelector<HTMLElement>('.nx-row-head')
    if (!el || !head) return
    // offsets, not getBoundingClientRect: the row's entrance animation moves it with transforms
    const row = head.offsetParent as HTMLElement | null
    const wins = [...el.querySelectorAll<HTMLElement>('.nx-window')]
    const fit = () => {
      const free = (row && row !== el ? row.offsetTop : 0) + head.offsetTop - 20
      el.style.setProperty('--nx-free', `${free}px`)
      // narrow each window to its picture when the height is capped, so it never shows side bars
      const W = el.clientWidth, H = el.clientHeight
      for (const w of wins) {
        const img = w.querySelector('img'), bar = w.querySelector<HTMLElement>('.nx-window-bar')
        if (!img?.naturalWidth) continue
        const maxH = Math.min(0.58 * H, free - Math.max(0.12 * H, 96)) - (bar?.offsetHeight ?? 0) - 2
        w.style.setProperty('--w', `${Math.floor(Math.min(0.48 * W, 820, (maxH * img.naturalWidth) / img.naturalHeight))}px`)
      }
    }
    wins.forEach((w) => w.querySelector('img')?.addEventListener('load', fit))
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    ro.observe(head)
    if (head.parentElement) ro.observe(head.parentElement) // the row grows as its posters load
    fit()
    return () => {
      ro.disconnect()
      wins.forEach((w) => w.querySelector('img')?.removeEventListener('load', fit))
    }
  }, [])

  // keep the active poster in view when the row scrolls
  useEffect(() => {
    const card = root.current?.querySelector<HTMLElement>(`.nx-card[data-i="${active}"]`)
    const row = card?.closest<HTMLElement>('.nx-row-scroll')
    if (!card || !row || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: card.offsetLeft - row.clientWidth / 2 + card.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  const go = (d: number) => setActive((a) => (a + d + n) % n)
  const s = shots[active]

  return (
    <div
      className={`nx ${p.showcase === 'photos' ? 'nx-photos' : ''}`}
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${p.short} screens`}
    >
      {/* billboard */}
      <div className="nx-stage" aria-hidden>
        {shots.map((sh, i) => (
          <div className={`nx-bg ${i === active ? 'is-on' : ''} ${sh.src ? '' : 'nx-bg-art'} ${sh.still ? 'nx-bg-still' : ''}`} data-i={i} key={i}>
            {!sh.src ? art(i) : sh.promo ? (
              <PhonePromo shot={sh} play={i === active} />
            ) : sh.frame === 'window' ? (
              <>
                <img className="nx-bg-blur" src={sh.src} alt="" decoding="async" />
                <div className="nx-window">
                  <div className="nx-window-bar"><i /><i /><i /><span>{sh.file ?? 'code'}</span></div>
                  {sh.video ? <video poster={sh.src} autoPlay muted loop playsInline>{sh.video.webm ? <source src={sh.video.webm} type="video/webm" /> : null}<source src={sh.video.mp4} type="video/mp4" /></video> : <img src={sh.src} alt="" decoding="async" />}
                </div>
              </>
            ) : sh.frame === 'phone' ? (
              <>
                <img className="nx-bg-blur" src={sh.src} alt="" decoding="async" />
                <div className="nx-frame-phone" style={sh.ratio ? { aspectRatio: sh.ratio } : undefined}><img src={sh.src} alt="" decoding="async" /></div>
              </>
            ) : (
              <>
                <img className="nx-bg-blur" src={sh.src} alt="" decoding="async" />
                <img className="nx-bg-main" src={sh.src} alt="" decoding="async" style={sh.zoom ? ({ '--zoom': sh.zoom } as React.CSSProperties) : undefined} />
              </>
            )}
          </div>
        ))}
        <div className="nx-shade" />
      </div>

      <div className="nx-info" aria-live="polite">
        <span className="nx-series mono"><b>AF</b> Case study · {s.group ?? p.short}</span>
        <h3 className="nx-title">{s.caption}</h3>
        <div className="nx-meta">
          {p.award ? <span className="nx-match">Gold medal</span> : null}
          <span>{p.year}</span>
          <span>{String(active + 1).padStart(2, '0')} of {String(n).padStart(2, '0')}</span>
          {s.src ? <span className="nx-box nx-box-hd">HD</span> : null}
          <span className="nx-tags">{p.tags.map((t) => <span className="nx-box" key={t}>{t}</span>)}</span>
        </div>
        {s.about ? <p className="nx-about">{s.about}</p> : null}
        <div className="nx-actions">
          {s.src ? (
            <button className="nx-btn nx-btn-play" onClick={() => open(active)} data-cursor="hide">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
              {s.video ? 'Play clip' : s.file === 'output' ? 'View results' : /\.(ino|py|h|cpp|ts|js|dart)$/.test(s.file ?? '') ? 'View code' : s.diagram ? 'View diagram' : s.frame === 'window' ? 'View screen' : s.frame === 'phone' || p.showcase !== 'photos' ? 'View screen' : 'View photo'}
            </button>
          ) : (
            <button className="nx-btn nx-btn-play" onClick={() => go(1)} data-cursor="hide">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
              Next
            </button>
          )}
          <button className="nx-btn nx-btn-more" onClick={() => setPaused((v) => !v)} data-cursor="hide">
            {paused ? (
              <svg viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
            )}
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div className="nx-rating" aria-hidden>
        <span>{s.group ?? 'App'}</span>
      </div>

      {/* top-10 style row */}
      <div className="nx-row">
        <div className="nx-row-head">
          <h4>{!withPics.length ? `Inside ${p.short}` : p.showcase === 'photos' ? `Behind ${p.short}` : `Screens from ${p.short}`}</h4>
          <div className="nx-pager" aria-hidden>
            {shots.map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}
          </div>
        </div>
        <div className="nx-row-scroll" role="tablist" aria-label="Screens">
          {shots.map((sh, i) => (
            <button
              key={i}
              data-i={i}
              role="tab"
              aria-selected={i === active}
              aria-label={sh.caption}
              className={`nx-card ${i === active ? 'is-active' : ''}`}
              onClick={() => (i === active ? open(i) : setActive(i))}
              data-cursor="view"
              data-cursor-label={i === active && sh.src ? 'Open' : 'Play'}
            >
              <span className="nx-rank" aria-hidden>{i + 1}</span>
              <span className="nx-poster">
                {sh.src ? <img src={sh.src} alt="" decoding="async" className={sh.frame ? `is-${sh.frame}` : ''} /> : art(i)}
                {sh.group ? <span className="nx-poster-tag">{sh.group.split(' ')[0]}</span> : null}
                <span className="nx-pop">
                  <span className="nx-pop-title">{sh.caption}</span>
                  <span className="nx-pop-meta">{i === active ? 'Now showing' : 'Show this'}</span>
                </span>
                <span className="nx-progress"><span className="nx-progress-fill" /></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <button className="nx-arrow nx-arrow-l" onClick={() => go(-1)} aria-label="Previous screen" data-cursor="hide">‹</button>
      <button className="nx-arrow nx-arrow-r" onClick={() => go(1)} aria-label="Next screen" data-cursor="hide">›</button>
    </div>
  )
}

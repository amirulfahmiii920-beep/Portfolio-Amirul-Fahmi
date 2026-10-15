import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { projects, links, pics } from '../data'
import { gsap, lockScroll } from '../lib/smooth'
import { SectionHead } from '../components/SectionHead'
import { ProjectArt } from '../components/ProjectArt'
import { usePageTransition } from '../components/Transition'
import { ProjectPage } from './ProjectPage'

export function Work() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const go = usePageTransition()

  // floating preview follows the cursor with inertia + tilt from velocity
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = preview.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const rTo = gsap.quickTo(el, 'rotate', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6))
      lastX = e.clientX
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // while hovering a project with screenshots, the preview flips through them
  useEffect(() => {
    setTick(0)
    if (hover === null || !pics(projects[hover]).length) return
    const id = setInterval(() => setTick((t) => t + 1), 1100)
    return () => clearInterval(id)
  }, [hover])

  useEffect(() => {
    gsap.to(preview.current, { scale: hover === null ? 0 : 1, autoAlpha: hover === null ? 0 : 1, duration: 0.6, ease: 'expo.out' })
  }, [hover])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.work-row').forEach((row) => {
        gsap.from(row, { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 92%' } })
        gsap.from(row.querySelector('.work-rule'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: row, start: 'top 92%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const open = (i: number) =>
    go(projects[i].short, () => {
      setHover(null)
      setActive(i)
      lockScroll(true)
    })
  const close = useCallback(
    () =>
      go('Selected Work', () => {
        setActive(null)
        lockScroll(false)
      }),
    [go],
  )

  return (
    <section className="section work" id="work" ref={root} data-theme="dark">
      <SectionHead
        label="02 — Work"
        title="Selected Work"
        aside={
          <p>
            Eight projects across machine learning, generative AI, mobile, embedded systems and the web. Some started as coursework, none stayed that way.{' '}
            <a href={links.github} target="_blank" rel="noreferrer" className="u-link">All of it is on GitHub ↗</a>
          </p>
        }
      />

      <ol className="work-list" onMouseLeave={() => setHover(null)}>
        {projects.map((p, i) => (
          <li key={p.no} className={`work-row ${hover !== null && hover !== i ? 'is-dim' : ''}`}>
            <span className="work-rule" />
            <button
              className="work-btn"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => open(i)}
              data-cursor="view"
              data-cursor-label="View"
            >
              <span className="work-no mono">{p.no}</span>
              <span className="work-title">
                <span className="roll-v" data-text={p.short}><span>{p.short}</span></span>
              </span>
              <span className="work-line">{p.oneLiner}</span>
              <span className="work-tags mono">{p.tags.slice(0, 3).join(' · ')}</span>
              <span className="work-year mono">{p.award ? <span className="gold-pill">Gold</span> : null}{p.year}</span>
              <span className="work-fill" aria-hidden />
            </button>
            <ProjectArt p={p} className="work-art-mobile" />
          </li>
        ))}
      </ol>

      {createPortal(
        <div className="work-preview" ref={preview} aria-hidden>
          <div className="work-preview-stack" style={{ transform: `translateY(${-(hover ?? 0) * 100}%)` }}>
            {projects.map((p, i) => <ProjectArt p={p} key={p.no} variant="single" cycle={i === hover ? tick : 0} />)}
          </div>
        </div>,
        document.body,
      )}

      {active !== null ? (
        <ProjectPage
          key={active}
          index={active}
          onClose={close}
          onNext={() => {
            const n = (active + 1) % projects.length
            go(projects[n].short, () => setActive(n))
          }}
        />
      ) : null}
    </section>
  )
}

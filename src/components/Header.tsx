import { useEffect, useRef, useState } from 'react'
import { nav, links } from '../data'
import { gsap, lockScroll, scrollToId, ScrollTrigger } from '../lib/smooth'
import { usePageTransition } from './Transition'
import { Magnetic } from './ui/magnetic'

function useClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () =>
      setT(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date()))
    f()
    const id = setInterval(f, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function Header({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState({ no: '00', label: 'Index' })
  const header = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const go = usePageTransition()
  const clock = useClock()

  // hide on scroll down, reveal on scroll up; track current section
  useEffect(() => {
    if (!ready) return
    gsap.fromTo(header.current, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.6 })
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const hidden = self.direction === 1 && self.scroll() > 300
        header.current?.classList.toggle('is-hidden', hidden)
        header.current?.classList.toggle('is-scrolled', self.scroll() > 40)
        gsap.set('.progress-fill', { scaleY: self.progress })
      },
    })
    const sts = [{ id: 'top', no: '00', label: 'Index' }, ...nav].map((n) =>
      ScrollTrigger.create({
        trigger: `#${n.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (s) => s.isActive && setCurrent({ no: n.no ?? '00', label: n.label }),
      }),
    )
    return () => { st.kill(); sts.forEach((s) => s.kill()) }
  }, [ready])

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .set(menu.current, { visibility: 'visible' })
        .fromTo(menu.current, { clipPath: 'circle(0% at calc(100% - 3.5rem) 2.6rem)' }, { clipPath: 'circle(150% at calc(100% - 3.5rem) 2.6rem)', duration: 1.1 })
        .from('.menu-link .mask-inner', { yPercent: 120, rotate: 4, stagger: 0.05, duration: 0.9, ease: 'expo.out' }, 0.45)
        .from('.menu-foot > *', { opacity: 0, y: 20, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, 0.7)
    }, menu)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!tl.current) return
    lockScroll(open)
    if (open) tl.current.timeScale(1).play()
    else tl.current.timeScale(1.6).reverse()
  }, [open])

  const navigate = (id: string, label: string) => {
    if (open) {
      setOpen(false)
    }
    go(label, () => scrollToId(id, true))
  }

  return (
    <>
      <header className={`header ${open ? 'menu-open' : ''}`} ref={header}>
        <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); navigate('top', 'Index') }} data-cursor="link">
          <span className="logo-mark">AF</span>
          <span className="logo-copy">©2026</span>
        </a>
        <div className="header-section mono">
          <span className="hs-no">{current.no}</span>
          <span className="hs-slash">/</span>
          <span key={current.label} className="hs-label">{current.label}</span>
        </div>
        <nav className="header-nav">
          {nav.slice(0, 4).map((n) => (
            <a key={n.id} href={`#${n.id}`} className="roll" onClick={(e) => { e.preventDefault(); navigate(n.id, n.label) }}>
              <span data-text={n.label}>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="header-right">
          <span className="status mono">Open to work</span>
          <Magnetic intensity={0.35} range={80}>
            <button className={`menu-btn ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} data-cursor="hide">
              <span /><span />
            </button>
          </Magnetic>
        </div>
      </header>

      <div className="progress" aria-hidden><div className="progress-fill" /></div>

      <div className="menu" ref={menu} aria-hidden={!open}>
        <div className="menu-inner">
          <ul className="menu-list">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="menu-link" onClick={(e) => { e.preventDefault(); navigate(n.id, n.label) }} data-cursor="link">
                  <span className="mask-line"><span className="mask-inner"><sup className="mono">{n.no}</sup>{n.label}</span></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-foot">
            <div><span className="mono dim">Local time · KL</span><span className="mono">{clock}</span></div>
            <div><span className="mono dim">Email</span><a href={`mailto:${links.email}`} target="_blank" rel="noreferrer">{links.email}</a></div>
            <div><span className="mono dim">Elsewhere</span><span><a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · <a href={links.github} target="_blank" rel="noreferrer">GitHub</a></span></div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useEffect, useId, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'
import { pics, type Project } from '../data'

type Props = { p: Project; className?: string; variant?: 'single' | 'fan'; cycle?: number }

/** Cover art per project: a gradient field, with phone screenshots on top when the project has them, else a drawn motif. */
export function ProjectArt({ p, className = '', variant = 'fan', cycle = 0 }: Props) {
  const h = p.hue
  const id = `g${p.no}${useId().replace(/:/g, '')}`
  const hasPics = pics(p).length > 0
  return (
    <div className={`art ${className}`} style={{ ['--h' as string]: h }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id={`${id}-bg`} cx="70%" cy="20%" r="95%">
            <stop offset="0%" stopColor={`hsl(${h} 85% 58%)`} />
            <stop offset="45%" stopColor={`hsl(${h} 60% 22%)`} />
            <stop offset="100%" stopColor="#0b0b0c" />
          </radialGradient>
          <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,.18)" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#${id}-bg)`} />
        <rect width="400" height="300" fill={`url(#${id}-dots)`} />
        {hasPics ? null : (
          <g className="art-motif" stroke="#ecebe6" fill="none" strokeWidth="1.2">
            {motif(p.motif)}
          </g>
        )}
        <text x="20" y="282" className="art-tag" fill="#ecebe6">{p.no} / {p.short.toUpperCase()}</text>
      </svg>
      {hasPics ? <Devices p={p} variant={variant} cycle={cycle} /> : null}
    </div>
  )
}

/** Phone frames over the project's gradient. 'single' crossfades through every shot; 'fan' shows the first three. */
function Devices({ p, variant, cycle }: { p: Project; variant: 'single' | 'fan'; cycle: number }) {
  const shots = pics(p)
  if (p.showcase === 'photos') {
    // photographs fill the card; the hover preview crossfades through them
    const active = variant === 'single' ? cycle % shots.length : 0
    return (
      <div className="art-photos">
        {shots.map((s, i) => (
          <img key={i} src={s.src} alt="" className={i === active ? 'is-on' : ''} decoding="async" loading="lazy" />
        ))}
      </div>
    )
  }
  if (variant === 'single') {
    const active = cycle % shots.length
    return (
      <div className="devices devices-single">
        <div className="phone">
          {shots.map((s, i) => (
            <img key={i} src={s.src} alt="" className={i === active ? 'is-on' : ''} decoding="async" />
          ))}
        </div>
      </div>
    )
  }
  return <Fan shots={shots} />
}

/** Three stacked phones that fan out the first time they come into view. */
function Fan({ shots }: { shots: ReturnType<typeof pics> }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) return
    const [c, l, r] = Array.from(el.querySelectorAll<HTMLElement>('.phone'))
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    tl.from(c, { yPercent: 35, autoAlpha: 0, duration: 1.4 })
      .from([l, r], { x: 0, rotation: 0, scale: 0.8, autoAlpha: 0, duration: 1.6, stagger: 0.06 }, 0.35)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      // inside a case study the curtain is still lifting, so wait for it
      tl.delay(el.closest('.pp') ? 0.9 : 0.1).play()
      io.disconnect()
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); tl.revert() }
  }, [])
  return (
    <div className="devices devices-fan" ref={root}>
      {shots.slice(0, 3).map((s, i) => (
        <div className={`phone phone-${i}`} key={i}>
          <img src={s.src} alt="" decoding="async" />
        </div>
      ))}
    </div>
  )
}

function motif(m: Project['motif']) {
  switch (m) {
    case 'queue':
      return (
        <>
          <line x1="40" y1="110" x2="360" y2="110" opacity=".35" />
          <line x1="40" y1="180" x2="360" y2="180" opacity=".35" />
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={'a' + i} className="flow" cy="110" r="9" cx={60 + i * 44} style={{ animationDelay: `${-i * 0.6}s` }} fill="#ecebe6" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={'b' + i} className="flow slow" cy="180" r="9" cx={80 + i * 60} style={{ animationDelay: `${-i * 0.9}s` }} />
          ))}
          <text x="40" y="95" className="art-mini" fill="#ecebe6" stroke="none">SCREENING · RF₁</text>
          <text x="40" y="165" className="art-mini" fill="#ecebe6" stroke="none">DOCTOR · RF₂</text>
        </>
      )
    case 'leaf':
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} className="ripple" cx="200" cy="150" r={20 + i * 26} style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
          <path d="M200 90 C 240 130, 240 170, 200 210 C 160 170, 160 130, 200 90 Z" fill="#ecebe6" fillOpacity=".9" stroke="none" />
          <line x1="200" y1="120" x2="200" y2="200" stroke="#0b0b0c" />
        </>
      )
    case 'scan':
      return (
        <>
          <rect x="70" y="70" width="120" height="100" className="box" />
          <rect x="220" y="110" width="110" height="120" className="box b2" />
          <text x="72" y="64" className="art-mini" fill="#ecebe6" stroke="none">object 0.94</text>
          <text x="222" y="104" className="art-mini" fill="#ecebe6" stroke="none">object 0.88</text>
          <line className="scanline" x1="30" x2="370" y1="40" y2="40" strokeWidth="2" />
        </>
      )
    case 'orbit':
      return (
        <g className="orbit-g">
          <ellipse cx="200" cy="150" rx="150" ry="46" />
          <ellipse cx="200" cy="150" rx="150" ry="46" transform="rotate(60 200 150)" />
          <ellipse cx="200" cy="150" rx="150" ry="46" transform="rotate(-60 200 150)" />
          <circle cx="200" cy="150" r="22" fill="#ecebe6" />
        </g>
      )
    case 'check':
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(90 ${70 + i * 44})`}>
              <rect width="22" height="22" rx="4" />
              <path className="tick" d="M5 11 l5 5 l8 -10" style={{ animationDelay: `${i * 0.5}s` }} strokeWidth="2" />
              <line x1="40" y1="11" x2={180 + (i % 2) * 40} y2="11" opacity=".5" />
            </g>
          ))}
        </>
      )
    case 'grid':
      return (
        <>
          {Array.from({ length: 28 }).map((_, i) => {
            const x = 60 + (i % 7) * 42
            const y = 60 + Math.floor(i / 7) * 46
            const hot = [3, 9, 12, 17, 22, 26].includes(i)
            return <rect key={i} x={x} y={y} width="34" height="38" rx="3" className={hot ? 'cell hot' : 'cell'} style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
          })}
        </>
      )
    case 'sop':
      return (
        <>
          <rect x="120" y="50" width="160" height="200" rx="6" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1="140" y1={96 + i * 20} x2={i % 3 === 2 ? 220 : 260} y2={96 + i * 20} opacity=".45" />
          ))}
          <rect className="cite-mark" x="134" y="128" width="132" height="16" rx="2" fill="#ecebe6" stroke="none" />
          <text x="140" y="76" className="art-mini" fill="#ecebe6" stroke="none">SOP-01</text>
          <g className="cite-chip">
            <rect x="250" y="150" width="96" height="24" rx="12" fill="#0b0b0c" />
            <text x="262" y="166" className="art-mini" fill="#ecebe6" stroke="none">SOURCE §2</text>
          </g>
        </>
      )
    case 'tree':
      return (
        <>
          {[
            [200, 60, 120, 130], [200, 60, 280, 130], [120, 130, 80, 200], [120, 130, 160, 200], [280, 130, 240, 200], [280, 130, 320, 200],
          ].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} opacity=".6" />)}
          {[[200, 60], [120, 130], [280, 130], [80, 200], [160, 200], [240, 200], [320, 200]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="12" className="node" fill="#0b0b0c" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </>
      )
  }
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { projects, links, pics } from '../data'
import { gsap } from '../lib/smooth'
import { ProjectArt } from '../components/ProjectArt'
import { SplitChars } from '../lib/split'
import { Magnetic } from '../components/ui/magnetic'
import { Lightbox } from '../components/Lightbox'
import { Showcase } from '../components/Showcase'

/** Full-screen case study, entered and exited through the curtain transition. */
export function ProjectPage({ index, onClose, onNext }: { index: number; onClose: () => void; onNext: () => void }) {
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]
  const root = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const lbOpen = useRef(false)
  lbOpen.current = lb !== null

  useEffect(() => {
    root.current?.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4, defaults: { ease: 'expo.out' } })
      tl.from('.pp-title .ch', { yPercent: 115, duration: 1.2, stagger: 0.02 })
        .from('.pp-meta > *', { autoAlpha: 0, y: 20, stagger: 0.06, duration: 1 }, 0.2)
        .from('.pp-hero', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0.1)
        .from(p.shots?.[0]?.still ? '.pp-hero > .art' : '.pp-hero > .art, .pp-hero .nx-stage', { scale: 1.3, duration: 1.8 }, 0.1)
        .from('.pp-hero .nx-row', { y: 80, autoAlpha: 0, duration: 1.2 }, 0.9)
        .from('.pp-body > *', { autoAlpha: 0, y: 30, stagger: 0.08, duration: 1 }, 0.5)

    }, root)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && !lbOpen.current && onClose()
    window.addEventListener('keydown', esc)
    return () => { ctx.revert(); window.removeEventListener('keydown', esc) }
  }, [index, onClose])

  return createPortal(
    <div className="pp" ref={root} data-lenis-prevent role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="pp-top">
        <span className="mono">Case {p.no} / 07</span>
        <Magnetic intensity={0.4} range={90}>
          <button className="pp-close" onClick={onClose} data-cursor="hide" aria-label="Close project">
            <span>Close</span><i />
          </button>
        </Magnetic>
      </div>

      <h1 className="pp-title"><SplitChars text={p.title} /></h1>

      <div className="pp-meta">
        <div><span className="mono dim">Role</span><span>{p.role}</span></div>
        <div><span className="mono dim">Year</span><span>{p.year}</span></div>
        <div><span className="mono dim">Stack</span><span>{p.tags.join(', ')}</span></div>
        {p.award ? <div><span className="mono dim">Recognition</span><span className="gold-text">{p.award}</span></div> : null}
      </div>

      <div className={`pp-hero ${p.shots ? 'pp-hero-sc' : ''}`}>
        {p.shots ? <Showcase p={p} onOpen={setLb} /> : <ProjectArt p={p} />}
      </div>

      <div className="pp-body">
        <p className="pp-oneliner serif">“{p.oneLiner}”</p>
        <p className="pp-text">{p.body}</p>
        <a className="u-link mono" href={links.github} target="_blank" rel="noreferrer">View on GitHub ↗</a>
      </div>

      {lb !== null ? <Lightbox wide={p.showcase === 'photos'} shots={pics(p)} index={lb} onIndex={setLb} onClose={() => setLb(null)} /> : null}

      <button className="pp-next" onClick={onNext} data-cursor="view" data-cursor-label="Next">
        <span className="mono dim">Next project — {next.no}</span>
        <span className="pp-next-title">{next.short}</span>
        <span className="pp-next-arrow">→</span>
      </button>
    </div>,
    document.body,
  )
}

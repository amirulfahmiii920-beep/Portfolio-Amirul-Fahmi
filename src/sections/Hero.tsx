import { useEffect, useRef } from 'react'
import { HeroScene } from '../components/HeroScene'
import { gsap, scrollToId } from '../lib/smooth'
import { SplitChars } from '../lib/split'
import { Magnetic } from '../components/ui/magnetic'

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)

  // intro: name rises char by char, tagline and meta fade in after
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.set('.hero-reveal', { autoAlpha: 1 })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero-canvas', { autoAlpha: 0, scale: 1.08, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.hero-hello .mask-inner', { yPercent: 110, duration: 1 }, 0.15)
        .from('.hero-name .ch', { yPercent: 115, rotate: 8, duration: 1.3, stagger: 0.035 }, 0.2)
        .from('.hero-first .mask-inner', { yPercent: 110, duration: 1.1 }, 0.35)
        .from('.hero-role', { autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: 1.4 }, 0.9)
        .from('.hero-tagline', { autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: 1.6 }, 1.05)
        .from('.hero-meta > *', { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, 1.2)
        .from('.hero-rule', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.8)
    }, root)
    return () => ctx.revert()
  }, [ready])

  // scroll parallax: each layer moves at its own speed
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(progress, { current: 1, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-canvas', { yPercent: 25, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-line-1', { xPercent: -14, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-line-2', { xPercent: 10, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-name', { yPercent: 40, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-copy', { yPercent: -60, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } })
      gsap.to('.hero-meta', { yPercent: -120, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '40% top' } })
      gsap.to('.hero-ghost', { xPercent: -30, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-vignette', { opacity: 1, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root} data-theme="dark">
      <div className="hero-ghost" aria-hidden>ENGINEER — ENGINEER —</div>
      <HeroScene progress={progress} ready={ready} />
      <div className="hero-vignette" aria-hidden />

      <div className="hero-content hero-reveal">
        <div className="hero-copy">
          <p className="hero-hello mono"><span className="mask-line"><span className="mask-inner">( Hello, I'm )</span></span></p>
        </div>
        <h1 className="hero-name">
          <span className="hero-first"><span className="mask-line"><span className="mask-inner serif">Muhammad</span></span></span>
          <span className="hero-line hero-line-1"><SplitChars text="AMIRUL" /></span>
          <span className="hero-line hero-line-2"><SplitChars text="FAHMI" /><span className="hero-dot">.</span></span>
        </h1>
        <div className="hero-rule" />
        <div className="hero-copy hero-copy-row">
          <p className="hero-role">AI &amp; Software<br />Engineer</p>
          <p className="hero-tagline">
            Computer Engineering graduate building <em className="serif">AI systems</em> that run in the real world.
          </p>
        </div>
      </div>

      <div className="hero-meta hero-reveal">
        <span className="mono">Kajang, Selangor</span>
        <span className="mono status-inline">Available from September 2026</span>
        <Magnetic intensity={0.4} range={90}>
          <button className="scroll-cue" onClick={() => scrollToId('about')} data-cursor="hide" aria-label="Scroll to about">
            <svg viewBox="0 0 100 100" className="scroll-cue-ring">
              <defs><path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <text><textPath href="#circ">SCROLL TO EXPLORE · SCROLL TO EXPLORE · </textPath></text>
            </svg>
            <span className="scroll-cue-arrow">↓</span>
          </button>
        </Magnetic>
      </div>
    </section>
  )
}

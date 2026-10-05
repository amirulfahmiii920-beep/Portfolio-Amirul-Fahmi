import { useEffect, useState } from 'react'
import { initSmooth, gsap, ScrollTrigger, prefersReducedMotion } from './lib/smooth'
import { TransitionProvider } from './components/Transition'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Work } from './sections/Work'
import { Stack } from './sections/Stack'
import { Experience } from './sections/Experience'
import { Education } from './sections/Education'
import { Awards } from './sections/Awards'
import { Contact } from './sections/Contact'
import { ScrollVelocityRow } from './components/ui/scroll-velocity-text'

function Bands() {
  const words = ['AI & Software Engineer', 'Built to ship', 'Machine learning', 'Embedded systems', 'Mobile', 'Web']
  return (
    <div className="bands" aria-hidden>
      <div className="band band-a">
        <ScrollVelocityRow baseVelocity={3}>
          {words.map((w) => <span className="band-item" key={w}>{w}<span className="band-star">✦</span></span>)}
        </ScrollVelocityRow>
      </div>
      <div className="band band-b">
        <ScrollVelocityRow baseVelocity={3} direction={-1}>
          {words.map((w) => <span className="band-item" key={w}>{w}<span className="band-star">✦</span></span>)}
        </ScrollVelocityRow>
      </div>
    </div>
  )
}

/** Scroll-driven reveals shared by every section, plus the light/dark/ember theme hand-off. */
function useGlobalMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>('.reveal-chars').forEach((el) => {
          gsap.from(el.querySelectorAll('.ch'), {
            yPercent: 115, rotate: 6, duration: 1.2, ease: 'expo.out', stagger: 0.03,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          })
        })
        gsap.utils.toArray<HTMLElement>('.fade-up').forEach((el) => {
          gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
        })
        // each section enters with a soft scale + round-corner unclip, like a new page sliding in
        gsap.utils.toArray<HTMLElement>('.section').forEach((el) => {
          gsap.fromTo(el, { clipPath: 'inset(6% 4% 0% 4% round 32px)' }, {
            clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true },
          })
        })
      }
      gsap.utils.toArray<HTMLElement>('[data-theme]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 55%', end: 'bottom 55%',
          onToggle: (s) => { if (s.isActive) document.documentElement.dataset.theme = el.dataset.theme },
        })
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    return () => ctx.revert()
  }, [ready])
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const lenis = initSmooth()
    lenis.stop()
  }, [])
  useEffect(() => {
    if (ready) initSmooth().start()
  }, [ready])
  useGlobalMotion(ready)

  return (
    <TransitionProvider>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Header ready={ready} />
      <main>
        <Hero ready={ready} />
        <Bands />
        <About />
        <Work />
        <Stack />
        <Experience />
        <Education />
        <Awards />
        <Contact />
      </main>
      <div className="grain" aria-hidden />
    </TransitionProvider>
  )
}

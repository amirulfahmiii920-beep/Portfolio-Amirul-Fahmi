import { useEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'
import { SectionHead } from '../components/SectionHead'
import { SplitWords } from '../lib/split'
import { projects } from '../data'

const lead =
  "I'm a Computer Engineering graduate from Universiti Tun Hussein Onn Malaysia, where I spent three years learning how software behaves when it has to touch hardware, networks, and people who aren't engineers."

const stats = [
  { n: projects.length, s: '', l: 'Projects shipped across ML, mobile, embedded & web' },
  { n: 2, s: '×', l: 'Gold medals for engineering design' },
  { n: 2, s: '', l: 'Internships keeping live national TV on air' },
  { n: 0, s: '', l: 'Seconds of downtime on live broadcasts' },
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // words light up as you read
      gsap.fromTo(
        '.about-lead .w',
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.about-lead', start: 'top 80%', end: 'bottom 45%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.stat-n').forEach((el) => {
        const target = Number(el.dataset.n)
        const o = { v: 0 }
        gsap.to(o, {
          v: target, duration: 1.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, '0')),
        })
      })
      gsap.to('.about-badge', { rotate: 360, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section about" id="about" ref={root} data-theme="light">
      <SectionHead label="01 — About" title="About Me" />
      <div className="about-grid">
        <div className="about-side fade-up">
          <svg className="about-badge" viewBox="0 0 200 200" aria-hidden>
            <defs><path id="badge" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
            <text><textPath href="#badge">AI · SYSTEMS · EMBEDDED · MOBILE · BUILT TO SHIP · </textPath></text>
          </svg>
          <span className="about-badge-core serif">MAF</span>
        </div>
        <p className="about-lead"><SplitWords text={lead} /></p>
      </div>

      <div className="about-cols">
        <p className="fade-up">
          Most of my work sits at the intersection of AI and systems that have to actually ship. I've trained a Decision Tree to run offline on a
          microcontroller so an irrigation system keeps working without internet. I've built a Random Forest model into an Android app to forecast
          hospital waiting times. <strong>A model only counts once it works for real users, not just in a notebook.</strong>
        </p>
        <p className="fade-up">
          Before that I spent two internships in technical operations at Media Prima Berhad, keeping live national broadcasts on air. Live TV doesn't
          give you a second attempt. That's where I learned to debug under pressure.
        </p>
        <p className="fade-up">
          I'm currently looking for a role in software engineering, AI/ML, or anything where I get to build and break things.{' '}
          <em className="serif">Open to relocating.</em>
        </p>
      </div>

      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat fade-up" key={i}>
            <span className="stat-num"><span className="stat-n" data-n={s.n}>00</span>{s.s}</span>
            <span className="stat-l">{s.l}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

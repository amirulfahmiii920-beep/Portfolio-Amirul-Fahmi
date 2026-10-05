import { useEffect, useRef } from 'react'
import { experience } from '../data'
import { gsap } from '../lib/smooth'
import { SectionHead } from '../components/SectionHead'

export function Experience() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.xp-line-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('.xp-item').forEach((it) => {
        gsap.from(it.querySelectorAll('.xp-anim'), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 80%' } })
        gsap.from(it.querySelector('.xp-node'), { scale: 0, duration: 0.8, ease: 'back.out(3)', scrollTrigger: { trigger: it, start: 'top 70%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="section xp" id="experience" ref={root} data-theme="light">
      <SectionHead label="04 — Experience" title="Experience" aside={<p>Live TV doesn't give you a second attempt.</p>} />
      <div className="xp-list">
        <div className="xp-line"><div className="xp-line-fill" /></div>
        {experience.map((x) => (
          <article className="xp-item" key={x.when}>
            <span className="xp-node" />
            <div className="xp-when mono xp-anim">{x.when}</div>
            <div className="xp-main">
              <h3 className="xp-anim">{x.role}</h3>
              <p className="xp-org xp-anim serif">{x.org}</p>
              <p className="xp-body xp-anim">{x.body}</p>
              <div className="xp-chips xp-anim"><span>Zero downtime</span><span>Live broadcast</span><span>Network ops</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

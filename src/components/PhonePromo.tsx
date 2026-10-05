import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'
import type { Shot } from '../data'
import { IPhoneMockup, IPHONE_SIZE } from './ui/iphone-mockup'

/**
 * Product-launch style slide: the phone drops in from above,
 * lands with a shockwave, a glint crosses the glass and the screen recording starts.
 * `play` restarts the sequence each time the slide becomes active.
 */
export function PhonePromo({ shot, play }: { shot: Shot; play: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  // scale the real-size device to the slot it sits in
  useEffect(() => {
    const slot = fit.current!
    const ro = new ResizeObserver(() => {
      const s = Math.min(slot.clientHeight / IPHONE_SIZE.h, slot.clientWidth / IPHONE_SIZE.w)
      slot.style.setProperty('--s', String(s))
    })
    ro.observe(slot)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = root.current!
    const v = video.current
    if (!play) { v?.pause(); return }
    if (v) { v.currentTime = 0.5; v.pause() } // skip the blank first beat of the recording
    if (prefersReducedMotion()) { v?.play().catch(() => {}); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.promo-device', { yPercent: -150, rotate: -14, rotateX: 24 })
        .set('.promo-shadow', { scaleX: 0.2, autoAlpha: 0 })
        .set('.promo-ring', { scale: 0.3, autoAlpha: 0 })
        .set('.promo-glint', { xPercent: -160 })
        // the drop
        .to('.promo-device', { yPercent: 3, rotate: 0, rotateX: 0, duration: 0.62, ease: 'power3.in' }, 0.45)
        .to('.promo-shadow', { scaleX: 1.08, autoAlpha: 1, duration: 0.62, ease: 'power3.in' }, 0.45)
        // impact: squash, shockwave, settle
        .to('.promo-device', { yPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, 1.07)
        .to('.promo-shadow', { scaleX: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, 1.07)
        .to('.promo-ring', { scale: 1.6, autoAlpha: 0.9, duration: 0.18, ease: 'power2.out' }, 1.07)
        .to('.promo-ring', { scale: 2.6, autoAlpha: 0, duration: 0.8, ease: 'expo.out' }, 1.25)
        .add(() => { v?.play().catch(() => {}) }, 1.25)
        .to('.promo-glint', { xPercent: 160, duration: 1.1, ease: 'power2.inOut' }, 1.35)
    }, el)
    return () => ctx.revert()
  }, [play])

  return (
    <div className="promo" ref={root}>
      <div className="promo-glow" />
      <div className="promo-slot" ref={fit}>
        <div className="promo-shadow" />
        <div className="promo-ring" />
        <div className="promo-float">
          <div className="promo-device">
            <div className="promo-scale">
              <IPhoneMockup color="#8f877d">
                {shot.video ? (
                  <video ref={video} muted loop playsInline poster={shot.src} preload="auto">
                    {shot.video.webm ? <source src={shot.video.webm} type="video/webm" /> : null}
                    <source src={shot.video.mp4} type="video/mp4" />
                  </video>
                ) : (
                  <img src={shot.src} alt="" />
                )}
              </IPhoneMockup>
              <div className="promo-glint" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

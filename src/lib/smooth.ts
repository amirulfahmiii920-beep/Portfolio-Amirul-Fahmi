import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmooth() {
  if (lenis) return lenis
  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !prefersReducedMotion() })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  return lenis
}

export const getLenis = () => lenis

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { immediate, force: true, offset: 0 })
  else el.scrollIntoView()
}

export function lockScroll(lock: boolean) {
  if (!lenis) return
  if (lock) lenis.stop()
  else lenis.start()
}

export { gsap, ScrollTrigger }

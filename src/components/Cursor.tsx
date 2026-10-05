import { useEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'

/** Dot + lagging ring. Elements with [data-cursor] change its state; [data-cursor-label] shows text. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.classList.add('has-cursor')
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    const move = (e: MouseEvent) => {
      xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY)
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      const state = t?.dataset.cursor ?? (t ? 'link' : '')
      ring.current!.dataset.state = state
      dot.current!.dataset.state = state
      if (label.current) label.current.textContent = t?.dataset.cursorLabel ?? ''
    }
    const down = () => ring.current?.classList.add('down')
    const up = () => ring.current?.classList.remove('down')
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring}><span ref={label} className="cursor-label" /></div>
      <div className="cursor-dot" ref={dot} />
    </>
  )
}

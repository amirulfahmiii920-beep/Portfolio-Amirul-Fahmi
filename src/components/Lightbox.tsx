import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../lib/smooth'
import type { Shot } from '../data'

/** Full-screen viewer: arrow keys / swipe to move, Esc or backdrop to close. */
export function Lightbox({ shots, index, onIndex, onClose, wide = false }: { shots: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void; wide?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement & HTMLVideoElement>(null)
  const startX = useRef<number | null>(null)
  const n = shots.length
  const go = (d: number) => onIndex((index + d + n) % n)

  useEffect(() => {
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
  }, [])
  useEffect(() => {
    gsap.fromTo(img.current, { autoAlpha: 0, scale: 0.94, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: 'expo.out' })
  }, [index])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  return createPortal(
    <div
      className={`lb ${wide ? 'lb-wide' : ''}`}
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="lb-top">
        <span className="mono">{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        <button className="pp-close" onClick={onClose} data-cursor="hide" aria-label="Close viewer"><span>Close</span><i /></button>
      </div>
      <figure className="lb-figure">
        {shots[index].video ? (
          <video ref={img} key={index} poster={shots[index].src} autoPlay muted loop playsInline controls>{shots[index].video.webm ? <source src={shots[index].video.webm} type="video/webm" /> : null}<source src={shots[index].video.mp4} type="video/mp4" /></video>
        ) : (
          <img ref={img} src={shots[index].src} alt={shots[index].caption} draggable={false} />
        )}
        <figcaption className="mono">{shots[index].caption}</figcaption>
      </figure>
      <button className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous screenshot" data-cursor="hide">←</button>
      <button className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next screenshot" data-cursor="hide">→</button>
    </div>,
    document.body,
  )
}

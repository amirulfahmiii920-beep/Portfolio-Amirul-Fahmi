import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../lib/smooth'
import { certFiles, loadCert } from '../lib/certs'
import { awards } from '../data'

const MARK = 'AMIRUL FAHMI · PORTFOLIO · VIEW ONLY'

/** Draws a decrypted certificate onto a canvas with a light diagonal watermark (no <img> to save). */
function paint(cv: HTMLCanvasElement, bmp: ImageBitmap) {
  cv.width = bmp.width
  cv.height = bmp.height
  const g = cv.getContext('2d')!
  g.drawImage(bmp, 0, 0)
  g.save()
  g.translate(cv.width / 2, cv.height / 2)
  g.rotate(-Math.PI / 7)
  g.font = `500 ${Math.round(cv.width / 52)}px "JetBrains Mono", monospace`
  g.fillStyle = 'rgba(20, 20, 30, 0.09)'
  g.textAlign = 'center'
  const step = g.measureText(MARK).width + cv.width / 14
  const row = cv.width / 9
  for (let y = -cv.height; y <= cv.height; y += row) {
    const shift = (Math.abs(Math.round(y / row)) % 2) * (step / 2)
    for (let x = -cv.width * 1.2; x <= cv.width * 1.2; x += step) g.fillText(MARK, x + shift, y)
  }
  g.restore()
}

/** Full-screen certificate viewer: arrows or swipe between awards, Esc or backdrop to close. */
export function CertViewer({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const startX = useRef<number | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const n = certFiles.length
  const go = (d: number) => onIndex((index + d + n) % n)
  const a = awards[index]

  useEffect(() => {
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    let live = true
    setState('loading')
    loadCert(certFiles[index])
      .then((bmp) => {
        if (!live || !canvas.current) return
        paint(canvas.current, bmp)
        setState('ready')
        gsap.fromTo(sheet.current, { autoAlpha: 0, y: 28, rotateX: 10, scale: 0.96 }, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.9, ease: 'expo.out' })
      })
      .catch(() => live && setState('error'))
    return () => { live = false }
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
      className="cv"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${a.title}`}
      data-lenis-prevent
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="cv-top">
        <span className="mono">Certificate · {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        <button className="pp-close" onClick={onClose} data-cursor="hide" aria-label="Close certificate"><span>Close</span><i /></button>
      </div>

      <figure className="cv-figure" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="cv-sheet" ref={sheet} onContextMenu={(e) => e.preventDefault()}>
          <canvas ref={canvas} className="cv-canvas" aria-label={`${a.medal} certificate, ${a.title}`} />
          {state !== 'ready' ? <div className="cv-wait mono">{state === 'error' ? 'Could not open this certificate' : 'Opening certificate…'}</div> : null}
        </div>
        <figcaption className="cv-cap">
          <span className="cv-medal mono">{a.medal}</span>
          <span className="cv-title">{a.title}</span>
          <span className="mono dim">{a.event} · {a.date}</span>
        </figcaption>
      </figure>

      {n > 1 ? (
        <>
          <button className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous certificate" data-cursor="hide">←</button>
          <button className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next certificate" data-cursor="hide">→</button>
        </>
      ) : null}
    </div>,
    document.body,
  )
}

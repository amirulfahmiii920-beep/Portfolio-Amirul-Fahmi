import { useEffect, useRef, useState } from 'react'
import { links } from '../data'
import { gsap, scrollToId } from '../lib/smooth'
import { MaskLine } from '../lib/split'
import { Magnetic } from '../components/ui/magnetic'
import resumeUrl from '../assets/resume/Amirul_Fahmi_Resume.pdf?url'

const RESUME_NAME = 'Amirul_Fahmi_Resume.pdf'

type Saver = { save: (r: { filename: string; data: Blob }) => Promise<unknown> } | null
const claudeHost = (window as unknown as { claude?: { use: (n: string) => Promise<Saver> } }).claude
// Inside the claude.ai preview, plain downloads are blocked; the viewer's own save prompt is used instead.
let saver: Saver = null
claudeHost?.use('downloads').then((d) => (saver = d)).catch(() => {})

function resumeBlob() {
  const bytes = Uint8Array.from(atob(resumeUrl.slice(resumeUrl.indexOf(',') + 1)), (ch) => ch.charCodeAt(0))
  return new Blob([bytes], { type: 'application/pdf' })
}

/** The single-file build inlines the PDF as a data: URL; turn it into a Blob so the download works where data: links are blocked. */
function downloadResume(e: React.MouseEvent<HTMLAnchorElement>) {
  if (!resumeUrl.startsWith('data:')) return
  e.preventDefault()
  if (saver) {
    saver.save({ filename: RESUME_NAME, data: resumeBlob() }).catch(() => {})
    return
  }
  const href = URL.createObjectURL(resumeBlob())
  const a = Object.assign(document.createElement('a'), { href, download: RESUME_NAME })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(href), 10000)
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const f = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur', timeZoneName: 'short' }).format(new Date()))
    f()
    const id = setInterval(f, 15000)
    const ctx = gsap.context(() => {
      gsap.from('.contact-title .mask-inner', { yPercent: 115, rotate: 3, stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact-title', start: 'top 80%' } })
      gsap.fromTo('.contact-inner', { yPercent: -30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } })
    }, root)
    return () => { clearInterval(id); ctx.revert() }
  }, [])

  const copy = async () => {
    try { await navigator.clipboard.writeText(links.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard unavailable */ }
  }

  return (
    <section className="contact" id="contact" ref={root} data-theme="ember">
      <div className="contact-inner">
        <div className="section-label mono"><span className="sl-no">07</span><span className="sl-line" /><span>Contact</span></div>
        <h2 className="contact-title">
          <MaskLine>Let's build something</MaskLine>
          <MaskLine><em className="serif">that ships.</em></MaskLine>
        </h2>

        <div className="contact-cta">
          <Magnetic intensity={0.35} range={160}>
            <a className="cta-orb" href={`mailto:${links.email}`} target="_blank" rel="noreferrer" data-cursor="hide">
              <span>Get in<br />touch</span>
            </a>
          </Magnetic>
          <div className="contact-links">
            <button className="contact-row" onClick={copy} data-cursor="link">
              <span className="mono dim">Email</span>
              <span className="contact-val">{links.email}</span>
              <span className="mono contact-act">{copied ? 'Copied ✓' : 'Copy'}</span>
            </button>
            <a className="contact-row" href={links.linkedin} target="_blank" rel="noreferrer">
              <span className="mono dim">LinkedIn</span>
              <span className="contact-val">linkedin.com/in/amirul-fahmi</span>
              <span className="mono contact-act">↗</span>
            </a>
            <a className="contact-row" href={links.github} target="_blank" rel="noreferrer">
              <span className="mono dim">GitHub</span>
              <span className="contact-val">github.com/amirulfahmiii920-beep</span>
              <span className="mono contact-act">↗</span>
            </a>
            <a className="contact-row" href={resumeUrl} download={RESUME_NAME} onClick={downloadResume}>
              <span className="mono dim">Resume</span>
              <span className="contact-val">Download resume</span>
              <span className="mono contact-act">↓</span>
            </a>
          </div>
        </div>

        <footer className="footer">
          <span className="mono">© 2026 Muhammad Amirul Fahmi</span>
          <span className="mono">Kajang, MY — {time}</span>
          <button className="mono u-link" onClick={() => scrollToId('top')}>Back to top ↑</button>
        </footer>
        <div className="footer-giant" aria-hidden>FAHMI</div>
      </div>
    </section>
  )
}

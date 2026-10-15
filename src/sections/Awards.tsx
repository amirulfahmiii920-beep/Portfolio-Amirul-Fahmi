import { useState } from 'react'
import { awards } from '../data'
import { SectionHead } from '../components/SectionHead'
import { CertViewer } from '../components/CertViewer'

function tilt(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${-y * 10}deg`)
  el.style.setProperty('--ry', `${x * 12}deg`)
  el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
  el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
}
function reset(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export function Awards() {
  const [cert, setCert] = useState<number | null>(null)
  return (
    <section className="section awards" id="awards" data-theme="dark">
      <SectionHead label="06 — Awards" title="Awards & Certifications" />
      <div className="award-grid">
        {awards.map((a, i) => (
          <article className="award fade-up" key={a.title} onMouseMove={tilt} onMouseLeave={reset}>
            <div className="award-inner">
              <div className="award-top">
                <div className="medal" aria-hidden><span>{a.medal}</span></div>
                <span className="mono dim">{a.date}</span>
              </div>
              <span className="mono award-no">No. 0{i + 1}</span>
              <h3>{a.title}</h3>
              <p className="mono dim award-event">{a.event}</p>
              {a.extra.length ? <ul className="award-extra">{a.extra.map((x) => <li key={x}>{x}</li>)}</ul> : null}
              <div className="award-project">
                <span className="serif">{a.project}</span>
                <p>{a.body}</p>
                <div className="award-actions">
                <button className="award-cert" onClick={() => setCert(i)} data-cursor="link">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M5 3.5h14v12H5z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7.5h8M8 10.5h5" stroke="currentColor" strokeWidth="1.5" /><circle cx="15.5" cy="17" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M14 19.2 13.2 22l2.3-1.2 2.3 1.2-.8-2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  <span>View certificate</span>
                  <i aria-hidden>→</i>
                </button>
                {a.verify ? (
                  <a className="award-cert award-verify" href={a.verify} target="_blank" rel="noreferrer" data-cursor="link">
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="m8.5 12 2.4 2.4 4.6-4.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Verify online</span>
                    <i aria-hidden>↗</i>
                  </a>
                ) : null}
                </div>
              </div>
              <span className="award-glare" aria-hidden />
            </div>
          </article>
        ))}
      </div>
      {cert !== null ? <CertViewer index={cert} onIndex={setCert} onClose={() => setCert(null)} /> : null}
    </section>
  )
}

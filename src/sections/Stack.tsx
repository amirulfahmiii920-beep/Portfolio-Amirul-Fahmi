import { stack } from '../data'
import { SectionHead } from '../components/SectionHead'
import { ScrollVelocityRow } from '../components/ui/scroll-velocity-text'

export function Stack() {
  const all = stack.flatMap((g) => g.items)
  return (
    <section className="section stack" id="stack" data-theme="dark">
      <SectionHead label="03 — Toolkit" title="Tech Stack" />
      <div className="stack-grid">
        {stack.map((g, gi) => (
          <div className="stack-col fade-up" key={g.group} onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
            e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
          }}>
            <div className="stack-head">
              <span className="mono dim">0{gi + 1}</span>
              <h3>{g.group}</h3>
            </div>
            <ul>
              {g.items.map((it) => (
                <li key={it}><span className="roll-v" data-text={it}><span>{it}</span></span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="stack-marquee" aria-hidden>
        <ScrollVelocityRow baseVelocity={2.5} direction={-1}>
          {all.map((w) => (
            <span className="mq-item" key={w}>{w}<span className="mq-star">✦</span></span>
          ))}
        </ScrollVelocityRow>
      </div>
    </section>
  )
}

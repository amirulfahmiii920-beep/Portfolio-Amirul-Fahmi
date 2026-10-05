import { education } from '../data'
import { SectionHead } from '../components/SectionHead'

export function Education() {
  return (
    <section className="section edu" id="education" data-theme="light">
      <SectionHead label="05 — Education" title="Education" />
      <ul className="edu-list">
        {education.map((e) => (
          <li className="edu-row fade-up" key={e.when}>
            <span className="edu-when mono">{e.when}</span>
            <span className="edu-what">{e.what}{e.sub ? <span className="edu-sub serif"> — {e.sub}</span> : null}</span>
            <span className="edu-where mono">{e.where}</span>
            <span className="edu-hover" aria-hidden />
          </li>
        ))}
      </ul>
    </section>
  )
}

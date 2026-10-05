import { SplitChars } from '../lib/split'

export function SectionHead({ label, title, aside }: { label: string; title: string; aside?: React.ReactNode }) {
  const [no, ...rest] = label.split(' — ')
  return (
    <div className="section-head">
      <div className="section-label mono fade-up">
        <span className="sl-no">{no}</span>
        <span className="sl-line" />
        <span>{rest.join(' — ')}</span>
      </div>
      <h2 className="section-title reveal-chars"><SplitChars text={title} /></h2>
      {aside ? <div className="section-aside fade-up">{aside}</div> : null}
    </div>
  )
}

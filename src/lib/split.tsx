import React from 'react'

/** Split text into masked characters for reveal animations. Words never break mid-word. */
export function SplitChars({ text, className = 'ch' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span className="word" aria-hidden>
            {Array.from(w).map((c, ci) => (
              <span className="mask" key={ci}>
                <span className={className}>{c}</span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
      <span className="sr-only">{text}</span>
    </>
  )
}

export function SplitWords({ text, className = 'w' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className={className}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  )
}

/** Line that slides up from a mask. */
export function MaskLine({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`mask-line ${className}`}>
      <span className="mask-inner">{children}</span>
    </span>
  )
}

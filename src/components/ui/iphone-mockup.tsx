import type { CSSProperties, ReactNode } from 'react'

/**
 * iPhone device frame. Adapted from the 21st.dev "Iphone Mockup" component
 * (lovesickfromthe6ix): CSS-only chassis with a dynamic island and home indicator.
 * Draws at the real logical size (393 × 852 screen); scale it from the outside.
 */
const SPEC = { w: 393, h: 852, radius: 56, bezel: 12, island: { w: 126, h: 37, r: 20 } }

const shade = (hex: string, pct: number) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return hex
  const k = (100 + pct) / 100
  return '#' + m.slice(1).map((c) => Math.max(0, Math.min(255, Math.round(parseInt(c, 16) * k))).toString(16).padStart(2, '0')).join('')
}

export const IPHONE_SIZE = { w: SPEC.w + SPEC.bezel * 2, h: SPEC.h + SPEC.bezel * 2 }

export function IPhoneMockup({ color = '#1c1e22', children, style }: { color?: string; children?: ReactNode; style?: CSSProperties }) {
  const frame: CSSProperties = {
    width: IPHONE_SIZE.w, height: IPHONE_SIZE.h, borderRadius: SPEC.radius + SPEC.bezel, padding: SPEC.bezel, boxSizing: 'border-box',
    background: `linear-gradient(135deg, ${shade(color, 40)} 0%, ${color} 40%, ${shade(color, -14)} 100%)`,
    boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35), inset 0 0 0 4px rgba(0,0,0,0.45), inset 2px 2px 6px rgba(255,255,255,0.25)',
    position: 'relative', overflow: 'hidden', ...style,
  }
  const screen: CSSProperties = {
    width: '100%', height: '100%', borderRadius: SPEC.radius, position: 'relative', overflow: 'hidden', background: '#000',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 10px 20px rgba(0,0,0,0.35)',
  }
  return (
    <div style={frame} aria-label="iPhone mockup">
      <div style={screen}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>{children}</div>
        <div aria-hidden style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 12, width: SPEC.island.w, height: SPEC.island.h, borderRadius: SPEC.island.r, background: '#000', zIndex: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.7)' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35))', opacity: 0.9, zIndex: 3 }} />
      </div>
    </div>
  )
}

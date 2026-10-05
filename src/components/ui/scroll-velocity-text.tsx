// Adapted from 21st.dev — "Scroll Velocity Text" by cnippet-dev
// (https://21st.dev/@cnippet-dev/components/scroll-velocity-text)
import type { MotionValue } from 'motion/react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  baseVelocity?: number
  direction?: 1 | -1
  scrollReactivity?: boolean
}

function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  scrollReactivity = true,
  ...props
}: ScrollVelocityRowProps & { velocityFactor: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const [numCopies, setNumCopies] = useState(1)

  const baseX = useMotionValue(0)
  const baseDirectionRef = useRef<number>(direction >= 0 ? 1 : -1)
  const currentDirectionRef = useRef<number>(direction >= 0 ? 1 : -1)
  const unitWidth = useMotionValue(0)

  const isInViewRef = useRef(true)
  const isPageVisibleRef = useRef(true)
  const prefersReducedMotionRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const block = blockRef.current
    if (!container || !block) return
    const updateSizes = () => {
      const cw = container.offsetWidth || 0
      const bw = block.scrollWidth || 0
      unitWidth.set(bw)
      const next = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1
      setNumCopies((prev) => (prev === next ? prev : next))
    }
    updateSizes()
    const ro = new ResizeObserver(updateSizes)
    ro.observe(container)
    ro.observe(block)
    const io = new IntersectionObserver(([entry]) => {
      if (entry) isInViewRef.current = entry.isIntersecting
    })
    io.observe(container)
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handlePRM = () => (prefersReducedMotionRef.current = mq.matches)
    mq.addEventListener('change', handlePRM)
    handlePRM()
    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      mq.removeEventListener('change', handlePRM)
    }
  }, [unitWidth])

  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1
    return `${-wrap(0, width, Number(v) || 0)}px`
  })

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current) return
    const dt = delta / 1000
    const vf = scrollReactivity ? velocityFactor.get() : 0
    const absVf = Math.min(5, Math.abs(vf))
    const speedMultiplier = prefersReducedMotionRef.current ? 0.2 : 1 + absVf
    if (absVf > 0.1) {
      currentDirectionRef.current = baseDirectionRef.current * (vf >= 0 ? 1 : -1)
    }
    const bw = unitWidth.get() || 0
    if (bw <= 0) return
    const pixelsPerSecond = (bw * baseVelocity) / 100
    baseX.set(baseX.get() + currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt)
  })

  return (
    <div className={clsx('svr', className)} ref={containerRef} {...props}>
      <motion.div className="svr-track" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <div aria-hidden={i !== 0} className="svr-block" key={i} ref={i === 0 ? blockRef : null}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function ScrollVelocityRow(props: ScrollVelocityRowProps) {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, (v) => {
    const sign = v < 0 ? -1 : 1
    return sign * Math.min(5, (Math.abs(v) / 1000) * 5)
  })
  return <ScrollVelocityRowImpl {...props} velocityFactor={factor} />
}

export default ScrollVelocityRow

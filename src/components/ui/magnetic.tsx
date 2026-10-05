// Adapted from 21st.dev — "Magnetic" by ibelick (https://21st.dev/@ibelick/components/magnetic)
import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, type SpringOptions } from 'motion/react'

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 }

export type MagneticProps = {
  children: React.ReactNode
  intensity?: number
  range?: number
  actionArea?: 'self' | 'parent' | 'global'
  springOptions?: SpringOptions
  className?: string
}

export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = 'self',
  springOptions = SPRING_CONFIG,
  className,
}: MagneticProps) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, springOptions)
  const springY = useSpring(y, springOptions)

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const distanceX = e.clientX - (rect.left + rect.width / 2)
        const distanceY = e.clientY - (rect.top + rect.height / 2)
        const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        if (isHovered && absoluteDistance <= range) {
          const scale = 1 - absoluteDistance / range
          x.set(distanceX * intensity * scale)
          y.set(distanceY * intensity * scale)
        } else {
          x.set(0)
          y.set(0)
        }
      }
    }

    document.addEventListener('mousemove', calculateDistance)
    return () => document.removeEventListener('mousemove', calculateDistance)
  }, [ref, isHovered, intensity, range, x, y])

  useEffect(() => {
    if (actionArea === 'parent' && ref.current?.parentElement) {
      const parent = ref.current.parentElement
      const handleParentEnter = () => setIsHovered(true)
      const handleParentLeave = () => setIsHovered(false)
      parent.addEventListener('mouseenter', handleParentEnter)
      parent.addEventListener('mouseleave', handleParentLeave)
      return () => {
        parent.removeEventListener('mouseenter', handleParentEnter)
        parent.removeEventListener('mouseleave', handleParentLeave)
      }
    } else if (actionArea === 'global') {
      setIsHovered(true)
    }
  }, [actionArea])

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseEnter={actionArea === 'self' ? () => setIsHovered(true) : undefined}
      onMouseLeave={
        actionArea === 'self'
          ? () => {
              setIsHovered(false)
              x.set(0)
              y.set(0)
            }
          : undefined
      }
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedRedLineProps {
  delay?: number
  className?: string
}

export default function AnimatedRedLine({ delay = 0, className = '' }: AnimatedRedLineProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10px' })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.span
        className="block h-0.5 bg-red-brand mb-6"
        style={{ width: '2rem', transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface BeforeAfterSliderProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
  className = '',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseDown = () => { isDragging.current = true }
  const onMouseUp = () => { isDragging.current = false }
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging.current) move(e.clientX) }
  const onTouchMove = (e: React.TouchEvent) => move(e.touches[0].clientX)

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl select-none cursor-col-resize comparison-slider ${className}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{ touchAction: 'pan-y' }}
    >
      {/* After (base) */}
      <img src={after} alt={afterLabel} className="w-full h-full object-cover block" draggable={false} />

      {/* Before (clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="block object-cover"
          draggable={false}
          style={{ width: containerRef.current?.offsetWidth ?? '100%', height: '100%' }}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/70"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center z-10"
        style={{ left: `${position}%` }}
        whileHover={{ scale: 1.1 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 5L2 9L6 13M12 5L16 9L12 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Labels */}
      <span className="absolute bottom-4 left-4 label-red">{beforeLabel}</span>
      <span className="absolute bottom-4 right-4 label" style={{ color: 'rgba(255,255,255,0.6)' }}>{afterLabel}</span>
    </div>
  )
}

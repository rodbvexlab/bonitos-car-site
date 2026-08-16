import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  title: string
  description: string
  image: string
  label?: string
  delay?: number
}

export default function ServiceCard({
  title,
  description,
  image,
  label = 'Especialidade',
  delay = 0,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 5, y: x * 5 })
  }

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden h-[420px] border border-white/5 cursor-default"
      style={{ perspective: '800px' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
    >
      {/* Inner 3D tilting wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered
            ? '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d', borderRadius: '1rem' }}
      />

      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        animate={{ scale: isHovered ? 1.06 : 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/5" />

      {/* Shimmer on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          backgroundPosition: isHovered ? '200% 0' : '-100% 0',
        }}
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 relative z-10">
        <motion.span
          className="label-red mb-3 block"
          animate={{ opacity: isHovered ? 1 : 0.75 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
        <h3 className="font-condensed font-bold text-2xl uppercase tracking-wide text-white mb-3">
          {title}
        </h3>
        <motion.p
          className="font-body text-sm text-text-2 leading-relaxed"
          animate={{ y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'

// ── Design tokens ──────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const
const EASE_SHARP = [0.76, 0, 0.24, 1] as const

// ── Shared animation builders ──────────────────────────────
const fadeUp = (delay: number, y = 22) => ({
  initial: { opacity: 0, y },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: EASE },
  },
})

const drawLine = (delay: number) => ({
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.0, delay, ease: EASE_SHARP },
  },
})

// ── Category data ──────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'leves',
    to: '/leves',
    index: '01',
    tag: 'Linha Automotiva',
    name: 'Leves',
    sub: '& Utilitários',
    desc: 'Funilaria técnica, pintura em estufa e estética profissional para carros, SUVs e utilitários.',
  },
  {
    id: 'pesados',
    to: '/pesados',
    index: '02',
    tag: 'Linha Estrutural',
    name: 'Pesados',
    sub: '& Frotas',
    desc: 'Recuperação estrutural, pintura industrial e execução técnica para caminhões e frotas.',
  },
] as const

// ── Category Card ──────────────────────────────────────────
function CategoryCard({
  cat,
  delay,
}: {
  cat: (typeof CATEGORIES)[number]
  delay: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div {...fadeUp(delay, 28)}>
      <Link
        to={cat.to}
        className="block outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-2xl"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`Ver serviços para ${cat.name} ${cat.sub}`}
      >
        <motion.div
          className="relative rounded-2xl p-7 md:p-9 overflow-hidden cursor-pointer"
          animate={{
            borderColor: hovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)',
            backgroundColor: hovered
              ? 'rgba(255,255,255,0.028)'
              : 'rgba(255,255,255,0.012)',
            y: hovered ? -4 : 0,
          }}
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Corner accent — glows on hover */}
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: hovered ? 1 : 0,
              background: hovered
                ? 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)'
                : 'none',
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Header row */}
          <div className="flex items-start justify-between mb-7">
            {/* Index — CSS transition, fully reliable */}
            <span
              className="font-condensed text-xs font-semibold tracking-widest tabular-nums"
              style={{
                color: hovered ? '#DC2626' : 'rgba(255,255,255,0.25)',
                transition: 'color 0.3s ease',
              }}
            >
              {cat.index}
            </span>
            <span
              className="font-condensed text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.18)' }}
            >
              {cat.tag}
            </span>
          </div>

          {/* Category name */}
          <div className="mb-0.5">
            <h2
              className="font-condensed font-bold uppercase leading-none text-white"
              style={{ fontSize: 'clamp(2.6rem, 4.5vw, 3.75rem)', letterSpacing: '-0.01em' }}
            >
              {cat.name}
            </h2>
          </div>

          {/* Underline — CSS transform, zero flash */}
          <div
            className="h-px bg-red-brand mb-3"
            style={{
              width: '100%',
              transform: `scaleX(${hovered ? 1 : 0})`,
              transformOrigin: 'left',
              transition: `transform 0.45s cubic-bezier(0.76,0,0.24,1)`,
            }}
          />

          {/* Subtitle */}
          <p
            className="font-display italic text-text-2 mb-6"
            style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)' }}
          >
            {cat.sub}
          </p>

          {/* Separator */}
          <div className="w-full h-px bg-white/6 mb-5" />

          {/* Description */}
          <p className="font-body text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {cat.desc}
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-2.5">
            <span
              className="font-condensed text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Conhecer serviços
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                transform: `translateX(${hovered ? 7 : 0}px)`,
                color: hovered ? '#DC2626' : 'rgba(255,255,255,0.3)',
                transition: 'transform 0.35s ease, color 0.35s ease',
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────
export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="relative bg-void min-h-screen flex flex-col"
      style={{ overflowX: 'hidden' }}
    >
      {/* ── Ambient layer ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.014) 0%, transparent 100%)',
        }}
      />

      {/* ── Fine grain texture ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.028]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Header variant="gateway" />

      {/* ── Main content ── */}
      <main
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pt-24 pb-6 md:pt-20 md:pb-4"
        style={{ minHeight: 'calc(100vh - 48px)' }}
      >
        {/* Brand name — micro label */}
        <motion.div {...fadeUp(0.28)} className="mb-5 md:mb-6 text-center">
          <span
            className="font-condensed text-xs font-semibold uppercase"
            style={{ letterSpacing: '0.28em', color: 'rgba(255,255,255,0.28)' }}
          >
            Bonito's Car
          </span>
        </motion.div>

        {/* ── Display headline ── */}
        <div className="text-center mb-1 md:mb-2">
          <motion.h1
            {...fadeUp(0.42, 28)}
            className="font-display italic leading-[1.0]"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              letterSpacing: '-0.015em',
            }}
          >
            Funilaria & Pintura
          </motion.h1>
        </div>

        <div className="text-center mb-5 md:mb-6">
          <motion.div
            {...fadeUp(0.55, 28)}
            className="font-display italic leading-[1.0]"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              letterSpacing: '-0.015em',
              color: 'rgba(255,255,255,0.38)',
            }}
          >
            Automotiva.
          </motion.div>
        </div>

        {/* Location label */}
        <motion.p
          {...fadeUp(0.67)}
          className="font-condensed text-xs font-medium uppercase mb-8 md:mb-10 text-center"
          style={{ letterSpacing: '0.22em', color: 'rgba(255,255,255,0.2)' }}
        >
          São Paulo · Est. 2003
        </motion.p>

        {/* ── Divider line ── */}
        <div
          className="w-full mb-8 md:mb-10"
          style={{ maxWidth: '42rem', transformOrigin: 'center' }}
        >
          <motion.div
            {...drawLine(0.78)}
            className="w-full h-px"
            style={{ background: 'rgba(255,255,255,0.08)', transformOrigin: 'left' }}
          />
        </div>

        {/* ── Category Cards ── */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" style={{ maxWidth: '42rem' }}>
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} delay={0.88 + i * 0.14} />
          ))}
        </div>
      </main>

      {/* ── Bottom strip ── */}
      <motion.footer
        {...fadeUp(1.22)}
        className="relative z-10 border-t py-3.5 px-6"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{ maxWidth: '42rem' }}
        >
          {/* Trust metrics */}
          <div className="hidden md:flex items-center gap-7">
            {['20+ anos', '2 unidades', 'B2B & B2C'].map((item) => (
              <span
                key={item}
                className="font-condensed text-xs uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.18em' }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Single CTA — right aligned */}
          <Link
            to="/orcamento"
            className="font-condensed text-xs font-semibold uppercase tracking-widest ml-auto transition-colors duration-200"
            style={{ letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          >
            Solicitar Orçamento →
          </Link>
        </div>
      </motion.footer>
    </motion.div>
  )
}

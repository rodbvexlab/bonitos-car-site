import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/ui/FadeIn'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import AnimatedRedLine from '../components/ui/AnimatedRedLine'
import ServiceCard from '../components/ui/ServiceCard'
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider'
import PartnersMarquee from '../components/shared/PartnersMarquee'
import CTASection from '../components/shared/CTASection'
import LocationCards from '../components/shared/LocationCards'
import { SERVICES_LEVES, STATS_LEVES, PROCESS_STEPS, LOGOS_LEVES, WA_LINKS } from '../lib/data'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const heroText = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}

const heroLine = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Leves() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-void min-h-screen">
      <Header />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/assets/hero-leves-real-desktop.webp')",
            backgroundPosition: '70% center',
            y: bgY,
            scale: bgScale,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50" />

        <div className="container relative z-10 pt-28 pb-24 md:pt-36 md:pb-32">
          <motion.div variants={heroText} initial="hidden" animate="visible" className="max-w-xl">
            <motion.span variants={heroLine} className="label-red mb-6 block">
              Linha Automotiva — Carros, SUVs e Utilitários
            </motion.span>
            <motion.h1 variants={heroLine} className="font-display text-5xl md:text-6xl lg:text-7xl leading-none mb-2">
              Reparo com
            </motion.h1>
            <motion.h1 variants={heroLine} className="font-display italic text-5xl md:text-6xl lg:text-7xl leading-none text-text-2 mb-8">
              Acabamento de Fábrica
            </motion.h1>
            <motion.div variants={heroLine} className="w-16 h-px bg-white/20 mb-8" />
            <motion.p variants={heroLine} className="font-body text-base md:text-lg text-text-2 max-w-lg leading-relaxed mb-10">
              Funilaria técnica, pintura em estufa com correspondência exata de cor e estética automotiva profissional para carros, SUVs e utilitários de todas as marcas.
            </motion.p>
            <motion.div variants={heroLine} className="flex flex-wrap gap-4">
              <Link to="/orcamento?cat=leves" className="btn-primary">
                Solicitar Avaliação
              </Link>
              <a href={WA_LINKS.leves} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <Link to="/" className="btn-ghost text-text-3 border-transparent hover:border-white/10">
                ← Voltar às categorias
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="label" style={{ fontSize: '0.6rem' }}>Role para explorar</span>
          <motion.div
            className="w-px h-8 bg-white/20"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-y border-white/5 bg-surface py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {['Correspondência Exata de Cor', 'Laboratório de Cor Profissional', 'Pintura em Cabine Pressurizada', 'Alinhamento de Fábrica'].map((item) => (
              <span key={item} className="label flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-brand inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS — ghost text "LEVES" behind numbers ── */}
      <section
        className="section section-ghost section-grain section-wash-red bg-deep"
        data-ghost="LEVES"
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS_LEVES.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
                <div className="font-display text-5xl md:text-6xl lg:text-7xl leading-none mb-3">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="label">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section section-grain bg-void">
        <div className="container">
          <FadeIn className="mb-12 md:mb-16">
            <AnimatedRedLine />
            <h2 className="display text-3xl md:text-4xl lg:text-5xl mb-4">Nossos Serviços</h2>
            <p className="text-text-2 font-body max-w-lg">
              Cuidado técnico em cada etapa. Do dano inicial ao acabamento que parece saído da fábrica.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES_LEVES.map((svc, i) => (
              <ServiceCard
                key={svc.title}
                title={svc.title}
                description={svc.description}
                image={svc.image}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="section section-grain bg-surface">
        <div className="container">
          <FadeIn className="mb-12 md:mb-16">
            <AnimatedRedLine />
            <h2 className="display text-3xl md:text-4xl lg:text-5xl mb-4">Antes e Depois</h2>
            <p className="text-text-2 font-body max-w-lg">Casos reais. Arraste para comparar o resultado.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeIn delay={0.1} direction="left">
              <p className="label mb-4 pl-1">Caso 01 — HB20</p>
              <BeforeAfterSlider
                before="/assets/leves-hb20-antes-01.webp"
                after="/assets/leves-hb20-depois-01.webp"
                className="h-[280px] md:h-[360px]"
              />
            </FadeIn>
            <FadeIn delay={0.2} direction="right">
              <p className="label mb-4 pl-1">Caso 02 — Fit</p>
              <BeforeAfterSlider
                before="/assets/leves-fit-antes-01.webp"
                after="/assets/leves-fit-depois-01.webp"
                className="h-[280px] md:h-[360px]"
              />
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FadeIn delay={0.1} direction="left">
              <p className="label mb-4 pl-1">Caso 01 — HB20 (Detalhe)</p>
              <BeforeAfterSlider
                before="/assets/leves-hb20-antes-02.webp"
                after="/assets/leves-hb20-depois-02.webp"
                className="h-[260px] md:h-[320px]"
              />
            </FadeIn>
            <FadeIn delay={0.2} direction="right">
              <p className="label mb-4 pl-1">Caso 02 — Fit (Detalhe)</p>
              <BeforeAfterSlider
                before="/assets/leves-fit-antes-02.webp"
                after="/assets/leves-fit-depois-02.webp"
                className="h-[260px] md:h-[320px]"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PROCESS — ghost text "PROCESSO" behind steps ── */}
      <section
        className="section section-ghost section-grain section-wash bg-deep"
        data-ghost="PROCESSO"
      >
        <div className="container relative z-10">
          <FadeIn className="mb-12 md:mb-16">
            <AnimatedRedLine />
            <h2 className="display text-3xl md:text-4xl lg:text-5xl mb-4">Como Funciona</h2>
            <p className="text-text-2 font-body max-w-md">Da avaliação à entrega — um processo transparente.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1} direction="up">
                <div className="relative pl-5 border-l border-white/10">
                  <motion.div
                    className="absolute -left-px top-0 w-0.5"
                    style={{ background: 'var(--red)' }}
                    initial={{ height: 0 }}
                    whileInView={{ height: '2rem' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <p className="font-condensed text-xs font-semibold tracking-widest text-red-brand mb-3">{step.num}</p>
                  <h4 className="font-condensed font-bold text-lg uppercase tracking-wide text-white mb-3">{step.title}</h4>
                  <p className="font-body text-sm text-text-2 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <PartnersMarquee
        logos={LOGOS_LEVES}
        title="Marcas que atendemos"
        subtitle="Experiência com todas as principais marcas do mercado automotivo nacional e importado."
      />

      {/* ── LOCATIONS ── */}
      <LocationCards />

      {/* ── CTA ── */}
      <CTASection
        title="Seu carro merece cuidado de fábrica."
        subtitle="Avaliação presencial, orçamento sem compromisso e pintura com correspondência exata de cor."
        waLink={WA_LINKS.leves}
      />

      <Footer />
    </motion.div>
  )
}

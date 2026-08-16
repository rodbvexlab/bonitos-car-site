import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/ui/FadeIn'
import { WA_NUMBER } from '../lib/data'

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

type Category = 'leves' | 'pesados' | ''

interface FormState {
  name: string
  phone: string
  category: Category
  description: string
}

export default function Orcamento() {
  const [searchParams] = useSearchParams()
  const initialCat = (searchParams.get('cat') as Category) || ''

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    category: initialCat,
    description: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Informe seu nome'
    if (!form.phone.trim()) e.phone = 'Informe seu telefone'
    if (!form.category) e.category = 'Selecione a categoria' as Category
    if (!form.description.trim()) e.description = 'Descreva o serviço necessário'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const catLabel = form.category === 'leves' ? 'Veículos Leves' : 'Caminhões e Pesados'
    const msg = [
      `Olá, vim pelo site da Bonito's Car e gostaria de solicitar um orçamento.`,
      '',
      `Categoria: ${catLabel}`,
      `Nome: ${form.name}`,
      `Telefone/WhatsApp: ${form.phone}`,
      `Descrição: ${form.description}`,
    ].join('\n')

    window.location.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const inputClass = (field: keyof FormState) => `
    w-full bg-surface border rounded-lg px-4 py-3.5 text-text-1 font-body text-sm
    placeholder:text-text-3 outline-none transition-all duration-200
    ${errors[field]
      ? 'border-red-brand focus:ring-1 focus:ring-red-brand'
      : 'border-white/8 focus:border-white/25 focus:ring-1 focus:ring-white/10'
    }
  `

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-void min-h-screen">
      <Header />

      {/* ── HERO SHORT ── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/leves_bg-desktop.webp')",
            filter: 'blur(12px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-void/85" />

        <div className="container relative z-10">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.div variants={heroItem}>
              <Link to="/" className="label text-text-3 hover:text-text-2 transition-colors mb-8 inline-flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Voltar ao início
              </Link>
            </motion.div>
            <motion.div variants={heroItem}>
              <span className="red-line" />
              <h1 className="display text-4xl md:text-5xl lg:text-6xl mb-4">Solicitar Orçamento</h1>
            </motion.div>
            <motion.p variants={heroItem} className="font-body text-text-2 text-base md:text-lg max-w-xl leading-relaxed">
              Preencha o formulário e entraremos em contato pelo WhatsApp para agendar a avaliação presencial na unidade.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-y border-white/5 bg-surface py-4">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {['Sem compromisso', 'Avaliação presencial', 'Resposta rápida pelo WhatsApp'].map((item) => (
              <span key={item} className="label flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-brand inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <section className="section">
        <div className="container max-w-2xl">
          <FadeIn>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Category */}
              <div>
                <label className="block font-condensed font-semibold text-sm uppercase tracking-widest text-text-1 mb-4">
                  Qual categoria?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'leves', label: 'Veículos Leves', sub: 'Carros, SUVs e Utilitários' },
                    { value: 'pesados', label: 'Caminhões e Pesados', sub: 'Frotas e Linha Pesada' },
                  ].map((opt) => (
                    <label key={opt.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={opt.value}
                        checked={form.category === opt.value}
                        onChange={() => {
                          setForm((p) => ({ ...p, category: opt.value as Category }))
                          if (errors.category) setErrors((p) => ({ ...p, category: undefined }))
                        }}
                        className="sr-only"
                      />
                      <div className={`
                        rounded-xl border p-4 md:p-5 transition-all duration-200
                        ${form.category === opt.value
                          ? 'border-red-brand bg-red-soft'
                          : 'border-white/8 bg-surface hover:border-white/16'
                        }
                      `}>
                        <p className="font-condensed font-bold text-base uppercase tracking-wide text-text-1 mb-1">{opt.label}</p>
                        <p className="font-body text-xs text-text-3">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.category && <p className="mt-2 text-xs text-red-brand font-body">{errors.category}</p>}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-condensed font-semibold text-sm uppercase tracking-widest text-text-1 mb-3">
                  Seu Nome
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex: João Silva"
                  value={form.name}
                  onChange={set('name')}
                  className={inputClass('name')}
                />
                {errors.name && <p className="mt-2 text-xs text-red-brand font-body">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-condensed font-semibold text-sm uppercase tracking-widest text-text-1 mb-3">
                  WhatsApp / Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 9 0000-0000"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="mt-2 text-xs text-red-brand font-body">{errors.phone}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block font-condensed font-semibold text-sm uppercase tracking-widest text-text-1 mb-3">
                  Descreva o Serviço
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Descreva o problema, o modelo do veículo e o tipo de serviço necessário..."
                  value={form.description}
                  onChange={set('description')}
                  className={`${inputClass('description')} resize-y min-h-[120px]`}
                />
                {errors.description && <p className="mt-2 text-xs text-red-brand font-body">{errors.description}</p>}
              </div>

              {/* Submit */}
              <div className="pt-2 space-y-3">
                <motion.button
                  type="submit"
                  className="btn-primary w-full justify-center py-4 text-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar pelo WhatsApp
                </motion.button>
                <p className="text-center font-body text-xs text-text-3">
                  Você será redirecionado para o WhatsApp com as informações preenchidas.
                </p>
              </div>
            </form>
          </FadeIn>

          {/* Note box */}
          <FadeIn delay={0.2} className="mt-10">
            <div className="rounded-xl border border-white/6 bg-surface p-6">
              <p className="font-condensed font-semibold text-sm uppercase tracking-widest text-text-1 mb-3">Importante</p>
              <p className="font-body text-sm text-text-2 leading-relaxed">
                O orçamento definitivo é feito de forma presencial na unidade. O formulário agiliza o primeiro contato e o agendamento da visita técnica.
              </p>
              <p className="font-body text-sm text-text-3 mt-3 leading-relaxed">
                Seg–Qui: 08h às 17h30 · Sex: 08h às 17h
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </motion.div>
  )
}

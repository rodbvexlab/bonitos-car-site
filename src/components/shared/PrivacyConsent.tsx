import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  denyConsent,
  getConsent,
  grantConsent,
  PRIVACY_OPEN_EVENT,
  type AnalyticsConsent,
} from '../../lib/analytics'

// Non-modal analytics consent notice. Shown until the visitor chooses, and
// reopened from the footer ("Preferências de privacidade").
export default function PrivacyConsent() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getConsent())
  const [open, setOpen] = useState(() => getConsent() === null)
  const [reopened, setReopened] = useState(false)
  const headingRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const handleOpen = () => {
      setConsent(getConsent())
      setReopened(true)
      setOpen(true)
    }
    window.addEventListener(PRIVACY_OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(PRIVACY_OPEN_EVENT, handleOpen)
  }, [])

  useEffect(() => {
    if (open && reopened) headingRef.current?.focus()
  }, [open, reopened])

  const choose = (value: AnalyticsConsent) => {
    if (value === 'granted') grantConsent()
    else denyConsent()
    setConsent(value)
    setOpen(false)
  }

  // The floating WhatsApp button sits bottom-right on every route but "/".
  const clearWhatsApp = location.pathname !== '/'

  const status =
    consent === 'granted'
      ? 'Métricas permitidas.'
      : consent === 'denied'
      ? 'Navegando sem métricas.'
      : null

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="region"
          aria-labelledby="privacy-consent-title"
          className={`fixed z-[60] left-4 right-4 md:left-7 md:right-auto md:bottom-7 md:max-w-md ${
            clearWhatsApp ? 'bottom-28' : 'bottom-4'
          }`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, transition: { duration: 0.2 } }}
        >
          <div className="rounded-xl border border-white/10 bg-elevated/95 backdrop-blur-md shadow-2xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <p
                id="privacy-consent-title"
                ref={headingRef}
                tabIndex={-1}
                className="label outline-none"
                style={{ color: 'var(--text-1)' }}
              >
                Privacidade
              </p>
              {reopened && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar preferências de privacidade"
                  className="-mt-2 -mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-text-2 hover:text-text-1 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <p className="font-body text-sm text-text-2 leading-relaxed">
              Usamos métricas para entender como o site é utilizado e melhorar a experiência. Você pode permitir ou continuar sem métricas.
            </p>
            {reopened && status && (
              <p className="font-body text-xs text-text-2 mt-3" aria-live="polite">
                Escolha atual: {status}
              </p>
            )}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => choose('granted')}
                aria-pressed={reopened ? consent === 'granted' : undefined}
                className="btn-ghost min-h-11 !px-4 !py-3 !text-xs !text-text-1"
              >
                Permitir métricas
              </button>
              <button
                type="button"
                onClick={() => choose('denied')}
                aria-pressed={reopened ? consent === 'denied' : undefined}
                className="btn-ghost min-h-11 !px-4 !py-3 !text-xs !text-text-1"
              >
                Continuar sem métricas
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

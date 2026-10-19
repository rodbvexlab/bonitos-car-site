import { Link, useLocation } from 'react-router-dom'
import { LOCATIONS, WA_LINKS } from '../../lib/data'
import { getAnalyticsPageType, getAnalyticsVehicleType, openPrivacyPreferences, trackCommercialEvent } from '../../lib/analytics'

export default function Footer() {
  const location = useLocation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12 md:mb-16">

          {/* Brand */}
          <div>
            <img
              src="/assets/logos/logo_bonitos_novo.webp"
              alt="Bonito's Car"
              className="h-10 w-auto object-contain mb-5"
            />
            <p className="text-sm text-text-3 leading-relaxed max-w-xs font-body">
              Especialistas em funilaria, pintura e recuperação automotiva para veículos leves e pesados em São Paulo há mais de 20 anos.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="label mb-6" style={{ color: 'var(--text-1)' }}>Navegação</p>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Início' },
                { to: '/leves', label: 'Veículos Leves' },
                { to: '/pesados', label: 'Caminhões e Pesados' },
                { to: '/orcamento', label: 'Solicitar Orçamento' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-text-3 hover:text-text-1 transition-colors duration-200 font-body"
                  onClick={() => {
                    if (link.to === '/orcamento') {
                      trackCommercialEvent('quote_start', {
                        page_type: getAnalyticsPageType(location.pathname),
                        vehicle_type: getAnalyticsVehicleType(location.pathname),
                        cta_location: 'footer_navigation',
                        cta_name: 'request_quote',
                      })
                    } else if (link.to === '/leves' || link.to === '/pesados') {
                      trackCommercialEvent('service_cta_click', {
                        page_type: getAnalyticsPageType(location.pathname),
                        vehicle_type: link.to === '/leves' ? 'leves' : 'pesados',
                        cta_location: 'footer_navigation',
                        cta_name: link.to === '/leves' ? 'view_light_services' : 'view_heavy_services',
                      })
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="label mb-6" style={{ color: 'var(--text-1)' }}>Unidades</p>
            <div className="flex flex-col gap-6">
              {LOCATIONS.map((loc) => (
                <div key={loc.unit}>
                  <p className="text-xs font-condensed font-semibold tracking-widest uppercase text-red-brand mb-1.5">{loc.unit}</p>
                  <p className="text-sm text-text-3 leading-relaxed font-body">{loc.address}</p>
                  <p className="text-sm text-text-3 font-body">{loc.city}</p>
                  <p className="text-sm text-text-3 mt-1 font-body">{loc.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-3 font-body">
            © {year} Bonito's Car. Todos os direitos reservados.
          </p>
          <button
            type="button"
            onClick={openPrivacyPreferences}
            className="text-xs text-text-3 hover:text-text-1 transition-colors font-body min-h-11 px-2"
          >
            Preferências de privacidade
          </button>
          <a
            href={WA_LINKS.general}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-3 hover:text-text-1 transition-colors label"
            onClick={() => trackCommercialEvent('whatsapp_click', {
              page_type: getAnalyticsPageType(location.pathname),
              vehicle_type: getAnalyticsVehicleType(location.pathname),
              cta_location: 'footer_contact',
              cta_name: 'contact_whatsapp',
            })}
          >
            +55 11 98432-5295
          </a>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { LOCATIONS, WA_LINKS } from '../../lib/data'

export default function Footer() {
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
          <a
            href={WA_LINKS.general}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-3 hover:text-text-1 transition-colors label"
          >
            +55 11 98432-5295
          </a>
        </div>
      </div>
    </footer>
  )
}

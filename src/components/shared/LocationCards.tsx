import FadeIn from '../ui/FadeIn'
import { LOCATIONS } from '../../lib/data'

export default function LocationCards() {
  return (
    <section className="section bg-void">
      <div className="container">
        <FadeIn className="mb-12">
          <span className="red-line" />
          <h2 className="display text-3xl md:text-4xl mb-3">Nossas Unidades</h2>
          <p className="text-text-2 font-body">Duas especialidades, dois endereços. Ambas em São Paulo.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LOCATIONS.map((loc, i) => (
            <FadeIn key={loc.unit} delay={i * 0.12} direction="up">
              <div className="rounded-2xl border border-white/8 bg-surface p-7 md:p-8 flex flex-col h-full hover:border-white/14 transition-colors duration-300">
                <span className="label-red mb-4 block">{loc.unit}</span>
                <p className="text-sm font-condensed font-medium text-text-2 uppercase tracking-wider mb-5">{loc.specialty}</p>

                <div className="flex-1 space-y-3 mb-7">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-text-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-text-1 font-body">{loc.address}</p>
                      <p className="text-sm text-text-3 font-body">{loc.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-text-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-text-3 font-body">{loc.hours}</p>
                  </div>
                </div>

                <a
                  href={loc.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm w-full justify-center"
                >
                  Ver no Mapa
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

import FadeIn from '../ui/FadeIn'

interface Logo {
  src: string
  alt: string
}

interface PartnersMarqueeProps {
  logos: Logo[]
  title?: string
  subtitle?: string
}

export default function PartnersMarquee({ logos, title, subtitle }: PartnersMarqueeProps) {
  const doubled = [...logos, ...logos]

  return (
    <section className="py-14 md:py-20 bg-black border-t border-b border-white/5 overflow-hidden">
      <div className="container text-center mb-10">
        {title && (
          <FadeIn>
            <p className="label mb-2">{title}</p>
          </FadeIn>
        )}
        {subtitle && (
          <FadeIn delay={0.1}>
            <p className="text-text-3 text-sm max-w-md mx-auto font-body">{subtitle}</p>
          </FadeIn>
        )}
      </div>

      <div className="relative marquee-mask">
        <div
          className="flex items-center gap-20 md:gap-24 w-max animate-marquee"
          style={{ animationDuration: '70s' }}
        >
          {doubled.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="h-[80px] md:h-[110px] w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-50 grayscale hover:opacity-95 hover:grayscale-0 transition-all duration-300 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

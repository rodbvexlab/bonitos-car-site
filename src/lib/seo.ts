const SITE_URL = 'https://www.bonitoscar.com.br'
const SITE_NAME = "Bonito's Car"

interface RouteSeo {
  title: string
  description: string
  image: string
}

const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    title: "Bonito's Car | Funilaria e Pintura Automotiva em São Paulo",
    description:
      'Funilaria técnica, pintura em estufa e recuperação estrutural para carros, SUVs, caminhões e frotas em São Paulo. 20+ anos de experiência. Orçamento sem compromisso.',
    image: '/assets/hero-leves-real-desktop.webp',
  },
  '/leves': {
    title: "Funilaria e Pintura de Carros em São Paulo | Bonito's Car",
    description:
      'Funilaria técnica, pintura em estufa e estética automotiva para carros, SUVs e utilitários na Vila Margarida, São Paulo. Orçamento sem compromisso.',
    image: '/assets/hero-leves-real-desktop.webp',
  },
  '/pesados': {
    title: "Funilaria e Pintura de Caminhão em São Paulo | Bonito's Car",
    description:
      'Funilaria industrial, pintura em estufa e recuperação estrutural de cabine para caminhões, carretas e frotas em São Paulo. Orçamento sem compromisso.',
    image: '/assets/hero-pesados-desktop.webp',
  },
  '/orcamento': {
    title: "Solicitar Orçamento de Funilaria e Pintura | Bonito's Car",
    description:
      'Informe o veículo e o serviço desejado e receba o orçamento de funilaria e pintura pelo WhatsApp. Atendimento em São Paulo para carros, caminhões e frotas.',
    image: '/assets/hero-leves-real-desktop.webp',
  },
}

const NOT_FOUND_SEO: RouteSeo = {
  title: `Página não encontrada | ${SITE_NAME}`,
  description: 'A página que você procura não existe. Volte para a página inicial da Bonito\'s Car.',
  image: ROUTE_SEO['/'].image,
}

function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Keeps <title>, description, canonical, robots and social tags in sync with the active route. */
export function applyRouteSeo(pathname: string) {
  const path = normalizePath(pathname)
  const known = ROUTE_SEO[path]
  const seo = known ?? NOT_FOUND_SEO
  const url = `${SITE_URL}${path === '/' ? '/' : path}`
  const image = `${SITE_URL}${seo.image}`

  document.title = seo.title
  setMeta('meta[name="description"]', 'name', 'description', seo.description)
  setMeta('meta[name="robots"]', 'name', 'robots', known ? 'index, follow' : 'noindex, follow')
  setCanonical(known ? url : null)

  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description)
  setMeta('meta[property="og:url"]', 'property', 'og:url', known ? url : `${SITE_URL}/`)
  setMeta('meta[property="og:image"]', 'property', 'og:image', image)
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description)
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image)
}

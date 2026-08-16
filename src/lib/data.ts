export const WA_NUMBER = '5511984325295'
export const WA_BASE = `https://wa.me/${WA_NUMBER}`

export const WA_LINKS = {
  general: `${WA_BASE}?text=${encodeURIComponent('Olá, estou no site da Bonito\'s Car e gostaria de atendimento!')}`,
  leves: `${WA_BASE}?text=${encodeURIComponent('Olá! Vim pelo site — preciso de atendimento para veículo leve.')}`,
  pesados: `${WA_BASE}?text=${encodeURIComponent('Olá! Vim pelo site — preciso de atendimento para veículo pesado/caminhão.')}`,
}

export const LOCATIONS = [
  {
    unit: 'Unidade Leves',
    specialty: 'Carros, SUVs e Utilitários',
    address: 'Rua Bucuituba, 1043 — Vila Margarida',
    city: 'São Paulo, SP — 03276-010',
    phone: '+55 11 98432-5295',
    hours: 'Seg–Qui 08h–17h30 · Sex 08h–17h',
    maps: 'https://maps.google.com/?q=Rua+Bucuituba,+1043,+Vila+Margarida,+São+Paulo',
  },
  {
    unit: 'Unidade Pesados',
    specialty: 'Caminhões e Linha Pesada',
    address: 'Rua Hamilton Prado, 543',
    city: 'São Paulo, SP — 03376-000',
    phone: '+55 11 98432-5295',
    hours: 'Seg–Qui 08h–17h30 · Sex 08h–17h',
    maps: 'https://maps.google.com/?q=Rua+Hamilton+Prado,+543,+São+Paulo',
  },
]

export const LOGOS_LEVES = [
  { src: '/assets/logos/logo_audi_color.webp', alt: 'Audi' },
  { src: '/assets/logos/logo_ford_color.webp', alt: 'Ford' },
  { src: '/assets/logos/logo_honda_color.webp', alt: 'Honda' },
  { src: '/assets/logos/logo_chevrolet_color.webp', alt: 'Chevrolet' },
  { src: '/assets/logos/logo_vw_color.webp', alt: 'Volkswagen' },
  { src: '/assets/logos/logo_fiat_color.webp', alt: 'Fiat' },
  { src: '/assets/logos/logo_toyota_color.webp', alt: 'Toyota' },
  { src: '/assets/logos/logo_chery_color.webp', alt: 'Chery' },
  { src: '/assets/logos/logo_landrover_color.webp', alt: 'Land Rover' },
]

export const LOGOS_PESADOS = [
  { src: '/assets/logos/logo_scania_color.webp', alt: 'Scania' },
  { src: '/assets/logos/logo_volvo_color.webp', alt: 'Volvo' },
  { src: '/assets/logos/logo_iveco_novo.webp', alt: 'Iveco' },
  { src: '/assets/logos/logo_mercedes_novo.webp', alt: 'Mercedes-Benz' },
  { src: '/assets/logos/logo_vw_pesados_color.webp', alt: 'VW Caminhões' },
  { src: '/assets/logos/logo_daf_color.webp', alt: 'DAF' },
]

export const SERVICES_PESADOS = [
  {
    title: 'Funilaria Estrutural',
    description: 'Endireitamento de chassi, reparo de baú e cabine com equipamentos de precisão industrial.',
    image: '/assets/card-pesados-funilaria-real.webp',
  },
  {
    title: 'Pintura Industrial',
    description: 'Pintura em estufa com tinta de alta resistência. Acabamento uniforme, cor de fábrica.',
    image: '/assets/card-pesados-pintura-real.webp',
  },
  {
    title: 'Restauração de Cabine',
    description: 'Recuperação completa de cabine: estrutura, painel, vidros e acabamento interno.',
    image: '/assets/card-pesados-cabine-real.webp',
  },
]

export const SERVICES_LEVES = [
  {
    title: 'Funilaria Técnica',
    description: 'Reparo preciso de lataria com alinhamento de geometria e encaixes originais.',
    image: '/assets/card-leves-funilaria-real.webp',
  },
  {
    title: 'Pintura em Estufa',
    description: 'Cabine de pintura com temperatura controlada. Cor exata pelo código do fabricante.',
    image: '/assets/card-leves-pintura-real.webp',
  },
  {
    title: 'Estética Automotiva',
    description: 'Polimento, cristalização e higienização completa. Saída do veículo com apresentação de showroom.',
    image: '/assets/card-leves-estetica-real.webp',
  },
]

export const STATS_PESADOS = [
  { value: 20, suffix: '+', label: 'Anos de Experiência' },
  { value: 6, suffix: '', label: 'Marcas Pesadas Atendidas' },
  { value: 2, suffix: '', label: 'Unidades em SP' },
  { value: 98, suffix: '%', label: 'Clientes Satisfeitos' },
]

export const STATS_LEVES = [
  { value: 20, suffix: '+', label: 'Anos no Mercado' },
  { value: 9, suffix: '', label: 'Marcas Atendidas' },
  { value: 2, suffix: '', label: 'Unidades em SP' },
  { value: 100, suffix: '%', label: 'Garantia no Serviço' },
]

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Avaliação Presencial',
    desc: 'Diagnóstico técnico completo e orçamento detalhado na própria unidade.',
  },
  {
    num: '02',
    title: 'Aprovação do Projeto',
    desc: 'Apresentamos o plano de execução, materiais e prazo antes de qualquer trabalho.',
  },
  {
    num: '03',
    title: 'Execução Técnica',
    desc: 'Equipe especializada com equipamentos industriais de última geração.',
  },
  {
    num: '04',
    title: 'Entrega com Garantia',
    desc: 'Inspeção final, documentação do serviço e garantia por escrito.',
  },
]

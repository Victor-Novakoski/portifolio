import rastreiaShot from '@/assets/projects/rastreia.webp'

export type ProjectIcon = 'lantern' | 'grimoire' | 'gear' | 'scroll'

export type Project = {
  id: string
  name: string
  kind: string
  icon: ProjectIcon
  main?: boolean
  summary: string
  flavor: string
  sheet: Array<{ label: string; value: string }>
  shot?: { src: string; alt: string; caption: string }
  searchDemo?: boolean
  note?: string
  links: Array<{ label: string; href: string }>
}

export const projects: Project[] = [
  {
    id: 'rastreia',
    name: 'Rastreia',
    kind: 'Item principal · projeto pessoal',
    icon: 'lantern',
    main: true,
    summary: 'Plataforma web e PWA que mostra o andamento de entregas em tempo real.',
    flavor: 'Lanterna que não se apaga com o vento. Acende em várias instâncias ao mesmo tempo e nenhuma perde o sinal.',
    shot: {
      src: rastreiaShot,
      alt: 'Página inicial do Rastreia com uma entrega de exemplo, dados fictícios',
      caption: 'print com dados fictícios',
    },
    sheet: [
      { label: 'API', value: 'Go (chi, pgx/sqlc, JWT)' },
      { label: 'Tempo real', value: 'WebSocket + Redis pub/sub' },
      { label: 'Mensageria', value: 'RabbitMQ com outbox' },
      { label: 'Front', value: 'React + TypeScript, PWA' },
    ],
    note: 'Código sob pedido · sem link público',
    links: [],
  },
  {
    id: 'panda-cooking',
    name: 'Panda Cooking',
    kind: 'Item principal · código aberto',
    icon: 'grimoire',
    main: true,
    summary: 'Rede social de receitas com busca que entende acento e erro de digitação.',
    flavor: 'Grimório de receitas que entende o que você quis dizer. Escreva “pao” e ele encontra “Pão de Queijo Mineiro”.',
    searchDemo: true,
    sheet: [
      { label: 'API', value: 'Go (Gin, GORM, OpenAPI)' },
      { label: 'Busca', value: 'PostgreSQL com unaccent e trigramas' },
      { label: 'Front', value: 'Next.js, 178 testes' },
      { label: 'Segurança', value: 'Trivy e gitleaks no pipeline' },
    ],
    links: [
      { label: 'Front-end no GitHub', href: 'https://github.com/Victor-Novakoski/panda-cooking-front' },
      { label: 'API em Go no GitHub', href: 'https://github.com/Victor-Novakoski/panda-cooking-go-api' },
    ],
  },
  {
    id: 'motors-shop',
    name: 'Motors Shop',
    kind: 'Item de estudo',
    icon: 'gear',
    summary: 'Loja de anúncios de veículos feita durante o curso.',
    flavor: 'Primeira peça forjada no treino. Ainda pesada, mas foi com ela que aprendi a segurar a lâmina.',
    sheet: [{ label: 'Stack', value: 'React, Node, Express' }],
    links: [{ label: 'Código no GitHub', href: 'https://github.com/Victor-Novakoski/Motors-Shop-Front' }],
  },
  {
    id: 'contacts',
    name: 'Contacts',
    kind: 'Item de estudo',
    icon: 'scroll',
    summary: 'Agenda de contatos: o primeiro CRUD completo.',
    flavor: 'Pergaminho de treino. Criar, ler, atualizar e apagar, até virar reflexo.',
    sheet: [{ label: 'Stack', value: 'CRUD completo' }],
    links: [{ label: 'Código no GitHub', href: 'https://github.com/Victor-Novakoski/contacts-front' }],
  },
]

// Receitas fictícias da demo da busca.
export const demoRecipes = ['Pão de Queijo Mineiro', 'Pão de Mel', 'Pavê de Chocolate', 'Feijão Tropeiro', 'Quentão', 'Paçoca Caseira']

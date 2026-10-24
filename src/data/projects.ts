import pandaShot from '@/assets/projects/panda.webp'
import rastreiaShot from '@/assets/projects/rastreia.webp'

export type ProjectGlyph = 'pin' | 'pot'

export type Project = {
  id: string
  name: string
  type: string
  status: 'soon' | 'open'
  glyph: ProjectGlyph
  image: string
  imageAlt: string
  sheet: Array<{ label: string; value: string }>
  flavor: string
  effects: string[]
  links: Array<{ label: string; href: string }>
}

export type StudyProject = {
  id: string
  name: string
  summary: string
  href: string
}

export const projects: Project[] = [
  {
    id: 'rastreia',
    name: 'Rastreia',
    type: 'plataforma web + PWA',
    status: 'soon',
    glyph: 'pin',
    image: rastreiaShot,
    imageAlt: 'Página inicial do Rastreia, com uma entrega de exemplo em rota',
    sheet: [
      { label: 'api', value: 'Go · chi · pgx/sqlc · JWT' },
      { label: 'tempo real', value: 'WebSocket · Redis pub/sub' },
      { label: 'filas', value: 'RabbitMQ · outbox' },
      { label: 'front', value: 'React · TypeScript · Tailwind' },
      { label: 'ci', value: 'lint · testes · govulncheck · Trivy' },
    ],
    flavor:
      'A transportadora cadastra, o motorista atualiza pelo celular, e o cliente vê a mudança na hora, sem recarregar.',
    effects: [
      'Status ao vivo com várias instâncias da API',
      'Notificações que não se perdem com a fila fora do ar',
      'Refresh token rotativo com detecção de reuso',
    ],
    links: [],
  },
  {
    id: 'panda-cooking',
    name: 'Panda Cooking',
    type: 'rede de receitas',
    status: 'open',
    glyph: 'pot',
    image: pandaShot,
    imageAlt: 'Página inicial do Panda Cooking',
    sheet: [
      { label: 'api', value: 'Go · Gin · GORM · OpenAPI' },
      { label: 'banco', value: 'PostgreSQL · unaccent · trigramas' },
      { label: 'front', value: 'Next.js · React · Zod' },
      { label: 'testes', value: '178 no front · testcontainers' },
      { label: 'ci', value: 'golangci-lint · Trivy · gitleaks' },
    ],
    flavor:
      'Busque "pao" e ela acha "Pão de Queijo Mineiro". Publique, comente e guarde as favoritas.',
    effects: [
      'Navegador fala só com o front, que repassa para a API',
      'Limite por IP, bloqueio de login e checagem de origem',
      'Erro de validação no campo certo, até dentro de listas',
    ],
    links: [
      { label: 'front-end', href: 'https://github.com/Victor-Novakoski/panda-cooking-front' },
      { label: 'api', href: 'https://github.com/Victor-Novakoski/panda-cooking-go-api' },
    ],
  },
]

export const studyProjects: StudyProject[] = [
  {
    id: 'motors-shop',
    name: 'Motors Shop',
    summary: 'Compra e venda de veículos. React, Node.js e Express.',
    href: 'https://github.com/Victor-Novakoski/Motors-Shop-Front',
  },
  {
    id: 'contacts',
    name: 'Contacts',
    summary: 'Gestão de contatos com CRUD completo.',
    href: 'https://github.com/Victor-Novakoski/contacts-front',
  },
]

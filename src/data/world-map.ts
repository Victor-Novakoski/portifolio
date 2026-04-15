export type WorldRegion = {
  id: string
  title: string
  x: number
  y: number
  lore: string
  accent: string
}

export const worldRegions: WorldRegion[] = [
  {
    id: 'hub',
    title: 'Sobre Mim',
    x: 470,
    y: 300,
    lore: 'Resumo profissional, contexto de atuação e direcionamento técnico atual.',
    accent: '#C7A25D',
  },
  {
    id: 'battlefield',
    title: 'Projetos',
    x: 140,
    y: 325,
    lore: 'Projetos full stack com foco em integração front-end/back-end e entrega prática.',
    accent: '#BD3119',
  },
  {
    id: 'codex',
    title: 'Experiência',
    x: 715,
    y: 120,
    lore: 'Atuação profissional em sistema logístico de alta complexidade e escala nacional.',
    accent: '#7AB4FF',
  },
  {
    id: 'skill-tree',
    title: 'Habilidades',
    x: 505,
    y: 60,
    lore: 'Stack técnica principal: Angular, React, TypeScript, Go, Docker e APIs REST.',
    accent: '#5EC9A3',
  },
  {
    id: 'trials',
    title: 'Desafios Técnicos',
    x: 760,
    y: 280,
    lore: 'Casos reais de integração, legado e regras de negócio complexas.',
    accent: '#C58DFF',
  },
  {
    id: 'shrine',
    title: 'Contato',
    x: 870,
    y: 450,
    lore: 'Canal direto para entrevistas e oportunidades em front-end e engenharia web.',
    accent: '#F08B7A',
  },
]

export const worldConnections: Array<[string, string]> = [
  ['hub', 'battlefield'],
  ['battlefield', 'codex'],
  ['codex', 'skill-tree'],
  ['skill-tree', 'trials'],
  ['trials', 'shrine'],
  ['shrine', 'hub'],
  ['battlefield', 'trials'],
]

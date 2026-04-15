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
    id: "hub",
    title: "Sobre Mim",
    x: 470,
    y: 300,
    lore: "Resumo profissional, proposta de valor e direcionamento da minha atuação.",
    accent: "#C7A25D",
  },
  {
    id: "battlefield",
    title: "Projetos",
    x: 140,
    y: 325,
    lore: "Projetos com contexto, decisões técnicas e impacto de produto.",
    accent: "#BD3119",
  },
  {
    id: "codex",
    title: "Experiência",
    x: 715,
    y: 120,
    lore: "Trajetória profissional, responsabilidades e evolução técnica.",
    accent: "#7AB4FF",
  },
  {
    id: "skill-tree",
    title: "Habilidades",
    x: 505,
    y: 60,
    lore: "Stack principal, competências práticas e profundidade de execução.",
    accent: "#5EC9A3",
  },
  {
    id: "trials",
    title: "Desafios Técnicos",
    x: 760,
    y: 280,
    lore: "Problemas reais, abordagem aplicada e resultados mensuráveis.",
    accent: "#C58DFF",
  },
  {
    id: "shrine",
    title: "Contato",
    x: 870,
    y: 450,
    lore: "Canal direto para entrevista, parceria e oportunidades profissionais.",
    accent: "#F08B7A",
  },
];

export const worldConnections: Array<[string, string]> = [
  ['hub', 'battlefield'],
  ['battlefield', 'codex'],
  ['codex', 'skill-tree'],
  ['skill-tree', 'trials'],
  ['trials', 'shrine'],
  ['shrine', 'hub'],
  ['battlefield', 'trials'],
]

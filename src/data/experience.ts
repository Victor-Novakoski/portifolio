export type ExperienceMilestone = {
  id: string
  period: string
  title: string
  summary: string
  highlights: string[]
}

export const experienceMilestones: ExperienceMilestone[] = [
  {
    id: 'exp-foundation',
    period: 'Base',
    title: 'Fundamentos de Front-end',
    summary: 'Consolidação de HTML, CSS, JavaScript e construção de interfaces responsivas.',
    highlights: [
      'Padronização de componentes reutilizáveis',
      'Consistência visual em múltiplas telas',
    ],
  },
  {
    id: 'exp-react',
    period: 'Evolução',
    title: 'Arquitetura com React e TypeScript',
    summary: 'Migração de projetos legados para base tipada e modular com foco em manutenção.',
    highlights: [
      'Refatoração incremental com baixo risco',
      'Contratos de dados mais previsíveis',
    ],
  },
  {
    id: 'exp-product',
    period: 'Atual',
    title: 'Engenharia orientada a produto',
    summary: 'Decisões técnicas alinhadas a impacto real de negócio, UX e performance percebida.',
    highlights: [
      'Priorização orientada por contexto',
      'Entrega rápida sem perder qualidade de engenharia',
    ],
  },
]

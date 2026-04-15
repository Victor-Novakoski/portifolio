export type ExperienceMilestone = {
  id: string
  period: string
  title: string
  summary: string
  highlights: string[]
}

export const experienceMilestones: ExperienceMilestone[] = [
  {
    id: 'exp-galileu-frontend',
    period: 'Jun/2023 - Atual',
    title: 'Galileu Sistemas e Soluções — Desenvolvedor Front-end',
    summary:
      'Desenvolvimento de interfaces em Angular para sistema logístico de alcance nacional, com foco em estabilidade, legibilidade e manutenção contínua.',
    highlights: [
      'Integração com APIs REST e manipulação de regras de negócio complexas',
      'Atuação em projeto de transportes para cliente de grande porte do setor alimentício',
    ],
  },
  {
    id: 'exp-lowcode-yaml',
    period: 'Contexto técnico atual',
    title: 'Customização em framework interno low-code',
    summary:
      'Experiência com framework interno baseado em YAML para geração de interfaces, realizando adaptações para atender limitações da ferramenta e requisitos específicos.',
    highlights: [
      'Customizações de UI orientadas por regras de negócio',
      'Evolução de sistema legado sem interromper operação',
    ],
  },
  {
    id: 'exp-go-backend',
    period: 'Back-end aplicado',
    title: 'APIs em Go (Golang) + Docker',
    summary:
      'Participação no desenvolvimento e manutenção de APIs com Go, utilizando Docker para organização de serviços e execução de ambientes.',
    highlights: [
      'Integração front-end/back-end com contratos de API consistentes',
      'Apoio técnico em fluxos críticos do domínio logístico',
    ],
  },
  {
    id: 'exp-education',
    period: 'Formação',
    title: 'Base acadêmica e especialização',
    summary:
      'Formação em Desenvolvimento Web Full Stack (Kenzie Academy) e início de Engenharia de Software em março de 2026.',
    highlights: [
      'Kenzie Academy Brasil — mai/2022 a mai/2023',
      'Engenharia de Software — início em mar/2026',
    ],
  },
]

export type ProjectBoss = {
  id: string
  name: string
  context: string
  stack: string[]
  challenges: string[]
  repoUrl: string
  demoUrl?: string
}

export const projects: ProjectBoss[] = [
  {
    id: 'obsidian-market',
    name: 'Obsidian Market',
    context:
      'Projeto focado em experiência de compra, performance em listagem e fluxo de checkout previsível.',
    stack: ['React', 'TypeScript', 'React Router', 'Zod'],
    challenges: [
      'Sincronizar filtros na URL sem quebrar navegação',
      'Evitar re-render excessivo em listagens grandes',
      'Padronizar estados de loading e erro',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski',
  },
  {
    id: 'ashen-dashboard',
    name: 'Ashen Dashboard',
    context:
      'Interface para leitura operacional com prioridade em clareza visual e tomada de decisão rápida.',
    stack: ['React', 'TypeScript', 'Recharts', 'React Query'],
    challenges: [
      'Normalizar dados heterogêneos de APIs',
      'Criar componentes reutilizáveis de visualização',
      'Garantir responsividade sem perda de informação',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski',
  },
  {
    id: 'cathedral-ui',
    name: 'Cathedral UI',
    context:
      'Estrutura de UI para reduzir inconsistência visual e acelerar desenvolvimento em squads diferentes.',
    stack: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
    challenges: [
      'Definir contratos de componente estáveis',
      'Evoluir tokens sem quebrar telas existentes',
      'Documentar padrões de composição',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski',
  },
]

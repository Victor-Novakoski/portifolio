export type ExperienceMilestone = {
  id: string
  period: string
  title: string
  summary: string
  highlights: string[]
}

export const experienceMilestones: ExperienceMilestone[] = [
  {
    id: 'exp-galileu',
    period: 'Jun/2023 - Atual',
    title: 'Galileu Sistemas e Soluções — Desenvolvedor Full Stack',
    summary:
      'Desenvolvimento de APIs REST em Go e de front-ends para um sistema de logística e transporte usado em escala nacional, do banco de dados à interface.',
    highlights: [
      'APIs REST em Go com go-swagger, Viper e PostgreSQL',
      'Regras de negócio configuráveis com scripts Starlark em fluxos de processamento assíncrono',
      'Biblioteca Go compartilhada entre as APIs e ambientes de desenvolvimento com Docker Compose',
    ],
  },
  {
    id: 'exp-galileu-frontend',
    period: 'Front-end na Galileu',
    title: 'Angular e framework interno low-code',
    summary:
      'Front-ends dedicados para clientes de grande porte da indústria, em Angular e numa plataforma interna low-code baseada em YAML, além da migração de sistemas legados.',
    highlights: [
      'Customizações de UI orientadas por regras de negócio',
      'Evolução de sistema legado sem interromper a operação',
    ],
  },
  {
    id: 'exp-army',
    period: 'Mar/2020 - Fev/2021',
    title: 'Exército Brasileiro — Soldado',
    summary: 'Treinamento militar de 11 meses, concluído com certificado de excelência militar.',
    highlights: ['Disciplina, trabalho em equipe e responsabilidade sob pressão'],
  },
  {
    id: 'exp-education',
    period: 'Formação',
    title: 'Base acadêmica e especialização',
    summary:
      'Bacharelado em Engenharia de Software em andamento, depois de formações em desenvolvimento web full stack e no ecossistema JavaScript.',
    highlights: [
      'Uninter — Engenharia de Software, desde mar/2026',
      'Kenzie Academy Brasil — Desenvolvimento Web Full Stack, mai/2022 a mai/2023',
      'JStack — JavaScript, React e Node.js, dez/2022 a jan/2023',
    ],
  },
]

export type ExperienceMilestone = {
  id: string
  when: string
  title: string
  org: string
  summary: string
  highlights?: string[]
  kind?: 'now' | 'army'
}

export const experienceMilestones: ExperienceMilestone[] = [
  {
    id: 'exp-galileu',
    when: 'jun 2023 → hoje',
    title: 'Desenvolvedor Full Stack',
    org: 'Galileu Sistemas e Soluções',
    summary:
      'APIs REST em Go e front-ends para um sistema de logística e transporte usado em escala nacional.',
    highlights: [
      'APIs em Go com go-swagger, Viper e PostgreSQL',
      'Regras de negócio configuráveis com scripts Starlark',
      'Front-ends em Angular e numa plataforma interna low-code',
    ],
    kind: 'now',
  },
  {
    id: 'exp-uninter',
    when: 'mar 2026 → hoje',
    title: 'Engenharia de Software',
    org: 'Uninter',
    summary: 'Bacharelado em andamento.',
  },
  {
    id: 'exp-kenzie',
    when: 'mai 2022 → mai 2023',
    title: 'Desenvolvimento Web Full Stack',
    org: 'Kenzie Academy Brasil',
    summary: 'Um ano de front-end e back-end, mais a JStack (JavaScript, React e Node.js).',
  },
  {
    id: 'exp-army',
    when: 'mar 2020 → fev 2021',
    title: 'Soldado',
    org: 'Exército Brasileiro',
    summary:
      '11 meses de treinamento militar, concluídos com certificado de excelência. A disciplina veio de lá.',
    kind: 'army',
  },
]

// Galileu: só cargo, período e stack.
export type Region = {
  id: string
  region: string
  title: string
  org: string
  when: string
  summary?: string
  now?: boolean
}

export const regions: Region[] = [
  {
    id: 'exercito',
    region: 'ponto de partida',
    title: 'Soldado',
    org: 'Exército Brasileiro',
    when: 'mar 2020 → fev 2021',
    summary: '11 meses de serviço, com certificado de excelência.',
  },
  {
    id: 'kenzie',
    region: 'treinamento',
    title: 'Desenvolvimento Web Full Stack',
    org: 'Kenzie Academy Brasil',
    when: 'mai 2022 → mai 2023',
    summary: 'Um ano de front-end e back-end com JavaScript, React e Node.js.',
  },
  {
    id: 'galileu',
    region: 'região atual',
    title: 'Desenvolvedor Full Stack',
    org: 'Galileu Sistemas e Soluções',
    when: 'jun 2023 → hoje',
    summary: 'Go, PostgreSQL, Angular e go-swagger.',
    now: true,
  },
  {
    id: 'uninter',
    region: 'em andamento',
    title: 'Engenharia de Software',
    org: 'Uninter',
    when: 'mar 2026 → hoje',
  },
]

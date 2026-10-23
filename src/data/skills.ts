export type SkillPlace = 'work' | 'rastreia' | 'panda'

export type Skill = {
  id: string
  tool: string
  area: 'back-end' | 'front-end' | 'plataforma'
  use: string
  where: SkillPlace[]
}

export const skillPlaces: Record<SkillPlace, { short: string; long: string }> = {
  work: { short: 'trabalho', long: 'trabalho (Galileu)' },
  rastreia: { short: 'rastreia', long: 'Rastreia' },
  panda: { short: 'panda', long: 'Panda Cooking' },
}

export const skills: Skill[] = [
  {
    id: 'go',
    tool: 'Go',
    area: 'back-end',
    use: 'APIs REST com chi, Gin, pgx/sqlc, GORM e OpenAPI',
    where: ['work', 'rastreia', 'panda'],
  },
  {
    id: 'postgres',
    tool: 'PostgreSQL',
    area: 'back-end',
    use: 'Modelagem, migrations, transações, locks e índices',
    where: ['work', 'rastreia', 'panda'],
  },
  {
    id: 'redis-rabbitmq',
    tool: 'Redis · RabbitMQ',
    area: 'back-end',
    use: 'Tempo real entre instâncias e filas com outbox',
    where: ['rastreia'],
  },
  {
    id: 'react',
    tool: 'React · TypeScript',
    area: 'front-end',
    use: 'Componentes, formulários e estado de servidor',
    where: ['rastreia', 'panda'],
  },
  {
    id: 'nextjs',
    tool: 'Next.js',
    area: 'front-end',
    use: 'Renderização no servidor e camada BFF',
    where: ['panda'],
  },
  {
    id: 'angular',
    tool: 'Angular',
    area: 'front-end',
    use: 'Interfaces de sistema logístico em produção',
    where: ['work'],
  },
  {
    id: 'docker',
    tool: 'Docker · Compose',
    area: 'plataforma',
    use: 'Ambiente completo com um comando',
    where: ['work', 'rastreia', 'panda'],
  },
  {
    id: 'actions',
    tool: 'GitHub Actions',
    area: 'plataforma',
    use: 'Lint, testes, govulncheck, gitleaks e Trivy',
    where: ['rastreia', 'panda'],
  },
]

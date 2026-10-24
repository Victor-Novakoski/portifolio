export type Gear = {
  id: string
  short: string
  slot: string
  name: string
  use: string
}

export const gear: Gear[] = [
  { id: 'go', short: 'Go', slot: 'arma principal', name: 'Go', use: 'APIs no trabalho, no Rastreia e no Panda Cooking.' },
  { id: 'postgres', short: 'PG', slot: 'armadura', name: 'PostgreSQL', use: 'Transações, outbox, unaccent e trigramas.' },
  { id: 'react', short: 'TS', slot: 'arma secundária', name: 'React e TypeScript', use: 'Front do Rastreia; Next.js no Panda Cooking.' },
  { id: 'mq', short: 'MQ', slot: 'amuletos', name: 'Redis e RabbitMQ', use: 'Tempo real entre instâncias e mensagens que não se perdem.' },
  { id: 'front', short: 'NG', slot: 'também empunha', name: 'Next.js e Angular', use: 'Angular no dia a dia do trabalho.' },
  { id: 'ci', short: 'CI', slot: 'ferramentas', name: 'Docker e GitHub Actions', use: 'Pipeline do Panda Cooking, com Trivy e gitleaks.' },
]

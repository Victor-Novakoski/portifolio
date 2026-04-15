export type Trial = {
  id: string
  title: string
  problem: string
  approach: string
  result: string
}

export const trials: Trial[] = [
  {
    id: 'trial-api-load',
    title: 'Provação I — Escalar API sob alta carga',
    problem: 'Picos de latência em horários de alto tráfego degradavam a experiência do usuário.',
    approach:
      'Mapeamento de gargalos, cache seletivo e desacoplamento de chamadas críticas no front-end.',
    result: 'Tempo médio de resposta mais previsível e menor taxa de abandono em fluxos sensíveis.',
  },
  {
    id: 'trial-metadata-validation',
    title: 'Provação II — Validação dinâmica de metadados',
    problem: 'Metadados inconsistentes entre fontes diferentes quebravam regras de exibição.',
    approach:
      'Padronização de contratos com validação de schema e fallback para estados seguros.',
    result: 'Menos erros em produção e maior confiança na camada de apresentação.',
  },
  {
    id: 'trial-ui-refactor',
    title: 'Provação III — Refatoração de UI legada',
    problem: 'Código legado acoplado dificultava manutenção e evolução de novas features.',
    approach:
      'Migração incremental de stack, organização por domínio e componentes desacoplados.',
    result: 'Base sustentável para novas entregas com menor risco de regressão.',
  },
]

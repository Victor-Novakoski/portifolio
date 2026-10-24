import { sectionById } from '@/data/sections'
import { safeGet, safeSet } from '@/lib/storage'

export const LAST_SECTION_KEY = 'forja.secao'
const VISITED_KEY = 'forja.visitou'

// Lido uma vez, antes de qualquer efeito gravar a visita atual. Só a seção fica guardada,
// sem horário nem tempo de visita. No `yarn dev`, `?volta=1` simula quem volta.
function readReturn(): string | null {
  const forced = import.meta.env.DEV && new URLSearchParams(window.location.search).has('volta')
  const seen = forced || safeGet(VISITED_KEY) === '1'
  safeSet(VISITED_KEY, '1')
  if (!seen) return null
  return sectionById(safeGet(LAST_SECTION_KEY))?.id ?? 'projetos'
}

export const returningTo = readReturn()

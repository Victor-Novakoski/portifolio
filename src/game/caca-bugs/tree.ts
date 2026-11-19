// Árvore de habilidades do Caça-bugs (decisão 015): 6 nós da stack do Victor em 3 ramos.
// O segundo nó de cada ramo pede o primeiro. Nada disso é salvo entre visitas.

export type PerkId = 'goroutine' | 'pool' | 'batching' | 'typescript' | 'indice' | 'transacao'

export type Perk = {
  id: PerkId
  branch: string
  name: string
  cost: number
  needs?: PerkId
  effect: string
  concept: string
}

export const PERKS: Perk[] = [
  { id: 'goroutine', branch: 'Go', name: 'Goroutine', cost: 8, effect: 'Um caçador automático golpeia, a cada 2 s, o bug mais perto da Produção.', concept: 'Trabalho concorrente rodando sozinho.' },
  { id: 'pool', branch: 'Go', name: 'Worker pool', cost: 14, needs: 'goroutine', effect: 'Passam a ser 3 caçadores automáticos.', concept: 'Várias goroutines dividindo a fila.' },
  { id: 'batching', branch: 'React', name: 'Batching', cost: 8, effect: 'O golpe acerta uma área 50% maior.', concept: 'Várias atualizações num render só.' },
  { id: 'typescript', branch: 'React', name: 'TypeScript', cost: 14, needs: 'batching', effect: 'Bugs pálidos morrem num golpe, sem pedir confirmação.', concept: 'O erro é pego antes de rodar.' },
  { id: 'indice', branch: 'PostgreSQL', name: 'Índice', cost: 8, effect: 'A luz da lanterna cobre 50% mais área e deixa os bugs mais lentos.', concept: 'A busca deixa de varrer tudo.' },
  { id: 'transacao', branch: 'PostgreSQL', name: 'Transação', cost: 14, needs: 'indice', effect: 'Uma vez por partida, desfaz o golpe que derrubaria a Produção: ela volta com 2 de vida.', concept: 'Rollback.' },
]

export const BRANCHES = ['Go', 'React', 'PostgreSQL']

export const perkName = (id: PerkId) => PERKS.find(p => p.id === id)!.name

export const WAVES = 3
export const WAVE_MS = 40000

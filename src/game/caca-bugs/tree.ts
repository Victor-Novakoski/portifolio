// Árvore de habilidades do Caça-bugs (decisão 015): 12 nós da stack do Victor em 4 ramos de 3.
// Cada nó pede o anterior do mesmo ramo. Nada disso é salvo entre visitas.

export type PerkId =
  | 'goroutine'
  | 'pool'
  | 'channels'
  | 'batching'
  | 'typescript'
  | 'suspense'
  | 'indice'
  | 'transacao'
  | 'vacuum'
  | 'docker'
  | 'redis'
  | 'rabbitmq'

export type Perk = {
  id: PerkId
  branch: string
  name: string
  cost: number
  needs?: PerkId
  effect: string
  concept: string
}

// Custos por nível, baixos de propósito: a ideia é fechar a árvore (96) até a 2ª parada e testar a build cheia
// na onda sem fim. Medido com um jogador simulado: ~40 fragmentos na 1ª parada e 80 a 100 na 2ª.
const C1 = 4
const C2 = 8
const C3 = 12

export const PERKS: Perk[] = [
  {
    id: 'goroutine',
    branch: 'Go',
    name: 'Goroutine',
    cost: C1,
    effect: 'Um caçador automático golpeia, a cada 2 s, o bug mais perto da Produção.',
    concept: 'Trabalho concorrente rodando sozinho.',
  },
  {
    id: 'pool',
    branch: 'Go',
    name: 'Worker pool',
    cost: C2,
    needs: 'goroutine',
    effect: 'Passam a ser 3 caçadores automáticos.',
    concept: 'Várias goroutines dividindo a fila.',
  },
  {
    id: 'channels',
    branch: 'Go',
    name: 'Channels',
    cost: C3,
    needs: 'pool',
    effect: 'O golpe do caçador automático passa adiante para o bug mais perto: 1 acerto em cadeia.',
    concept: 'Uma goroutine entrega o trabalho para a próxima.',
  },
  {
    id: 'batching',
    branch: 'React',
    name: 'Batching',
    cost: C1,
    effect: 'O golpe acerta uma área 50% maior.',
    concept: 'Várias atualizações num render só.',
  },
  {
    id: 'typescript',
    branch: 'React',
    name: 'TypeScript',
    cost: C2,
    needs: 'batching',
    effect: 'Bugs pálidos morrem num golpe, sem pedir confirmação.',
    concept: 'O erro é pego antes de rodar.',
  },
  {
    id: 'suspense',
    branch: 'React',
    name: 'Suspense',
    cost: C3,
    needs: 'typescript',
    effect: 'Mostra, 1 s antes, de que ponto da borda vem o próximo bug.',
    concept: 'Um aviso enquanto o resto ainda carrega.',
  },
  {
    id: 'indice',
    branch: 'PostgreSQL',
    name: 'Índice',
    cost: C1,
    effect: 'A luz da lanterna cobre 50% mais área e deixa os bugs mais lentos.',
    concept: 'A busca deixa de varrer tudo.',
  },
  {
    id: 'transacao',
    branch: 'PostgreSQL',
    name: 'Transação',
    cost: C2,
    needs: 'indice',
    effect: 'Uma vez por partida, desfaz o golpe que derrubaria a Produção: ela volta com 2 de vida.',
    concept: 'Rollback.',
  },
  {
    id: 'vacuum',
    branch: 'PostgreSQL',
    name: 'Vacuum',
    cost: C3,
    needs: 'transacao',
    effect: 'A cada 8 s, limpa os bugs pálidos da tela.',
    concept: 'O autovacuum recolhe o que ficou para trás.',
  },
  {
    id: 'docker',
    branch: 'Infra',
    name: 'Docker',
    cost: C1,
    effect: 'No começo de cada onda, a Produção recupera 2 de vida.',
    concept: 'Subir o contêiner de novo, limpo.',
  },
  {
    id: 'redis',
    branch: 'Infra',
    name: 'Redis',
    cost: C2,
    needs: 'docker',
    effect: 'O combo dura o dobro do tempo.',
    concept: 'Cache: o que é quente fica à mão.',
  },
  {
    id: 'rabbitmq',
    branch: 'Infra',
    name: 'RabbitMQ',
    cost: C3,
    needs: 'redis',
    effect: 'O bug que chega na Produção volta para a borda, no máximo 1 a cada 8 s.',
    concept: 'A mensagem volta para a fila em vez de se perder.',
  },
]

export const BRANCHES = ['Go', 'React', 'PostgreSQL', 'Infra']

export const perkById = (id: PerkId) => PERKS.find(p => p.id === id)!
export const perkName = (id: PerkId) => perkById(id).name

export const WAVES = 3
export const WAVE_MS = 40000

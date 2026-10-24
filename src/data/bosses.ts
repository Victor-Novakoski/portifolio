// Cada desafio técnico é um chefe. A luta, o "Ler sem lutar" e o modo de movimento reduzido mostram estes mesmos textos.
export type Boss = {
  id: 1 | 2 | 3
  name: string
  title: string
  stakes: string
  tip: string
  hint: string
  fragments: [string, string, string]
}

export const fragmentLabels = ['O risco', 'A solução', 'O resultado'] as const

export const bosses: Boss[] = [
  {
    id: 1,
    name: 'O Desincronizado',
    title: 'Tempo real com várias instâncias da API',
    stakes: 'Um evento publicado em qualquer instância precisa chegar a todos os clientes conectados.',
    tip: 'divide-se após o 1º golpe',
    hint: 'Depois do 1º golpe ele se divide: as cópias atacam duas vezes, fora de sincronia.',
    fragments: [
      'Cada instância da API só conhece os WebSockets abertos nela. Um evento que entra pela instância A não chega a quem está conectado na B.',
      'Redis pub/sub entre as instâncias: todas publicam o evento num canal e assinam o mesmo canal, entregando aos seus próprios sockets.',
      'Todo cliente recebe a atualização, não importa onde conectou. Escalar a API vira subir mais instâncias.',
    ],
  },
  {
    id: 2,
    name: 'O Mensageiro Esquecido',
    title: 'Notificações que não se perdem',
    stakes: 'Se o dado foi salvo, a notificação precisa sair, mesmo que algo caia no meio.',
    tip: 'confirme cada golpe',
    hint: 'Golpe sem confirmação volta para a fila: depois de acertar, ataque de novo (um golpe carregado confirma na hora).',
    fragments: [
      'Salvar no banco e publicar no RabbitMQ são duas operações. Se o processo cai entre elas, o dado existe e a notificação some.',
      'Transactional Outbox: o evento é gravado na mesma transação do dado. Um worker lê a tabela com FOR UPDATE SKIP LOCKED e publica.',
      'Dado e notificação entram juntos ou não entram. Vários workers dividem a fila sem pegar a mesma linha.',
    ],
  },
  {
    id: 3,
    name: 'O Ladrão de Sessões',
    title: 'Sessão segura sem token exposto',
    stakes: 'Manter o usuário logado sem deixar um token que um script consiga ler.',
    tip: 'apare o roubo de sessão',
    hint: 'Às vezes tenta roubar sua sessão (círculo dourado). Esquiva não adianta: apare.',
    fragments: [
      'Um token guardado onde o JavaScript alcança pode ser levado por qualquer XSS e usado até expirar.',
      'Access token curto só em memória; refresh token rotativo em cookie HttpOnly. Cada refresh vale uma vez, e reusar um antigo derruba a sessão.',
      'Nenhum token fica ao alcance de script. Um refresh copiado que reaparece encerra a sessão, em vez de manter o invasor dentro.',
    ],
  },
]

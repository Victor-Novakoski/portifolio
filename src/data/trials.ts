export type Trial = {
  id: string
  title: string
  problem: string
  approach: string
  result: string
}

export const trials: Trial[] = [
  {
    id: 'trial-realtime',
    title: 'Provação I — Tempo real com várias instâncias da API',
    problem:
      'No Rastreia, o cliente pode estar conectado numa instância da API e o motorista mudar o status por outra. Sem algo no meio, a tela do cliente nunca fica sabendo.',
    approach:
      'WebSocket só no sentido servidor → cliente, com o token na primeira mensagem para não aparecer em log, e Redis pub/sub repassando cada mudança para todas as instâncias.',
    result:
      'Painel da transportadora e página pública atualizam sozinhos, sem F5, e a API pode escalar horizontalmente. O mesmo Redis guarda o rate limit compartilhado.',
  },
  {
    id: 'trial-outbox',
    title: 'Provação II — Notificações que não se perdem',
    problem:
      'A API grava a mudança de status no banco e depois publica no RabbitMQ. Se cair entre as duas coisas, o status muda e o cliente nunca é avisado.',
    approach:
      'Transactional Outbox: o evento é gravado na mesma transação do status, e um relay publica com confirmação do RabbitMQ, usando FOR UPDATE SKIP LOCKED para várias instâncias não pegarem o mesmo evento.',
    result:
      'Entrega garantida "pelo menos uma vez" de e-mails e Web Push, mesmo com o RabbitMQ fora do ar por alguns minutos.',
  },
  {
    id: 'trial-session',
    title: 'Provação III — Sessão segura sem token exposto',
    problem:
      'Guardar token no localStorage deixa a sessão vulnerável a XSS, e um refresh token roubado daria acesso por muito tempo.',
    approach:
      'Access token curto só em memória e refresh token rotativo em cookie HttpOnly, guardado no banco como hash. Token já usado, apresentado de novo, derruba a sessão inteira. No Panda Cooking, o navegador fala só com o front, que repassa /api para a API.',
    result:
      'Nenhum token legível pelo JavaScript, roubo de sessão detectado na próxima renovação e sem CORS entre front e API.',
  },
]

export type Trial = {
  id: string
  title: string
  problem: string
  approach: string
  result: string
  where: string
  diagram?: boolean
}

export const trials: Trial[] = [
  {
    id: 'trial-realtime',
    title: 'Tempo real com várias instâncias da API',
    problem:
      'O cliente está conectado numa instância e o motorista muda o status por outra. Sem nada no meio, a tela do cliente nunca fica sabendo.',
    approach:
      'WebSocket só do servidor para o cliente, com o token na primeira mensagem para não cair em log, e Redis pub/sub repassando cada mudança para todas as instâncias.',
    result:
      'Painel e página pública atualizam sozinhos, e a API escala na horizontal. O mesmo Redis guarda o rate limit compartilhado.',
    where: 'rastreia',
    diagram: true,
  },
  {
    id: 'trial-outbox',
    title: 'Notificações que não se perdem',
    problem:
      'A API grava o status e depois publica na fila. Se cair entre as duas coisas, o cliente nunca é avisado.',
    approach:
      'Transactional Outbox: o evento é gravado na mesma transação do status, e um relay publica com confirmação do RabbitMQ, usando FOR UPDATE SKIP LOCKED.',
    result:
      'E-mails e Web Push entregues pelo menos uma vez, mesmo com o RabbitMQ fora do ar por alguns minutos.',
    where: 'rastreia',
  },
  {
    id: 'trial-session',
    title: 'Sessão segura sem token exposto',
    problem:
      'Token no localStorage fica vulnerável a XSS, e um refresh token roubado daria acesso por muito tempo.',
    approach:
      'Access token curto só em memória e refresh token rotativo em cookie HttpOnly, guardado como hash. Token reusado derruba a sessão inteira.',
    result: 'Nenhum token legível pelo JavaScript, e roubo de sessão detectado na próxima renovação.',
    where: 'rastreia · panda',
  },
]

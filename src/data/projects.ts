export type ProjectBoss = {
  id: string
  name: string
  context: string
  stack: string[]
  challenges: string[]
  repoUrl?: string
  backendRepoUrl?: string
  demoUrl?: string
}

export const projects: ProjectBoss[] = [
  {
    id: 'rastreia',
    name: 'Rastreia',
    context:
      'Plataforma de rastreio de entregas em tempo real: a transportadora cadastra as entregas, o motorista atualiza o status pelo celular (PWA com Web Push) e o cliente acompanha por um link público.',
    stack: ['Go', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'RabbitMQ', 'WebSocket', 'Docker'],
    challenges: [
      'Status ao vivo com WebSocket e Redis pub/sub funcionando com várias instâncias da API',
      'Notificações que não se perdem, com Transactional Outbox e worker de e-mail no RabbitMQ',
      'Sessão com JWT curto e refresh token rotativo com detecção de reuso',
    ],
  },
  {
    id: 'panda-cooking',
    name: 'Panda Cooking',
    context:
      'Rede de receitas: qualquer pessoa busca e lê receitas; com conta, publica as suas com fotos, ingredientes e modo de preparo, comenta e guarda as favoritas.',
    stack: ['Go', 'Gin', 'PostgreSQL', 'Next.js', 'React', 'TypeScript', 'Docker'],
    challenges: [
      'Sessão segura com refresh token em cookie HttpOnly e o navegador falando só com o front (BFF)',
      'Proteção contra abuso com limite por IP, bloqueio de login e checagem de origem',
      'Busca que ignora acento com unaccent e índice de trigramas no PostgreSQL',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski/panda-cooking-front',
    backendRepoUrl: 'https://github.com/Victor-Novakoski/panda-cooking-go-api',
  },
  {
    id: 'contacts',
    name: 'Contacts',
    context:
      'Aplicação para gestão de contatos, priorizando simplicidade de uso, estrutura organizada e manutenção rápida.',
    stack: ['React', 'TypeScript', 'Axios', 'Styled Components'],
    challenges: [
      'Padronizar estados de formulário e validação de dados',
      'Garantir comunicação estável entre front-end e API',
      'Construir fluxo CRUD com baixo acoplamento',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski/contacts-front',
    backendRepoUrl: 'https://github.com/Victor-Novakoski/contacts-back',
  },
  {
    id: 'motors-shop',
    name: 'Motors Shop',
    context:
      'Plataforma de compra e venda de veículos com autenticação e fluxo de anúncios, construída com integração entre front-end e serviços back-end.',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'REST API'],
    challenges: [
      'Modelar fluxo de autenticação e permissões de usuário',
      'Integrar dados de anúncios e detalhes de veículos com API',
      'Manter usabilidade da interface em jornadas longas de navegação',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski/Motors-Shop-Front',
    backendRepoUrl: 'https://github.com/Victor-Novakoski/Motors-Shop-Back',
    demoUrl: 'https://motors-shop-front-chi.vercel.app',
  },
]

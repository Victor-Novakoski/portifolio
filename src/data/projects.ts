export type ProjectBoss = {
  id: string
  name: string
  context: string
  stack: string[]
  challenges: string[]
  repoUrl: string
  backendRepoUrl?: string
  demoUrl?: string
}

export const projects: ProjectBoss[] = [
  {
    id: 'panda-cooking',
    name: 'Panda Cooking',
    context:
      'Aplicação full stack para compartilhamento de receitas, com foco em experiência de uso, componentização e organização de fluxo no front-end.',
    stack: ['React', 'TypeScript', 'Axios', 'Styled Components', 'Framer Motion'],
    challenges: [
      'Estruturar componentes reutilizáveis sem perder consistência visual',
      'Integrar chamadas HTTP com feedback claro de estado',
      'Manter fluidez de interface com animações sem comprometer performance',
    ],
    repoUrl: 'https://github.com/Victor-Novakoski/panda-cooking',
    backendRepoUrl: 'https://github.com/Victor-Novakoski/panda-cooking-api',
    demoUrl: 'https://panda-cooking.vercel.app',
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

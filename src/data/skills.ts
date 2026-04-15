export type Skill = {
  id: string
  title: string
  domain: 'frontend' | 'backend' | 'platform' | 'future'
  description: string
}

export const skills: Skill[] = [
  {
    id: 'angular',
    title: 'Angular',
    domain: 'frontend',
    description: 'Construção e manutenção de interfaces para sistema logístico em escala nacional.',
  },
  {
    id: 'react',
    title: 'React',
    domain: 'frontend',
    description: 'Projetos web com componentização e integração com APIs REST.',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    domain: 'frontend',
    description: 'Tipagem para previsibilidade, manutenção e redução de erros em front-end.',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    domain: 'frontend',
    description: 'Base sólida para lógica de interface e integração de serviços.',
  },
  {
    id: 'html-css',
    title: 'HTML e CSS',
    domain: 'frontend',
    description: 'Estrutura e estilização de interfaces responsivas e usáveis.',
  },
  {
    id: 'go',
    title: 'Go (Golang)',
    domain: 'backend',
    description: 'Desenvolvimento e manutenção de APIs para suporte aos fluxos da aplicação.',
  },
  {
    id: 'node-express',
    title: 'Node.js e Express',
    domain: 'backend',
    description: 'Construção de serviços HTTP e integração com front-end.',
  },
  {
    id: 'postgres',
    title: 'PostgreSQL',
    domain: 'backend',
    description: 'Noções de modelagem e uso de banco relacional em aplicações web.',
  },
  {
    id: 'docker',
    title: 'Docker (nível inicial)',
    domain: 'platform',
    description: 'Execução e organização de serviços para ambientes de desenvolvimento.',
  },
  {
    id: 'rest',
    title: 'REST API',
    domain: 'platform',
    description: 'Integração de front-end com serviços back-end e contratos HTTP.',
  },
  {
    id: 'yaml-lowcode',
    title: 'Low-code YAML',
    domain: 'platform',
    description: 'Customizações em framework interno de geração de interfaces.',
  },
  {
    id: 'git',
    title: 'Git e colaboração',
    domain: 'platform',
    description: 'Versionamento e fluxo colaborativo para evolução contínua de produto.',
  },
  {
    id: 'software-engineering',
    title: 'Engenharia de Software',
    domain: 'future',
    description: 'Formação acadêmica iniciada em março de 2026 para aprofundamento técnico.',
  },
]

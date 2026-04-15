export type Skill = {
  id: string
  title: string
  domain: 'frontend' | 'backend' | 'platform' | 'future'
  description: string
}

export const skills: Skill[] = [
  {
    id: 'frontend',
    title: 'Engenharia Front-end',
    domain: 'frontend',
    description: 'Interfaces escaláveis com React, TypeScript e componentização consistente.',
  },
  {
    id: 'architecture',
    title: 'Arquitetura de UI',
    domain: 'platform',
    description: 'Separação de responsabilidades, design de módulos e evolução incremental.',
  },
  {
    id: 'performance',
    title: 'Performance na Web',
    domain: 'platform',
    description: 'Otimização de renderização, bundle e experiência percebida.',
  },
  {
    id: 'responsiveness',
    title: 'Responsividade',
    domain: 'frontend',
    description: 'Layouts fluidos e consistentes em mobile, tablet e desktop.',
  },
  {
    id: 'design-system',
    title: 'Sistema de Design',
    domain: 'platform',
    description: 'Bibliotecas de componentes, tokens e governança visual.',
  },
  {
    id: 'dataviz',
    title: 'Visualização de Dados',
    domain: 'backend',
    description: 'Modelagem de dados para leitura visual clara e confiável.',
  },
  {
    id: 'ai',
    title: 'Engenharia de IA',
    domain: 'future',
    description: 'Integração de fluxos com IA para assistência e automação contextual.',
  },
]

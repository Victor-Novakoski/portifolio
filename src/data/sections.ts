// Seções da página, na ordem: o menu de título, o cabeçalho e o "Continuar em" leem daqui.
export type Section = {
  id: string
  label: string
  tag: string
  nav?: boolean
}

export const sections: Section[] = [
  { id: 'projetos', label: 'Projetos', tag: 'inventário', nav: true },
  { id: 'desafios', label: 'Desafios técnicos', tag: 'chefes', nav: true },
  { id: 'experiencia', label: 'Experiência', tag: 'mapa', nav: true },
  { id: 'habilidades', label: 'Habilidades', tag: 'equipamento', nav: true },
  { id: 'sobre', label: 'Sobre', tag: 'personagem', nav: true },
  { id: 'cacabugs', label: 'Mini game', tag: 'caça-bugs' },
  { id: 'contato', label: 'Contato', tag: 'chamar aliado', nav: true },
]

export const sectionById = (id: string | null) => sections.find(s => s.id === id)

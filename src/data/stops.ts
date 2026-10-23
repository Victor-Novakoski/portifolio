// Cada seção é um ponto de parada da "entrega": o trilho, a barra de rota e o rastreio da visita leem daqui.
export type Stop = {
  id: string
  label: string
}

export const stops: Stop[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'desafios', label: 'Desafios' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
]

export const navStops = stops.filter(stop => ['projetos', 'desafios', 'experiencia', 'habilidades', 'contato'].includes(stop.id))

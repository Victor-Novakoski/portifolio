export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A abertura roda uma vez por sessão; o script inline do index.html marca <html class="intro"> antes do primeiro paint.
export const introIsRunning = () => document.documentElement.classList.contains('intro')

// Versão curta da abertura, para quem já visitou o site antes.
export const introIsShort = () => document.documentElement.classList.contains('intro-short')

export function endIntro() {
  document.documentElement.classList.remove('intro', 'intro-short')
}

// A brasa da abertura pousou na primeira parada do trilho.
export const LAND_EVENT = 'brasa:land'

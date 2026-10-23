export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A abertura roda uma vez por sessão; o script inline do index.html marca <html class="intro"> antes do primeiro paint.
export const introIsRunning = () => document.documentElement.classList.contains('intro')

export function endIntro() {
  document.documentElement.classList.remove('intro')
}

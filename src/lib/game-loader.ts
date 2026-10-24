// O Caça-bugs é pesado para o celular: o código só baixa quando alguém passa o mouse, foca ou clica em jogar.
export const loadGame = () => import('@/game/caca-bugs')

export function preloadGame() {
  loadGame().catch(() => {
    // sem rede agora; o clique tenta de novo
  })
}

export const BEST_KEY = 'forja.recorde'

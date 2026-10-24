import { useSyncExternalStore } from 'react'

// Estado compartilhado pelos sistemas de jogo: a pausa global do cabeçalho e quem está usando o teclado.
// Cada sistema registra o próprio listener e consulta `active` antes de agir.
export type Owner = 'fight' | 'game' | null

type State = { paused: boolean; active: Owner }

let state: State = { paused: false, active: null }
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(fn => fn())
}

export const runtime = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
  setPaused(paused: boolean) {
    if (state.paused === paused) return
    state = { ...state, paused }
    document.documentElement.classList.toggle('paused', paused)
    emit()
  },
  claim(owner: Exclude<Owner, null>) {
    state = { ...state, active: owner }
    emit()
  },
  release(owner: Exclude<Owner, null>) {
    if (state.active !== owner) return
    state = { ...state, active: null }
    emit()
  },
}

export function usePaused() {
  return useSyncExternalStore(runtime.subscribe, () => runtime.get().paused)
}

// O mini game fica num chunk separado; as lutas e o cabeçalho abrem ele por aqui.
export const OPEN_GAME_EVENT = 'forja:caca-bugs'
export const openGame = () => window.dispatchEvent(new Event(OPEN_GAME_EVENT))

// Um chefe derrotado solta um bug fugitivo pela tela.
export const STRAY_BUG_EVENT = 'forja:bug-fugitivo'

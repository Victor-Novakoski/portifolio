// localStorage pode lançar exceção (aba anônima, dados bloqueados): o site funciona igual sem ele.
export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // sem armazenamento, só não lembra
  }
}

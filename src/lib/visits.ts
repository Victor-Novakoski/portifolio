// Memória da visita anterior, guardada só no navegador do visitante. Tudo em try/catch:
// em aba anônima ou com armazenamento bloqueado, o site segue como numa primeira visita.
const LAST_KEY = 'brasa-last'
const PREV_KEY = 'brasa-prev'

export type LastVisit = { at: number; delivered: boolean; visits: number }

function parse(raw: string | null): LastVisit | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw)
    if (typeof value?.at !== 'number') return null
    return { at: value.at, delivered: Boolean(value.delivered), visits: Number(value.visits) || 1 }
  } catch {
    return null
  }
}

// A visita anterior é lida uma vez por sessão; recarregar a página não conta como volta.
export function startVisit(): LastVisit | null {
  try {
    const cached = sessionStorage.getItem(PREV_KEY)
    if (cached !== null) return parse(cached)

    const previous = parse(localStorage.getItem(LAST_KEY))
    sessionStorage.setItem(PREV_KEY, previous ? JSON.stringify(previous) : '')
    localStorage.setItem(LAST_KEY, JSON.stringify({ at: Date.now(), delivered: false, visits: (previous?.visits ?? 0) + 1 }))
    return previous
  } catch {
    return null
  }
}

export function markDelivered() {
  try {
    const last = parse(localStorage.getItem(LAST_KEY))
    if (last && !last.delivered) localStorage.setItem(LAST_KEY, JSON.stringify({ ...last, delivered: true }))
  } catch {
    // sem armazenamento, nada a guardar
  }
}

export function formatAgo(ms: number) {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 2) return 'agora há pouco'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  const days = Math.floor(hours / 24)
  return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
}

// Tempo desde o início da visita, como um rastreio conta: +1:36.
export function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.round(ms / 1000))
  return `+${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

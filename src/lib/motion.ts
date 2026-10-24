const query = (q: string) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false)

export const prefersReducedMotion = () => query('(prefers-reduced-motion: reduce)')

export const isCoarsePointer = () => query('(pointer: coarse)')

export const rnd = (min: number, max: number) => min + Math.random() * (max - min)

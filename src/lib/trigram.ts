// A ideia da busca do Panda Cooking (unaccent + pg_trgm), simulada no navegador.
export const unaccent = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function trigrams(s: string) {
  const out = new Set<string>()
  unaccent(s)
    .split(/\s+/)
    .forEach(word => {
      if (!word) return
      const padded = `  ${word} `
      for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3))
    })
  return out
}

export function similarity(a: string, b: string) {
  const A = trigrams(a)
  const B = trigrams(b)
  let shared = 0
  A.forEach(t => {
    if (B.has(t)) shared++
  })
  const union = A.size + B.size - shared
  return union ? shared / union : 0
}

export function searchRecipes(query: string, recipes: string[]) {
  const q = query.trim()
  if (!q) return []
  return recipes
    .map(name => {
      let score = Math.max(...unaccent(name).split(' ').map(word => similarity(q, word)))
      if (unaccent(name).includes(unaccent(q))) score = Math.max(score, 0.6)
      return { name, score }
    })
    .filter(r => r.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

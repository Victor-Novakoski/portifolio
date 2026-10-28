import { useId, useState } from 'react'

import { demoRecipes } from '@/data/projects'
import { searchRecipes } from '@/lib/trigram'

export function SearchDemo() {
  const id = useId()
  const [query, setQuery] = useState('pao')
  const results = searchRecipes(query, demoRecipes)

  return (
    <div className="demo">
      <label htmlFor={id}>Teste a ideia da busca</label>
      <input id={id} value={query} onChange={e => setQuery(e.target.value)} autoComplete="off" spellCheck={false} />
      <ul aria-live="polite">
        {query.trim() && !results.length && (
          <li>
            <span>Nenhuma receita parecida.</span>
          </li>
        )}
        {results.map(r => (
          <li key={r.name}>
            <span>{r.name}</span>
            <span className="mono">{r.score.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <small>Simulação no navegador da ideia de unaccent + trigramas, com receitas fictícias.</small>
    </div>
  )
}

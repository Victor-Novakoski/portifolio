import { stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'

// Trilho de brasas (desktop) e barra de rota (celular). As duas leem a posição de --route.
export function Rail() {
  const { current, visited } = useJourney()

  return (
    <>
      <div className="routebar" aria-hidden="true">
        <span />
      </div>
      <nav className="rail" aria-label="Trilho de brasas">
        <span className="line" />
        <span className="line-lit" />
        <ol>
          {stops.map((stop, i) => {
            const classes = [visited.has(stop.id) && 'lit', current === stop.id && 'current'].filter(Boolean).join(' ')
            return (
              <li key={stop.id} style={{ top: `${(i / (stops.length - 1)) * 100}%` }}>
                <a href={`#${stop.id}`} className={classes || undefined} aria-current={current === stop.id ? 'true' : undefined}>
                  <span className="stop" />
                  <span className="name">{stop.label}</span>
                </a>
              </li>
            )
          })}
        </ol>
        <span className="traveler" aria-hidden="true" />
      </nav>
    </>
  )
}

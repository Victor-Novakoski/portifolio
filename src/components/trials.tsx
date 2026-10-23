import { EventDiagram } from '@/components/event-diagram'
import { SectionHead } from '@/components/section-head'
import { trials, type Trial } from '@/data/trials'
import { useReveal } from '@/hooks/use-reveal'

function TrialCard({ trial, open }: { trial: Trial; open: boolean }) {
  const ref = useReveal<HTMLDetailsElement>()

  return (
    <details className="trial" open={open} ref={ref}>
      <summary>
        <span>
          <h3>{trial.title}</h3>
          <p className="prob">{trial.problem}</p>
        </span>
        <span className="meta">
          <span className="stamp">RESOLVIDO</span>
          <span className="where">{trial.where}</span>
          <span className="toggle" />
        </span>
      </summary>
      <div className="content">
        <div>
          <h4>Abordagem</h4>
          <p>{trial.approach}</p>
        </div>
        <div>
          <h4>Resultado</h4>
          <p>{trial.result}</p>
        </div>
        {trial.diagram && <EventDiagram />}
      </div>
    </details>
  )
}

export function Trials() {
  return (
    <section className="stop-sec" id="desafios">
      <div className="wrap">
        <SectionHead stopId="desafios" title="Desafios técnicos">
          Problemas que apareceram de verdade, como foram resolvidos e o que mudou depois.
        </SectionHead>
        <div className="trials">
          {trials.map((trial, i) => (
            <TrialCard key={trial.id} trial={trial} open={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

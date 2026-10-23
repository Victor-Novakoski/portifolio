import { SectionHead } from '@/components/section-head'
import { experienceMilestones } from '@/data/experience'

export function Journey() {
  return (
    <section className="stop-sec" id="experiencia">
      <div className="wrap journey">
        <SectionHead stopId="experiencia" title="Experiência">
          Do quartel ao Go, passando pela Kenzie.
        </SectionHead>
        <ol className="timeline">
          {experienceMilestones.map(milestone => (
            <li key={milestone.id} className={milestone.kind}>
              <span className="tl-mark" aria-hidden="true" />
              <div>
                <span className="tl-when">{milestone.when}</span>
                <h3>
                  {milestone.title} · <span className="org">{milestone.org}</span>
                </h3>
                <p>{milestone.summary}</p>
                {milestone.highlights && (
                  <ul>
                    {milestone.highlights.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

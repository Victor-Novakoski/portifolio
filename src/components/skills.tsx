import { SectionHead } from '@/components/section-head'
import { gear } from '@/data/skills'

export function Skills() {
  return (
    <section className="block wrap" id="habilidades" aria-labelledby="h-habilidades">
      <div className="inner">
        <SectionHead id="habilidades" sub="O que está equipado hoje e onde cada peça já foi usada." />
        <ul className="gear">
          {gear.map(g => (
            <li key={g.id} className="eq">
              <span className="ic" aria-hidden="true">
                {g.short}
              </span>
              <div>
                <span className="k">{g.slot}</span>
                <h3>{g.name}</h3>
                <p>{g.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

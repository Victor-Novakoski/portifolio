import { SectionHead } from '@/components/section-head'
import { skillPlaces, skills, type SkillPlace } from '@/data/skills'

const places = Object.keys(skillPlaces) as SkillPlace[]

export function Skills() {
  return (
    <section className="stop-sec" id="habilidades">
      <div className="wrap">
        <SectionHead stopId="habilidades" title="Habilidades">
          O que uso, para quê e onde dá para ver.
        </SectionHead>
        <div className="inv-wrap">
          <table className="inv">
            <thead>
              <tr>
                <th scope="col">Ferramenta</th>
                <th scope="col">Uso</th>
                <th scope="col">Onde</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.id}>
                  <th scope="row">
                    {skill.tool}
                    <small>{skill.area}</small>
                  </th>
                  <td className="use" data-label="Uso">{skill.use}</td>
                  <td className="where" data-label="Onde">
                    {skill.where.map(place => (
                      <span key={place} className="place">
                        <span className={`dotw ${place}`} aria-hidden="true" />
                        {skillPlaces[place].short}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="legend">
          {places.map(place => (
            <span key={place}>
              <span className={`dotw ${place}`} aria-hidden="true" />
              {skillPlaces[place].long}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

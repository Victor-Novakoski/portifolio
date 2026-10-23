import { SectionHead } from '@/components/section-head'
import { profile } from '@/data/profile'

export function About() {
  return (
    <section className="stop-sec" id="sobre">
      <div className="wrap">
        <SectionHead numeral="V" point="Ponto 5/6 · Origem" title="Sobre" align="left" />
        <div className="about">
          <div>
            <p className="big">
              {profile.about.headline.map(part => (part.highlight ? <em key={part.text}>{part.text}</em> : part.text))}
            </p>
          </div>
          <div>
            <p>{profile.about.body}</p>
            <ul className="principles">
              {profile.about.principles.map((principle, i) => (
                <li key={principle}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

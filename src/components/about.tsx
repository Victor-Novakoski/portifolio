import { SectionHead } from '@/components/section-head'
import { about } from '@/data/profile'

export function About() {
  return (
    <section className="block wrap" id="sobre" aria-labelledby="h-sobre">
      <div className="inner">
        <SectionHead id="sobre" />
        <div className="about">
          <div className="txt">
            {about.paragraphs.map(p => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="card offc">
            <h3>Fora do código</h3>
            <span className="tag">Feito à mão</span>
            <ul className="crafts">
              {about.crafts.map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <span className="tag">{about.cosplay.title}</span>
            <ul className="real">
              {about.cosplay.parts.map(part => (
                <li key={part.text} className={part.done ? undefined : 'todo'}>
                  <b aria-hidden="true">{part.done ? '✓' : '○'}</b>
                  <span>
                    <span className="sr">{part.done ? 'Pronto: ' : 'Falta: '}</span>
                    {part.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

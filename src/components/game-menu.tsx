import { sectionById, sections } from '@/data/sections'

// Menu de título. Para quem volta, o primeiro item é "Continuar jogo" na seção onde parou.
export function GameMenu({ resumeAt }: { resumeAt: string | null }) {
  const resume = sectionById(resumeAt)

  return (
    <nav className="menu wrap" id="menu" aria-label="Menu principal">
      <div className="inner">
        <ol>
          {resume && (
            <li className="cont">
              <a href={`#${resume.id}`}>
                Continuar jogo <sup>{resume.label}</sup>
              </a>
            </li>
          )}
          {sections.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                {s.label} <sup>{s.tag}</sup>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

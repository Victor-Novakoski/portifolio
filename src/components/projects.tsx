import { PinGlyph, PotGlyph } from '@/components/icons'
import { SectionHead } from '@/components/section-head'
import { projects, studyProjects, type Project } from '@/data/projects'
import { useReveal } from '@/hooks/use-reveal'

const glyphs = { pin: PinGlyph, pot: PotGlyph }

const statusLabel = { soon: 'em breve', open: 'código aberto' }

// As linhas da ficha entram uma após a outra.
const staggerRows = (card: HTMLElement) => {
  card.querySelectorAll('.sheet > div').forEach((row, i) => {
    row.querySelectorAll<HTMLElement>('dt, dd').forEach(cell => {
      cell.style.transitionDelay = `${i * 90}ms`
    })
  })
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useReveal<HTMLElement>(staggerRows)
  const Glyph = glyphs[project.glyph]
  const titleId = `p-${project.id}`

  return (
    <article className="item rows" aria-labelledby={titleId} ref={ref}>
      <div className="shotbox">
        <img src={project.image} alt={project.imageAlt} width={800} height={450} loading="lazy" decoding="async" />
      </div>
      <div className="item-top">
        <span className="glyph">
          <Glyph />
        </span>
        <div>
          <h3 id={titleId}>
            {project.name} <span className={`status-pill ${project.status}`}>{statusLabel[project.status]}</span>
          </h3>
          <div className="type">{project.type}</div>
        </div>
      </div>
      <div className="item-body">
        <dl className="sheet">
          {project.sheet.map(row => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="flavor">{project.flavor}</p>
        <ul className="effects">
          {project.effects.map(effect => (
            <li key={effect}>{effect}</li>
          ))}
        </ul>
        <div className="item-links">
          {project.links.length === 0 && <span className="off">código sob pedido</span>}
          {project.links.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <section className="stop-sec" id="projetos">
      <div className="wrap">
        <SectionHead stopId="projetos" title="Projetos">
          Feitos de ponta a ponta: API, banco, interface, testes e CI.
        </SectionHead>
        <div className="projects">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="study">
          <h3>Projetos de estudo</h3>
          {studyProjects.map(study => (
            <div key={study.id}>
              <strong>{study.name}</strong>
              <span>{study.summary}</span>
              <a href={study.href} target="_blank" rel="noreferrer">
                código ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

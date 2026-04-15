import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { contact } from '@/data/contact'
import { experienceMilestones } from '@/data/experience'
import { narrative } from '@/data/narrative'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'
import { trials } from '@/data/trials'

type RegionDetailsProps = {
  regionId: string
}

const cardClasses = 'rounded-lg border border-slate-800 bg-slate-900/75 p-3'
const sectionTitleClasses =
  'inline-flex w-fit rounded-md border border-souls-ember/45 bg-souls-ember/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-souls-ember shadow-[0_0_0_1px_rgba(202,163,89,0.14)]'

type SkillDomain = 'frontend' | 'backend' | 'platform' | 'future'

const domainLabel: Record<SkillDomain, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  platform: 'Plataforma',
  future: 'Futuro',
}

const domainOrder: SkillDomain[] = ['frontend', 'platform', 'backend', 'future']

function HubPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-200">{narrative.intro}</p>
      <article className={cardClasses}>
        <p className="font-medium text-slate-100">{contact.name}</p>
        <p className="mt-1 text-sm text-slate-300">{contact.role}</p>
        <p className="mt-2 text-xs text-slate-400">
          {contact.location} • {contact.phone}
        </p>
      </article>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Foco</p>
          <p className="mt-2 text-sm text-slate-100">
            Back-end com Go e APIs escaláveis, com front-end em React/TypeScript e Next.js para entregas
            completas.
          </p>
        </article>
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Stack base</p>
          <p className="mt-2 text-sm text-slate-100">
            Go, React, Next.js, TypeScript, Node.js, REST API, PostgreSQL e Docker
          </p>
        </article>
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Ambiente de atuação</p>
          <p className="mt-2 text-sm text-slate-100">
            Plataforma logística enterprise com regras críticas de transporte e alto volume de dados.
          </p>
        </article>
      </div>
      <div className="space-y-2">
        <p className={sectionTitleClasses}>Princípios de engenharia</p>
        <div className="grid gap-2">
          {narrative.codex.principles.map(item => (
            <article key={item} className={cardClasses}>
              <p className="text-sm text-slate-200">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function BattlefieldPanel() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '')
  const selectedProject =
    projects.find(project => project.id === selectedProjectId) ?? projects[0] ?? null

  if (!selectedProject) return null

  return (
    <div className="space-y-3">
      <p className={sectionTitleClasses}>Projetos em destaque</p>
      <div className="grid gap-2">
        {projects.map(project => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelectedProjectId(project.id)}
            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
              project.id === selectedProject.id
                ? 'border-souls-ember/70 bg-souls-ember/10 text-souls-ember'
                : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>

      <article className={cardClasses}>
        <p className="font-medium text-slate-100">{selectedProject.name}</p>
        <p className="mt-1 text-sm text-slate-300">{selectedProject.context}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedProject.stack.map(item => (
            <span
              key={item}
              className="rounded-full border border-slate-700 bg-slate-950 px-2 py-0.5 text-[11px] text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      </article>

      <div className="grid gap-2 sm:grid-cols-2">
        {selectedProject.challenges.slice(0, 2).map(challenge => (
          <article key={challenge} className={cardClasses}>
            <p className={sectionTitleClasses}>Desafio</p>
            <p className="mt-1 text-sm text-slate-200">{challenge}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={selectedProject.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-souls-ember px-3 py-2 text-xs font-semibold text-black transition hover:brightness-110"
        >
          Repositório front-end
        </a>
        {selectedProject.backendRepoUrl ? (
          <a
            href={selectedProject.backendRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            Repositório back-end
          </a>
        ) : null}
        {selectedProject.demoUrl ? (
          <a
            href={selectedProject.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            Ver demo
          </a>
        ) : null}
      </div>
    </div>
  )
}

function CodexPanel() {
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(
    experienceMilestones[0]?.id ?? null
  )
  const currentRole = experienceMilestones[0]

  return (
    <div className="space-y-4">
      <section className="grid gap-2 sm:grid-cols-3">
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Atuação atual</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{currentRole?.period ?? 'Atual'}</p>
          <p className="mt-1 text-xs text-slate-300">{currentRole?.title ?? 'Desenvolvedor de software'}</p>
        </article>
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Foco técnico</p>
          <p className="mt-1 text-sm font-medium text-slate-100">Go + React/TypeScript</p>
          <p className="mt-1 text-xs text-slate-300">Back-end robusto com entrega full stack orientada a produto</p>
        </article>
        <article className={cardClasses}>
          <p className={sectionTitleClasses}>Contexto</p>
          <p className="mt-1 text-sm font-medium text-slate-100">Logística enterprise</p>
          <p className="mt-1 text-xs text-slate-300">Regras críticas de negócio e alto volume de dados</p>
        </article>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className={sectionTitleClasses}>Resumo estratégico</p>
        <p className="text-sm leading-relaxed text-slate-200">{narrative.codex.origin}</p>
        <p className="text-sm leading-relaxed text-slate-300">{narrative.codex.mission}</p>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className={sectionTitleClasses}>Linha do tempo</p>
        <ol className="space-y-2">
          {experienceMilestones.map(item => {
            const isExpanded = expandedExperienceId === item.id
            return (
              <li
                key={item.id}
                className={`rounded-md border px-3 py-2 transition ${
                  isExpanded
                    ? 'border-souls-ember/60 bg-slate-950/90'
                    : 'border-slate-800 bg-slate-950/70 hover:bg-slate-900/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedExperienceId(prev => (prev === item.id ? null : item.id))}
                  className="w-full text-left"
                >
                  <p className={sectionTitleClasses}>
                    {item.period}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.highlights[0]}</p>
                </button>

                {isExpanded ? (
                  <div className="mt-3 border-t border-slate-800 pt-3">
                    <p className="text-sm text-slate-200">{item.summary}</p>
                    <ul className="mt-2 space-y-1">
                      {item.highlights.map(highlight => (
                        <li key={highlight} className="text-xs text-slate-400">
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

function SkillTreePanel() {
  const grouped = useMemo(() => {
    return domainOrder.map(domain => ({
      domain,
      label: domainLabel[domain],
      items: skills.filter(skill => skill.domain === domain),
    }))
  }, [])

  return (
    <div className="space-y-3">
      {grouped.map(group => (
        <section key={group.domain} className={cardClasses}>
          <p className={sectionTitleClasses}>{group.label}</p>
          <div className="mt-2 grid gap-2">
            {group.items.map(skill => (
              <article
                key={skill.id}
                className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2"
              >
                <p className="text-sm font-medium text-slate-100">{skill.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{skill.description}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function TrialsPanel() {
  const [expandedId, setExpandedId] = useState<string | null>(trials[0]?.id ?? null)

  return (
    <div className="space-y-2">
      {trials.map(trial => {
        const expanded = expandedId === trial.id
        return (
          <article key={trial.id} className={cardClasses}>
            <button
              type="button"
              onClick={() => setExpandedId(prev => (prev === trial.id ? null : trial.id))}
              className="w-full text-left"
            >
              <p className="font-medium text-slate-100">{trial.title}</p>
              <p className="mt-1 text-sm text-slate-300">{trial.problem}</p>
            </button>

            {expanded ? (
              <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                <div>
                  <p className={sectionTitleClasses}>Abordagem</p>
                  <p className="mt-1 text-sm text-slate-200">{trial.approach}</p>
                </div>
                <div>
                  <p className={sectionTitleClasses}>Resultado</p>
                  <p className="mt-1 text-sm text-slate-200">{trial.result}</p>
                </div>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

function ShrinePanel() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const copyStatusTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current) {
        window.clearTimeout(copyStatusTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard indisponível')
      }
      await navigator.clipboard.writeText(contact.email)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    } finally {
      if (copyStatusTimeoutRef.current) {
        window.clearTimeout(copyStatusTimeoutRef.current)
      }
      copyStatusTimeoutRef.current = window.setTimeout(() => {
        setCopyStatus('idle')
      }, 2200)
    }
  }

  return (
    <div className="grid gap-3">
      <article className={cardClasses}>
        <p className={sectionTitleClasses}>Localização e telefone</p>
        <p className="mt-1 text-sm text-slate-200">
          {contact.location} • {contact.phone}
        </p>
      </article>

      <a
        href={`mailto:${contact.email}`}
        className={`${cardClasses} transition hover:border-souls-ember/60`}
      >
        <p className={sectionTitleClasses}>Email</p>
        <p className="mt-1 text-sm text-slate-200">{contact.email}</p>
      </a>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopyEmail}
          className="rounded-md bg-souls-ember px-3 py-2 text-xs font-semibold text-black transition hover:brightness-110"
        >
          Copiar email
        </button>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
        >
          Abrir LinkedIn
        </a>
        <a
          href={contact.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
        >
          Abrir GitHub
        </a>
      </div>

      <p aria-live="polite" className="min-h-5 text-xs text-slate-300">
        {copyStatus === 'success' ? 'Email copiado para a área de transferência.' : null}
        {copyStatus === 'error'
          ? 'Não foi possível copiar automaticamente. Use o email exibido acima.'
          : null}
      </p>
    </div>
  )
}

const panelByRegion: Record<string, () => ReactNode> = {
  hub: HubPanel,
  battlefield: BattlefieldPanel,
  codex: CodexPanel,
  'skill-tree': SkillTreePanel,
  trials: TrialsPanel,
  shrine: ShrinePanel,
}

export function RegionDetails({ regionId }: RegionDetailsProps) {
  const Panel = panelByRegion[regionId]

  if (!Panel) {
    return (
      <article className={cardClasses}>
        <p className="text-sm text-slate-300">
          Conteúdo em preparação. Selecione outra região para continuar a exploração.
        </p>
      </article>
    )
  }

  return <Panel />
}

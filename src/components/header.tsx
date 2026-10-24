import { BrandMark, BugIcon } from '@/components/icons'
import { sections } from '@/data/sections'
import { profile } from '@/data/profile'
import { useCurrentSection } from '@/hooks/use-current-section'
import { openGame, runtime, usePaused } from '@/lib/runtime'
import { preloadGame } from '@/lib/game-loader'

export function Header() {
  const current = useCurrentSection()
  const paused = usePaused()

  return (
    <header className="top wrap">
      <div className="inner">
        <a className="brand" href="#topo" aria-label={`${profile.name}, início`}>
          <BrandMark />
          <span>{profile.name}</span>
        </a>
        <nav className="nav" aria-label="Seções">
          {sections
            .filter(s => s.nav)
            .map(s => (
              <a key={s.id} href={`#${s.id}`} aria-current={current === s.id ? 'true' : undefined}>
                {s.label}
              </a>
            ))}
        </nav>
        <button
          className="mgtop"
          type="button"
          aria-label="Jogar Caça-bugs"
          onClick={openGame}
          onPointerEnter={preloadGame}
          onFocus={preloadGame}
        >
          <BugIcon />
          <span>Caça-bugs</span>
        </button>
        <button className="pausebtn" type="button" aria-pressed={paused} onClick={() => runtime.setPaused(!paused)}>
          <span aria-hidden="true">❚❚</span>
          <span className="label">{paused ? 'Retomar' : 'Pausar'}</span>
        </button>
      </div>
    </header>
  )
}

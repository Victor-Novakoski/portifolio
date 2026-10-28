import { useState } from 'react'

import { About } from '@/components/about'
import { Bosses } from '@/components/bosses'
import { CacaBugsCall } from '@/components/caca-bugs-call'
import { CacaBugsHost } from '@/components/caca-bugs-host'
import { Contact } from '@/components/contact'
import { Experience } from '@/components/experience'
import { Footer } from '@/components/footer'
import { GameMenu } from '@/components/game-menu'
import { Header } from '@/components/header'
import { HunterSymbol } from '@/components/icons'
import { LockOn } from '@/components/lock-on'
import { NotFound } from '@/components/not-found'
import { Projects } from '@/components/projects'
import { ReturnStrip } from '@/components/return-strip'
import { Skills } from '@/components/skills'
import { StrayBug } from '@/components/stray-bug'
import { TitleScreen } from '@/components/title-screen'
import { BEST_KEY } from '@/lib/game-loader'
import { safeGet } from '@/lib/storage'
import { returningTo } from '@/lib/visit'

function Site() {
  const [best, setBest] = useState(() => Number(safeGet(BEST_KEY)) || 0)

  return (
    <>
      <HunterSymbol />
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <TitleScreen />
        <GameMenu resumeAt={returningTo} />
        <Projects />
        <Bosses />
        <Experience />
        <Skills />
        <About />
        <CacaBugsCall best={best} />
        <Contact />
      </main>
      <Footer />
      <CacaBugsHost onBest={setBest} />
      {returningTo && <ReturnStrip sectionId={returningTo} />}
      <StrayBug />
      <LockOn />
    </>
  )
}

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return <NotFound />
  return <Site />
}

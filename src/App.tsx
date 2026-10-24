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
import { NotFound } from '@/components/not-found'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { TitleScreen } from '@/components/title-screen'
import { BEST_KEY } from '@/lib/game-loader'
import { safeGet } from '@/lib/storage'

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
        <GameMenu resumeAt={null} />
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
    </>
  )
}

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return <NotFound />
  return <Site />
}

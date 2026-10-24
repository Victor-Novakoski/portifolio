import { About } from '@/components/about'
import { CacaBugsCall } from '@/components/caca-bugs-call'
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

function Site() {
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
        <Experience />
        <Skills />
        <About />
        <CacaBugsCall best={0} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return <NotFound />
  return <Site />
}

import { About } from '@/components/about'
import { Bonfire } from '@/components/bonfire'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Intro } from '@/components/intro'
import { Journey } from '@/components/journey'
import { NotFound } from '@/components/not-found'
import { Projects } from '@/components/projects'
import { Rail } from '@/components/rail'
import { Leg } from '@/components/section-head'
import { Skills } from '@/components/skills'
import { Trials } from '@/components/trials'
import { JourneyProvider } from '@/hooks/use-journey'
import { useRouteProgress } from '@/hooks/use-route-progress'

function Route() {
  useRouteProgress()

  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Intro />
      <Header />
      <Rail />
      <main id="conteudo">
        <Hero />
        <Leg km={1} />
        <Projects />
        <Leg km={2} />
        <Trials />
        <Leg km={3} />
        <Journey />
        <Leg km={4} />
        <Skills />
        <Leg km={5} />
        <About />
        <Bonfire />
      </main>
      <Footer />
    </>
  )
}

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return <NotFound />

  return (
    <JourneyProvider>
      <Route />
    </JourneyProvider>
  )
}

import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons'
import { profile } from '@/data/profile'
import { useHeroHeat } from '@/hooks/use-hero-heat'

export function Hero() {
  const { heroRef, heatRef, canvasRef } = useHeroHeat()

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <span className="heat" ref={heatRef} aria-hidden="true" />
      <canvas className="hero-sparks" ref={canvasRef} aria-hidden="true" />
      <div className="wrap">
        <div className="namebox">
          <span className="seed" aria-hidden="true" />
          <h1>
            <span className="forename">{profile.forename.toUpperCase()}</span>
            <span className="surname">{profile.surname.toUpperCase()}</span>
          </h1>
        </div>
        <div>
          <p className="logline">
            {profile.stack.join(' · ')} <span className="cmt">// full stack</span>
          </p>
          <p className="lede">{profile.lede}</p>
          <div className="actions">
            <a className="btn-main" href={profile.cvUrl} download>
              <DownloadIcon />
              Baixar currículo (PDF)
            </a>
            <a className="iconlink" href={profile.github} target="_blank" rel="noreferrer">
              <GitHubIcon />
              GitHub
            </a>
            <a className="iconlink" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon />
              LinkedIn
            </a>
            <a className="iconlink" href="#contato">
              <MailIcon />
              E-mail
            </a>
          </div>
        </div>
        <dl className="statusbox">
          {profile.status.map(item => (
            <div key={item.key}>
              <dt>{item.key}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="current-proj">
          <span className="tag">projeto atual</span>
          <a href={profile.currentProject.href}>{profile.currentProject.label} →</a>
        </div>
      </div>
    </section>
  )
}

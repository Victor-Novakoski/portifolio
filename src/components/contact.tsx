import { useEffect, useRef, useState } from 'react'

import { SectionHead } from '@/components/section-head'
import { profile } from '@/data/profile'

export function Contact() {
  const sigilRef = useRef<SVGSVGElement>(null)
  const mailRef = useRef<HTMLAnchorElement>(null)
  const [copied, setCopied] = useState('')

  // O selo se desenha quando a seção aparece.
  useEffect(() => {
    const sigil = sigilRef.current!
    if (!('IntersectionObserver' in window)) {
      sigil.classList.add('on')
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        sigil.classList.add('on')
        observer.disconnect()
      },
      { threshold: 0.4 }
    )
    observer.observe(sigil)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(''), 3000)
    return () => window.clearTimeout(t)
  }, [copied])

  function selectMail() {
    try {
      const range = document.createRange()
      range.selectNodeContents(mailRef.current!)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } catch {
      // sem seleção, o e-mail continua visível
    }
    setCopied('Selecionado: use Ctrl+C')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied('Sinal enviado: e-mail copiado')
    } catch {
      selectMail()
    }
  }

  return (
    <section className="block wrap" id="contato" aria-labelledby="h-contato">
      <div className="inner">
        <SectionHead id="contato" />
        <div className="ally">
          <svg className="sigil" ref={sigilRef} viewBox="0 0 160 160" aria-hidden="true">
            <circle cx="80" cy="80" r="66" />
            <circle cx="80" cy="80" r="48" />
            <path d="M80 14 L137 113 L23 113 Z" />
            <path d="M80 146 L23 47 L137 47 Z" />
          </svg>
          <div className="card">
            <p style={{ margin: '0 0 6px' }}>Procurando alguém para encarar um problema difícil com você? Deixe um sinal.</p>
            <span className="tag">E-mail</span>
            <a className="mail" ref={mailRef} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="links">
              <button className="btn gold" type="button" onClick={copy}>
                Copiar e-mail
              </button>
              <a className="btn" href={profile.cvUrl} download>
                Baixar currículo (PDF)
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span className="copied" role="status">
                {copied}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { SectionHead } from '@/components/section-head'
import { preloadGame } from '@/lib/game-loader'
import { openGame } from '@/lib/runtime'

export function CacaBugsCall({ best }: { best: number }) {
  return (
    <section className="block wrap" id="cacabugs" aria-labelledby="h-cacabugs">
      <div className="inner">
        <SectionHead id="cacabugs" />
        <div className="mgcall card">
          <svg className="mgart" viewBox="0 0 240 140" aria-hidden="true">
            <defs>
              <radialGradient id="mgl">
                <stop offset="0" stopColor="#F0B44C" stopOpacity=".32" />
                <stop offset="1" stopColor="#F0B44C" stopOpacity="0" />
              </radialGradient>
              <g id="mgb">
                <path d="M-5-3l-5-3M-5 1h-6M-5 5l-5 3M5-3l5-3M5 1h6M5 5l5 3" stroke="#E4E0D8" strokeWidth="1.2" strokeLinecap="round" />
                <ellipse cy="1" rx="5" ry="7" fill="currentColor" />
                <circle cy="-7" r="3" fill="#E4E0D8" />
              </g>
            </defs>
            <rect width="240" height="140" fill="#0B0A0F" />
            <path d="M0 35H240M0 70H240M0 105H240M48 0V140M96 0V140M144 0V140M192 0V140" stroke="#3D3A36" strokeOpacity=".35" />
            <circle cx="168" cy="42" r="40" fill="url(#mgl)" />
            <circle cx="120" cy="78" r="20" fill="#1A1918" stroke="#F0B44C" strokeWidth="2" />
            <path d="M111 71h18M111 77h18M111 83h18" stroke="#9C978E" strokeWidth="3" />
            <ellipse cx="120" cy="59" rx="20" ry="3.4" fill="#24221F" stroke="#E4E0D8" strokeWidth=".8" />
            <path d="M111 59Q111 46 120 45Q129 46 129 59Z" fill="#2E2C29" stroke="#E4E0D8" strokeWidth=".8" />
            <path d="M108 106h6M117 106h6M126 106h6" stroke="#F0B44C" strokeWidth="3" />
            <use href="#mgb" color="#E0505C" transform="translate(42 34) rotate(118)" />
            <use href="#mgb" color="#E0505C" transform="translate(200 112) rotate(-60)" />
            <use href="#mgb" color="#A9D6E5" transform="translate(58 112) rotate(60)" />
            <use href="#mgb" color="#6B6760" transform="translate(166 46) rotate(-130) scale(1.3)" />
            <g stroke="#E4E0D8" strokeWidth="1.2" fill="none">
              <circle cx="168" cy="42" r="8" />
              <path d="M168 28v8M168 48v8M154 42h8M174 42h8" />
            </g>
            <g transform="translate(212 30)">
              <circle r="11" fill="none" stroke="#A9D6E5" strokeOpacity=".6" />
              <circle r="4" fill="#E0505C" />
              <g fill="#8E8A96">
                <circle cx="-4" cy="-3" r="3" />
                <circle cx="4" cy="-3" r="3" />
                <circle cy="4" r="3" />
              </g>
              <circle r="2.4" fill="#E0505C" />
            </g>
          </svg>
          <div>
            <p>
              Proteja a Produção por 3 ondas de 40 segundos. Golpeie os bugs, agarre um e arremesse contra os outros. Entre as ondas, gaste os bugs caçados numa árvore de habilidades com Go, React e PostgreSQL. As peças reais do Sobre
              aparecem como relíquias: a rosa de ferro protege, o amigurumi vira uma bola que quica e a bazuca faz o próximo golpe
              explodir.
            </p>
            <div className="row">
              <button className="btn gold" type="button" onClick={openGame} onPointerEnter={preloadGame} onFocus={preloadGame}>
                Jogar Caça-bugs
              </button>
              {best > 0 && <span className="best">Recorde neste navegador: {best} pontos</span>}
            </div>
            <small>Mouse, toque ou teclado. Esc sai a qualquer momento.</small>
          </div>
        </div>
      </div>
    </section>
  )
}

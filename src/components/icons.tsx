import type { ReactNode } from 'react'

import type { ProjectIcon } from '@/data/projects'

// O caçador das arenas: o mesmo de capuz e cajado da tela de título, num <symbol> reaproveitado por <use>.
export function HunterSymbol() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="hunter" viewBox="-110 -390 220 400">
          <g transform="translate(8 0) scale(.96)">
            <path d="M-84 0 L-90 -372 Q-94 -390 -106 -382" fill="none" stroke="#050506" strokeWidth="5" strokeLinecap="round" />
            <path d="M-106 -382 L-105 -366" stroke="#3D3A36" strokeWidth="1.6" />
            <g fill="#050506" stroke="#3D3A36" strokeWidth="2">
              <path d="M-14 -300 C-36 -296 -50 -282 -52 -258 C-56 -190 -62 -100 -70 -2 L-58 -26 L-46 -4 L-34 -34 L-20 -6 L-8 -28 L6 -2 L18 -30 L32 -4 L46 -24 L58 0 L66 -20 L74 -2 C64 -100 58 -190 52 -258 C50 -282 36 -296 14 -300 Z" />
              <path d="M-46 -264 C-62 -250 -74 -236 -82 -224 L-74 -210 C-64 -222 -52 -236 -38 -246 Z" />
              <circle cx="-84" cy="-218" r="8" />
              <path d="M-24 -292 C-34 -318 -26 -350 0 -356 C18 -358 30 -350 38 -338 C46 -326 56 -316 64 -300 C50 -306 40 -308 32 -306 C30 -300 26 -294 24 -290 Z" />
            </g>
            <ellipse cx="-4" cy="-318" rx="14" ry="19" fill="#000" />
            <circle cx="-9" cy="-318" r="2.4" fill="#F0B44C" />
            <circle cx="2" cy="-318" r="2.4" fill="#F0B44C" />
            <rect x="-112" y="-366" width="14" height="20" rx="2" fill="#F0B44C" />
          </g>
        </symbol>
      </defs>
    </svg>
  )
}

// Marca do cabeçalho: o caçador de capuz, olhos acesos, e o cajado com a lanterna (mesmo desenho do favicon).
export function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#2A2927" />
      <circle cx="9.3" cy="10.3" r="7" fill="#F0B44C" opacity=".22" />
      <path d="M7 28V8.5Q7 6 9 6" fill="none" stroke="#0B0B0C" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="7.6" y="8" width="3.4" height="4.6" rx=".6" fill="#F0B44C" />
      <path d="M12 28 L13.5 17 Q13 8 18.5 7 Q23 7 25 10.5 Q26.5 13 28 14 Q25.5 13.6 24 14 L25 28 Z" fill="#0B0B0C" stroke="#F0B44C" strokeWidth=".8" />
      <circle cx="17.5" cy="15.4" r="1" fill="#F0B44C" />
      <circle cx="19.9" cy="15.4" r="1" fill="#F0B44C" />
    </svg>
  )
}

export function BugIcon({ split = false }: { split?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <g stroke="#E4E0D8" strokeWidth="1.8" strokeLinecap="round">
        <path d={split ? 'M9 11 4 8M9 15H3M9 19l-5 3M19 11l5-3M19 15h6M19 19l5 3M12 6 10 3M16 6l2-3' : 'M9 11 4 8M9 15H3M9 19l-5 3M19 11l5-3M19 15h6M19 19l5 3'} />
      </g>
      <ellipse cx="14" cy="16" rx="6" ry="8" fill="#E0505C" />
      <circle cx="14" cy="7.5" r="3.4" fill="#E4E0D8" />
      {split && <path d="M14 9v15" stroke="#0B0B0C" strokeWidth="1.2" />}
    </svg>
  )
}

const itemPaths: Record<ProjectIcon, ReactNode> = {
  lantern: (
    <>
      <circle cx="24" cy="6" r="3" />
      <path d="M17 10h14l2 5H15z" />
      <rect x="16" y="15" width="16" height="20" rx="2" />
      <rect x="20" y="19" width="8" height="12" fill="#F0B44C" stroke="none" />
      <path d="M14 35h20v4H14z" />
    </>
  ),
  grimoire: (
    <>
      <rect x="10" y="7" width="28" height="34" rx="2" />
      <path d="M16 7v34" />
      <circle cx="27" cy="22" r="6" stroke="#A9D6E5" />
      <path d="M27 16v12M21 22h12" stroke="#A9D6E5" />
    </>
  ),
  camera: (
    <>
      <path d="M8 16h8l3-5h10l3 5h8v22H8z" />
      <circle cx="24" cy="26" r="7" />
      <circle cx="24" cy="26" r="3" fill="#E0505C" stroke="none" />
    </>
  ),
  gear: (
    <>
      <circle cx="24" cy="24" r="7" />
      <circle cx="24" cy="24" r="14" strokeWidth="5" strokeDasharray="5 4" />
    </>
  ),
  scroll: (
    <>
      <path d="M12 10h24v28H12z" />
      <path d="M9 10a3 3 0 0 1 6 0M33 38a3 3 0 0 0 6 0M17 18h14M17 24h14M17 30h9" />
    </>
  ),
}

export function ItemIcon({ icon }: { icon: ProjectIcon }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#E4E0D8" strokeWidth="2">
      {itemPaths[icon]}
    </svg>
  )
}

import type { ReactNode } from 'react'

import type { ProjectIcon } from '@/data/projects'

// O caçador das arenas: um <symbol> desenhado uma vez e reaproveitado por <use>.
export function HunterSymbol() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="hunter" viewBox="-110 -390 220 400">
          <path
            fill="#06050A"
            stroke="#4A4458"
            strokeWidth="2"
            d="M-18 0 L-14 -72 L-4 -72 L-6 0 Z M6 0 L4 -72 L14 -72 L20 0 Z M-12 -308 L-40 -290 Q-44 -240 -30 -200 L-50 -72 L-22 -90 L-8 -62 L8 -90 L24 -64 L48 -76 L30 -200 Q44 -240 40 -290 L12 -308 Z M-18 -300 L-24 -330 L-6 -316 Z M18 -300 L24 -330 L6 -316 Z M36 -288 Q52 -240 54 -190 L44 -188 Q40 -235 28 -270 Z M-36 -288 Q-54 -245 -56 -200 L-46 -198 Q-42 -240 -28 -270 Z M-20 -334 Q-22 -372 0 -376 Q22 -372 20 -334 Z"
          />
          <circle cx="0" cy="-322" r="13" fill="#06050A" />
          <ellipse cx="0" cy="-334" rx="48" ry="7" fill="#06050A" stroke="#4A4458" strokeWidth="2" transform="rotate(-4 0 -334)" />
          <path d="M50 -190 L96 -16" stroke="#A9D6E5" strokeWidth="4" strokeLinecap="round" opacity=".7" />
          <rect x="-60" y="-182" width="14" height="20" rx="2" fill="#E3C17A" opacity=".85" />
        </symbol>
      </defs>
    </svg>
  )
}

export function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#17151D" />
      <path d="M5 29L27 6" stroke="#A9C3CC" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 22L13 27" stroke="#C9A96A" strokeWidth="2.4" />
      <path d="M11 19 Q10.5 9 16 8.5 Q21.5 9 21 19 Z" fill="#EDE7DC" />
      <ellipse cx="16" cy="19.5" rx="13" ry="2.6" fill="#EDE7DC" />
      <rect x="11" y="16.5" width="10" height="1.6" fill="#D2384F" />
    </svg>
  )
}

export function BugIcon({ split = false }: { split?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <g stroke="#EDE7DC" strokeWidth="1.8" strokeLinecap="round">
        <path d={split ? 'M9 11 4 8M9 15H3M9 19l-5 3M19 11l5-3M19 15h6M19 19l5 3M12 6 10 3M16 6l2-3' : 'M9 11 4 8M9 15H3M9 19l-5 3M19 11l5-3M19 15h6M19 19l5 3'} />
      </g>
      <ellipse cx="14" cy="16" rx="6" ry="8" fill="#D2384F" />
      <circle cx="14" cy="7.5" r="3.4" fill="#EDE7DC" />
      {split && <path d="M14 9v15" stroke="#0E0D12" strokeWidth="1.2" />}
    </svg>
  )
}

const itemPaths: Record<ProjectIcon, ReactNode> = {
  lantern: (
    <>
      <circle cx="24" cy="6" r="3" />
      <path d="M17 10h14l2 5H15z" />
      <rect x="16" y="15" width="16" height="20" rx="2" />
      <rect x="20" y="19" width="8" height="12" fill="#E3C17A" stroke="none" />
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
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#EDE7DC" strokeWidth="2">
      {itemPaths[icon]}
    </svg>
  )
}

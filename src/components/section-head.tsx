import type { ReactNode } from 'react'

type SectionHeadProps = {
  numeral: string
  point: string
  title: string
  align?: 'left' | 'right'
  children?: ReactNode
}

// "Ponto x/6": cada seção é uma parada da rota, com o numeral romano vazado ao fundo.
export function SectionHead({ numeral, point, title, align = 'right', children }: SectionHeadProps) {
  return (
    <div className={align === 'left' ? 'head left' : 'head'}>
      <span className="numeral" aria-hidden="true">
        {numeral}
      </span>
      <span className="point">{point}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

export function Leg({ km }: { km: number }) {
  return (
    <div className="leg" aria-hidden="true">
      <i />
      km {km}
    </div>
  )
}

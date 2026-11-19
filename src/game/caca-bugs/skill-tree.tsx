import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import type { Shop } from '@/game/caca-bugs/engine'
import { BRANCHES, PERKS, perkById, WAVES, type Perk, type PerkId } from '@/game/caca-bugs/tree'

type Props = { shop: Shop; onBuy(id: PerkId): void; onNext(): void }
type State = 'owned' | 'ready' | 'poor' | 'locked'
type Pos = { x: number; y: number }

const BUB = 46 // diâmetro da bolha: alvo de toque acima de 44 px
const FLOAT = 4 // quanto a bolha flutua, em px

// Árvore em bolhas, no estilo do grafo do Obsidian: o Caçador no centro e 4 ramos saindo dele.
// Cada bolha é um <button>. Passar o mouse ou focar mostra o painel; clicar ou Enter aprende.
// No toque, o primeiro toque mostra e o segundo, na mesma bolha, aprende.
export function SkillTree({ shop, onBuy, onNext }: Props) {
  const owned = new Set(shop.perks)
  const wrapRef = useRef<HTMLDivElement>(null)
  const bubRefs = useRef(new Map<PerkId, HTMLButtonElement>())
  const linkRefs = useRef(new Map<PerkId, SVGLineElement>())
  const pointerType = useRef('mouse')
  // O que estava à mostra quando o dedo encostou: o foco do toque também marca a bolha, e sem isso o primeiro toque já compraria.
  const shownAtDown = useRef<PerkId | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [shown, setShown] = useState<PerkId | null>(null)

  useEffect(() => {
    const el = wrapRef.current!
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pos = useMemo(() => layout(size.w, size.h), [size.w, size.h])

  // As bolhas flutuam devagar e as linhas acompanham. Com movimento reduzido, ficam paradas.
  useEffect(() => {
    if (!size.w || prefersReducedMotion()) return
    let raf = 0
    const phase = (i: number) => i * 1.7
    const offset = (id: PerkId | 'root', t: number) => {
      if (id === 'root') return { x: 0, y: 0 }
      const i = PERKS.findIndex(p => p.id === id)
      return {
        x: Math.sin(t * 0.7 + phase(i)) * FLOAT,
        y: Math.cos(t * 0.55 + phase(i) * 1.3) * FLOAT,
      }
    }
    const frame = (now: number) => {
      const t = now / 1000
      for (const p of PERKS) {
        const o = offset(p.id, t)
        const b = bubRefs.current.get(p.id)
        if (b) b.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`
        const line = linkRefs.current.get(p.id)
        if (line) {
          const from = p.needs ?? 'root'
          const fo = offset(from, t)
          const a = from === 'root' ? pos.root : pos.nodes[from]
          line.setAttribute('x1', (a.x + fo.x).toFixed(2))
          line.setAttribute('y1', (a.y + fo.y).toFixed(2))
          line.setAttribute('x2', (pos.nodes[p.id].x + o.x).toFixed(2))
          line.setAttribute('y2', (pos.nodes[p.id].y + o.y).toFixed(2))
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [size.w, pos])

  function state(p: Perk): State {
    if (owned.has(p.id)) return 'owned'
    if (p.needs && !owned.has(p.needs)) return 'locked'
    return shop.frag >= p.cost ? 'ready' : 'poor'
  }
  const label: Record<State, (p: Perk) => string> = {
    owned: () => 'Aprendido',
    ready: p => `Aprender por ${p.cost}`,
    poor: p => `Faltam ${p.cost - shop.frag} fragmentos`,
    locked: p => `Pede ${perkById(p.needs!).name}`,
  }

  function click(p: Perk) {
    // No toque, o primeiro toque só mostra a descrição.
    if (pointerType.current === 'touch' && shownAtDown.current !== p.id) {
      setShown(p.id)
      return
    }
    setShown(p.id)
    if (state(p) === 'ready') onBuy(p.id)
  }

  const info = shown ? perkById(shown) : null
  const infoState = info ? state(info) : null
  const touch = pointerType.current === 'touch'

  return (
    <>
      <h2>Árvore de habilidades</h2>
      <p>
        Fim da onda {shop.wave} de {WAVES}. Você tem <strong className="mg-frag-n">{shop.frag} fragmentos</strong>. Cada bug caçado vale 1.
      </p>
      <div className="mg-graph" ref={wrapRef}>
        {/* As bolhas existem desde o primeiro render, para o foco inicial cair na primeira delas. */}
        <svg className="mg-links" width={size.w} height={size.h} aria-hidden="true">
          {PERKS.map(p => {
            const a = p.needs ? pos.nodes[p.needs] : pos.root
            const b = pos.nodes[p.id]
            const st = state(p)
            return (
              <line
                key={p.id}
                ref={el => {
                  if (el) linkRefs.current.set(p.id, el)
                  else linkRefs.current.delete(p.id)
                }}
                className={`mg-link ${st}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            )
          })}
        </svg>
        <div className="mg-root" style={{ left: pos.root.x, top: pos.root.y }} aria-hidden="true">
          Caçador
        </div>
        {BRANCHES.map(branch => (
          <span key={branch} className="mg-branch-tag" style={tagStyle(pos, branch)} aria-hidden="true">
            {branch}
          </span>
        ))}
        {PERKS.map(p => {
          const st = state(p)
          const at = pos.nodes[p.id]
          return (
            <button
              key={p.id}
              ref={el => {
                if (el) bubRefs.current.set(p.id, el)
                else bubRefs.current.delete(p.id)
              }}
              type="button"
              className={`mg-bub ${st}${shown === p.id ? ' shown' : ''}`}
              style={{ left: at.x - BUB / 2, top: at.y - BUB / 2 }}
              aria-label={`${p.name}, ramo ${p.branch}. ${label[st](p)}.`}
              aria-describedby="mg-info"
              aria-disabled={st !== 'ready'}
              onPointerDown={(e: RPointerEvent) => {
                pointerType.current = e.pointerType
                shownAtDown.current = shown
              }}
              onPointerEnter={(e: RPointerEvent) => e.pointerType === 'mouse' && setShown(p.id)}
              onFocus={() => setShown(p.id)}
              onClick={() => click(p)}
            >
              <span className="in">{st === 'owned' ? '✓' : p.cost}</span>
              <span className="nm">{p.name}</span>
            </button>
          )
        })}
      </div>
      <div className="mg-foot">
        <div className="mg-info" id="mg-info">
          {info && infoState ? (
            <>
              <p className="hd">
                <b>{info.name}</b> <span>{info.branch}</span> <span className={`tag ${infoState}`}>{label[infoState](info)}</span>
              </p>
              <p>{info.effect}</p>
              <p className="concept">
                {info.concept}
                {infoState === 'ready' && (touch ? ' Toque de novo para aprender.' : ' Clique ou Enter para aprender.')}
              </p>
            </>
          ) : (
            <p className="concept">
              Passe o mouse ou o foco numa bolha para ver o que ela faz. Clique ou Enter aprende; no toque, toque duas vezes.
            </p>
          )}
        </div>
        <div className="row">
          <button className="btn gold" type="button" onClick={onNext}>
            Começar a onda {shop.wave + 1}
          </button>
        </div>
      </div>
    </>
  )
}

type Layout = {
  root: Pos
  nodes: Record<PerkId, Pos>
  angles: Record<string, number>
}

// Os 4 ramos saem do centro em diagonal; o ângulo segue o formato da área (mais deitado no desktop,
// mais em pé no celular) e o comprimento cabe na área com folga para o nome embaixo da bolha.
function layout(w: number, h: number): Layout {
  const root = { x: w / 2, y: h / 2 }
  const th = Math.max(0.42, Math.min(1.15, Math.atan2(h, w)))
  const L = Math.max(60, Math.min((w / 2 - 46) / Math.cos(th), (h / 2 - 44) / Math.sin(th)))
  const angles: Record<string, number> = {
    Go: Math.PI + th,
    React: -th,
    PostgreSQL: th,
    Infra: Math.PI - th,
  }
  const nodes = {} as Record<PerkId, Pos>
  for (const branch of BRANCHES) {
    const a = angles[branch]
    PERKS.filter(p => p.branch === branch).forEach((p, i) => {
      const r = L * [0.42, 0.72, 1][i]
      // Uma leve curva no nó do meio deixa o grafo menos geométrico.
      const bend = i === 1 ? 0.08 : 0
      nodes[p.id] = {
        x: root.x + Math.cos(a + bend) * r,
        y: root.y + Math.sin(a + bend) * r,
      }
    })
  }
  return { root, nodes, angles }
}

function tagStyle(pos: Layout, branch: string) {
  const left = Math.cos(pos.angles[branch]) < 0
  const last = PERKS.filter(p => p.branch === branch).pop()!
  const n = pos.nodes[last.id]
  // O nome do ramo fica do lado de fora da última bolha, onde sobra espaço.
  return { left: n.x + (left ? -34 : 34), top: n.y, transform: `translate(${left ? '-100%' : '0'}, -50%)` }
}

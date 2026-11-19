import type { Shop } from '@/game/caca-bugs/engine'
import { BRANCHES, PERKS, WAVES, type Perk, type PerkId } from '@/game/caca-bugs/tree'

type Props = { shop: Shop; onBuy(id: PerkId): void; onNext(): void }

// Cartão da árvore entre as ondas. Os nós ficam focáveis mesmo quando não dá para comprar
// (aria-disabled), para quem usa leitor de tela ouvir o porquê.
export function SkillTree({ shop, onBuy, onNext }: Props) {
  const owned = new Set(shop.perks)

  function status(p: Perk) {
    if (owned.has(p.id)) return { ok: false, label: 'Aprendido' }
    if (p.needs && !owned.has(p.needs)) return { ok: false, label: `Pede ${PERKS.find(x => x.id === p.needs)!.name}` }
    if (shop.frag < p.cost) return { ok: false, label: `Faltam ${p.cost - shop.frag}` }
    return { ok: true, label: `Aprender por ${p.cost}` }
  }

  return (
    <>
      <h2>Árvore de habilidades</h2>
      <p>
        Fim da onda {shop.wave} de {WAVES}. Você tem <strong className="frag-n">{shop.frag} fragmentos</strong>. Cada bug caçado vale 1.
      </p>
      <div className="mg-tree">
        {BRANCHES.map(branch => (
          <section key={branch} className="mg-branch" aria-label={`Ramo ${branch}`}>
            <h3>{branch}</h3>
            {PERKS.filter(p => p.branch === branch).map(p => {
              const st = status(p)
              const isOwned = owned.has(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`mg-node${isOwned ? ' owned' : ''}${st.ok ? ' ready' : ''}`}
                  aria-disabled={!st.ok}
                  onClick={() => st.ok && onBuy(p.id)}
                >
                  <span className="nm">
                    {p.name} <span className="cost">{p.cost}</span>
                  </span>
                  <span className="ef">{p.effect}</span>
                  <span className="st">{st.label}</span>
                </button>
              )
            })}
          </section>
        ))}
      </div>
      <div className="row">
        <button className="btn gold" type="button" onClick={onNext}>
          Começar a onda {shop.wave + 1}
        </button>
      </div>
    </>
  )
}

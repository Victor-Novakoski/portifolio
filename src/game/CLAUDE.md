# src/game

As lutas contra os chefes (`fight.ts`) e o mini game Caça-bugs (`caca-bugs/`). Portados do protótipo HTML "Forja do Caçador" para TypeScript imperativo.

## Regras

- **Módulo imperativo, React por fora.** Cada sistema é `create/mount(...)` → objeto com `destroy()`. Física, posições e timers ficam em variáveis do módulo ou em refs, nunca em state do React. O React só guarda o que muda pouco: véus, fragmentos revelados, cartões do jogo.
- **`destroy()` desfaz tudo:** `requestAnimationFrame`, timers (guarde os ids num `Set`), listeners e nós criados no DOM. O componente chama `destroy()` no cleanup do efeito.
- **Teclado por dono:** cada sistema registra o próprio `keydown` e só age se `runtime.get().active` for ele. Ao começar, `runtime.claim('fight' | 'game')`; ao pausar ou sair, `runtime.release(...)`. Não crie um despachante central (decisão 006).
- **Uma luta ativa por vez** (`activeFight()`). Abrir o mini game chama `pauseAllFights()`.
- **Pausa:** respeitar `runtime.get().paused` e `document.hidden`. As lutas pausam sozinhas quando a aba some ou o Pausar do cabeçalho é apertado.
- **Movimento reduzido:** a luta abre com os três fragmentos já revelados e sem destroços (`lib/debris.ts` não roda); o Caça-bugs joga sem tremor de tela.
- **Caça-bugs fica num chunk separado.** Nada fora de `caca-bugs/` pode importar dele de forma estática; use `lib/game-loader.ts` (`loadGame`/`preloadGame`). O CSS dele mora dentro do chunk (`caca-bugs.css`).
- **`<dialog>` com `showModal()`** dá o foco preso e o Esc. Não escreva focus trap à mão. Ao fechar, o foco volta para quem abriu (`CacaBugsHost`).
- O recorde vai em `localStorage` pela chave `forja.recorde`, sempre com `safeGet`/`safeSet`.
- **Ondas e árvore (decisão 015):** 2 ondas de 40 s e a última sem fim (`WAVES`, `WAVE_MS` em `caca-bugs/tree.ts`). Na onda sem fim, a dificuldade sobe com `endlessS(g)` (nascimento, chance de par, velocidade e tipos) até a Produção cair; a partida só acaba por `end()` com vida 0. Cada bug caçado vale 1 fragmento. No fim de uma onda o motor limpa a arena, para (`g.shop`) e chama `on.shop`; o React mostra `skill-tree.tsx` (grafo em bolhas: hover ou foco mostra o painel, clique ou Enter compra, no toque são dois toques) e chama `engine.buy(id)` e `engine.nextWave()`. Com a árvore aberta, P e R não fazem nada. Os nós e custos moram em `tree.ts`; o efeito de cada um está no motor (procure `g.perks.has`). A árvore nunca vai para o storage. Os custos (`C1`, `C2`, `C3`) foram medidos com um bot forte em Chrome headless (ver a decisão 015); ao mexer nos efeitos ou no nascimento dos bugs, meça de novo.

## Armadilhas conhecidas

- O CSS global (`forja.css`) já usa classes curtas como `.fx` e `.frag`. No jogo, prefira o prefixo `mg-` para não herdar `position:absolute` ou borda sem querer.
- A árvore guarda o estado da loja fora do `card` do React: o efeito que foca o primeiro botão roda a cada troca de `card`, e comprar um nó não pode roubar o foco.
- O grafo da árvore flutua com um `requestAnimationFrame` próprio, que escreve `transform` e as pontas das linhas direto no DOM, sem state. Com movimento reduzido ele nem começa.
- No painel do navegador do app escondido, o `requestAnimationFrame` quase não roda e o jogo parece travado. Para testar uma partida inteira, use um Chrome headless.
- O StrictMode monta, desmonta e monta de novo no dev. Se um listener ficar sem cleanup, o golpe conta em dobro só no `yarn dev`.
- Luta e mini game na mesma página disputam as mesmas teclas: confira o dono ativo antes de `preventDefault`.
- `restart(el, cls)` força reflow (`void el.offsetWidth`) para reiniciar uma animação CSS. É de propósito.

## Ver também

- docs/decisoes/005-jogo-em-modulos-imperativos.md
- docs/decisoes/006-teclado-sem-despachante-central.md
- docs/decisoes/007-mini-game-em-chunk-separado.md

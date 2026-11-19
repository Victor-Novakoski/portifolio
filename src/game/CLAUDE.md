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

## Armadilhas conhecidas

- O StrictMode monta, desmonta e monta de novo no dev. Se um listener ficar sem cleanup, o golpe conta em dobro só no `yarn dev`.
- Luta e mini game na mesma página disputam as mesmas teclas: confira o dono ativo antes de `preventDefault`.
- `restart(el, cls)` força reflow (`void el.offsetWidth`) para reiniciar uma animação CSS. É de propósito.

## Ver também

- docs/decisoes/005-jogo-em-modulos-imperativos.md
- docs/decisoes/006-teclado-sem-despachante-central.md
- docs/decisoes/007-mini-game-em-chunk-separado.md

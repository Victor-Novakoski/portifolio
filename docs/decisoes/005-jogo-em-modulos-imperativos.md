# 005. Jogo em módulos TypeScript imperativos, React por fora

- **Data:** 24/10/2026
- **Status:** ativa

## Contexto

O protótipo aprovado da Forja (004) é um HTML com canvas, física, lutas e mini game em JavaScript direto. Reescrever tudo em estado React custaria caro e faria o React renderizar a 60 fps.

## Decisão

A lógica de canvas, física, lutas e mini game é portada quase literalmente para módulos TypeScript no formato `mount(el) → { destroy() }`. O React cuida da estrutura, do texto e dos estados que mudam pouco (véus da luta, fragmentos revelados, faixa de retorno). Física fica em variáveis do módulo ou refs, nunca em state. Véus em JSX, sem `innerHTML`; efeitos (dano, impacto, destroços) numa camada que o React não renderiza.

## Consequência

- Todo módulo precisa desfazer listeners, observers, timers e `requestAnimationFrame` no `destroy()`, por causa do StrictMode.
- Mudanças de jogo se fazem nos módulos de `src/game/` e `src/scene/`, não nos componentes.

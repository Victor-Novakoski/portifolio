# 006. Teclado sem despachante central

- **Data:** 24/10/2026
- **Status:** ativa

## Contexto

Três sistemas usam o teclado na mesma página: a tela de título, as lutas e o mini game. A equipe de código (dev e arquiteto) queria um roteador central de teclas.

## Decisão

Sem roteador. Cada sistema registra o próprio `keydown` e consulta um `runtime` pequeno (`src/lib/runtime.ts`) que guarda a pausa global e quem está ativo (`fight`, `game` ou ninguém). Com só três donos e a regra "quem está ativo" num lugar só, o despachante seria mais código para o mesmo efeito. Foi a decisão contra a maioria da rodada; confiança média.

## Consequência

- Um sistema novo que use teclado precisa fazer `claim`/`release` no runtime e checar o dono antes de agir.
- Se surgirem mais donos, vale rever esta decisão.

# 007. Mini game em chunk separado, aberto num `<dialog>`

- **Data:** 24/10/2026
- **Status:** ativa

## Contexto

O Caça-bugs é o módulo mais pesado do site, e a maioria dos visitantes (recrutadores no celular) não vai jogar.

## Decisão

O jogo entra com `React.lazy` e só baixa quando alguém pede para jogar; o hover ou o foco no botão pré-carrega. Abre num `<dialog>` com `showModal()`, que dá o foco preso e o Esc nativos. O CSS dele vai dentro do chunk.

## Consequência

- Nenhum código fora de `src/game/caca-bugs/` importa o jogo de forma estática; tudo passa por `lib/game-loader.ts`.
- Lutas e cabeçalho abrem o jogo por um evento de `window`, sem depender do chunk.

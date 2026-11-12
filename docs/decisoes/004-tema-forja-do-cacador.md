# 004. Tema "Forja do Caçador", na versão enxuta

- **Data:** 24/10/2026
- **Status:** ativa (substitui a 003)

## Contexto

Quatro protótipos de personalidade (Modo Difícil/Caçador de Bugs, Página de Mangá, Molde de Oficina e Credencial) passaram por seis rodadas. O critério do Victor foi diversão e surpresa: interação de verdade pesou mais que ornamento. O Caçador de Bugs venceu, e a fusão com o que agradou nos outros virou a "Forja do Caçador". Na rodada 6 o Victor pediu para tirar as conquistas, a oficina e a prateleira, e deixar só a luta e o mini game visível.

## Decisão

- Tela de título em canvas com o caçador, o chapéu arremessável (peça real do cosplay) e a lanterna.
- Três desafios técnicos como lutas curtas contra chefes, com golpe carregado e impact frame. Cada acerto revela o risco, a solução e o resultado. "Ler sem lutar" abre tudo.
- Mini game Caça-bugs visível (cabeçalho e seção própria antes do Contato).
- CSS puro e canvas 2D, sem framework de UI, motor de jogo ou biblioteca de animação.
- O tema Brasa e a metáfora de rastreio são apagados do código, não escondidos.

## Consequência

- Cinco sistemas viraram dois (lutar e jogar): menos código e menos coisa escondida.
- A lógica dos protótipos foi portada para módulos TypeScript (005) e o mini game vai num chunk próprio (007).

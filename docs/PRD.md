# PRD: Portfólio "Forja do Caçador"

## Problema

O portfólio anterior (um mapa soulslike, "The Lost Developer") escondia o nome e os projetos atrás de exploração: quem abria o link por dez segundos saía sem saber de quem era o site. A versão seguinte ("Brasa") ficou legível, mas genérica: "bonito, mas simples".

## Para quem

- **Recrutadora no celular:** abre o link entre outras tarefas. Precisa ver nome, cargo, stack e currículo na primeira tela e lembrar de pelo menos um projeto.
- **Tech lead no desktop:** quer conferir como o Victor pensa. Os desafios técnicos e o código aberto são o que ele lê.

## Objetivo

Mostrar um desenvolvedor full stack (Go + React) com personalidade (persistente, nerd, artesão) sem atrapalhar quem só quer ler. O critério do Victor para o tema é diversão e surpresa: interação de verdade (arremessar, lutar, jogar) vale mais que ornamento.

## O que o site tem

1. Tela de título em canvas com o caçador de capuz e cajado e a lanterna, mais um menu de seções em grade.
2. Projetos em cards de "descrição de item": Rastreia, Panda Cooking (com a demo da busca por trigramas), Revelação e dois estudos.
3. Desafios técnicos como lutas curtas contra chefes. Cada acerto revela uma parte da ficha: o golpe (o risco), a fraqueza (a solução) e a recompensa (o resultado). "Ler sem lutar" abre tudo.
4. Experiência, Habilidades e um Sobre com o que o Victor faz fora do código.
5. Mini game Caça-bugs, aberto pelo cabeçalho ou pela seção dele: 3 ondas curtas, com uma árvore de habilidades da stack (Go, React, PostgreSQL e infra) entre as ondas (decisão 015).
6. Contato e currículo em PDF.
7. Para quem volta: uma faixa curta "Continuar em <seção>".

## Fora do escopo

- Backend, formulário de contato com servidor, analytics de visitante.
- Conquistas, oficina de montagem e prateleira de itens (cortados na rodada 6 do design para manter só lutar e jogar). A árvore do Caça-bugs não reabre esse corte: vive só dentro do jogo e não é salva.
- Qualquer dado da visita anterior além da última seção (sem horário, tempo ou contagem).
- Telefone no site.

## Sucesso

- Em 10 segundos, no celular, a pessoa sabe quem é, o que faz e onde baixar o currículo.
- Um projeto e um desafio técnico ficam na memória e puxam conversa na entrevista.
- Funciona inteiro pelo teclado, com movimento reduzido e sem armazenamento local.

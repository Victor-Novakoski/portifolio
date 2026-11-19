# 015. Caça-bugs com árvore de habilidades, numa partida curta e sem save

- **Data:** 19/11/2026
- **Status:** ativa (escopo aprovado pelo Victor em 19/11/2026)

## Contexto

O Victor quer o Caça-bugs mais divertido, no estilo incremental, com árvore de habilidades. Hoje é uma partida de 75 s: proteger a Produção, golpear, arremessar e pegar as relíquias do Sobre. O público principal é recrutador, que passa poucos minutos no site e quase nunca abre o jogo. Um incremental completo (horas de progresso, save entre visitas) não cabe aqui: brigaria com a decisão 008 e com o tempo de quem visita. Se o Victor quiser um, ele vira projeto à parte, como o Revelação (decisão 012).

## Decisão

**Uma partida em 3 ondas de 40 s, com a árvore entre as ondas.** Cada bug caçado vale 1 fragmento. No fim das ondas 1 e 2 o jogo pausa e abre a árvore num cartão do próprio `<dialog>`: o jogador gasta os fragmentos, ou pula. Dá para comprar 3 ou 4 dos 6 nós, então cada partida tem uma "build" diferente. Comprar no meio da ação ficou de fora: no celular o dedo está ocupado golpeando.

**A árvore tem 6 nós em 3 ramos, com a stack real do Victor.** O segundo nó de cada ramo pede o primeiro. Os efeitos usam mecânicas que o jogo já tem (golpe, luz da lanterna, vida da Produção, bugs pálidos), sem inimigo novo.

| Ramo | Nó | Efeito no jogo | Por que lembra o conceito |
| --- | --- | --- | --- |
| Go | **Goroutine** (8) | Um caçador automático golpeia, a cada 2 s, o bug mais perto da Produção. | Trabalho concorrente rodando sozinho. |
| Go | **Worker pool** (14, pede Goroutine) | Passam a ser 3 caçadores automáticos. | Várias goroutines dividindo a fila. |
| React | **Batching** (8) | O golpe acerta uma área 50% maior. | O React junta várias atualizações num render só. |
| React | **TypeScript** (14, pede Batching) | Bugs pálidos morrem num golpe, sem pedir confirmação. | O erro é pego antes de rodar. |
| PostgreSQL | **Índice** (8) | A luz da lanterna cobre 50% mais área e deixa os bugs mais lentos. | A busca deixa de varrer tudo. |
| PostgreSQL | **Transação** (14, pede Índice) | Uma vez por partida, o golpe que derrubaria a Produção é desfeito e ela volta com 2 de vida. | Rollback. |

Os custos (entre parênteses, em fragmentos) são o ponto de partida; o balanço final sai jogando.

**Tela final** com a build (os nós comprados), pontos, bugs caçados e "chegou à onda X". O recorde continua como hoje.

### Fica de fora da v1

- Save da árvore ou de qualquer progresso entre visitas.
- Prestígio, moedas extras, nós com vários níveis e qualquer coisa "idle" que roda com o jogo fechado.
- Nós além dos 6. Candidatos para depois, se a v1 agradar: **Redis** (o combo dura mais, como cache), **Docker** (a Produção começa com +2 de vida), **RabbitMQ** (bug que escapa volta para a fila uma vez).
- Árvore fora do jogo (numa seção do site ou ligada a `src/data/skills.ts`).
- Mexer nas relíquias do Sobre: continuam iguais, como poderes da partida.

## Relação com as outras decisões

- **PRD, "Fora do escopo":** conquistas, oficina e prateleira de itens foram cortadas do *site* para manter só lutar e jogar. A árvore não reabre esse corte: vive só dentro do diálogo do jogo e some quando ele fecha. Não substitui o PRD; ao implementar, o item 5 de "O que o site tem" ganha a frase "com uma árvore de habilidades entre as ondas".
- **008 (só a seção fica guardada):** respeitada. Nada novo em `localStorage`. O recorde (`forja.recorde`) já existia e continua sendo o único dado do jogo.
- **007 (chunk separado):** respeitada. A árvore, os nós e o CSS dela moram em `src/game/caca-bugs/`; nada fora do chunk importa deles.
- **009 (sigilo da Galileu):** os nós citam só tecnologia pública, nada do trabalho.
- **DESIGN:** o jogo continua opcional e fechando com Esc. O cartão da árvore usa o visual HUD da Lanterna (células de 1 px, âmbar só no nó escolhido).

## Critério de pronto

- Partida inteira em até 2,5 min, com 2 paradas na árvore; dá para pular a árvore.
- Cada um dos 6 nós tem efeito que se vê na arena, e a frase dele aparece na árvore e na tela final.
- Árvore usável só no teclado (Tab, Enter), com alvos de 44 px, foco visível e compra anunciada por `aria-live`; cabe a 390 px sem rolagem horizontal.
- Esc, P, o Pausar do cabeçalho e a aba escondida funcionam também com a árvore aberta.
- Com movimento reduzido, a partida e a árvore funcionam sem tremor nem animação nova.
- Nenhuma chave nova no storage; o jogo continua num chunk separado (conferir na saída do `yarn build`).
- `yarn lint` e `yarn build` passam; teste à mão no desktop e a 390 px. O `src/game/CLAUDE.md` e o PRD atualizados.

## Tamanho

Médio: um PR, cerca de um dia. Ondas e os 6 efeitos no `engine.ts` (~150 a 200 linhas a mais), um componente novo da árvore (~120 linhas), ~40 linhas de CSS e os textos do cartão de abertura e da tela final.

## Consequência

Se a partida passar de ~3 min ou a árvore precisar de save para ter graça, é sinal de que a ideia virou um incremental completo: aí vale um projeto à parte, não crescer o Caça-bugs.

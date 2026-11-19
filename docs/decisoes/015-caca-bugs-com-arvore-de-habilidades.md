# 015. Caça-bugs com árvore de habilidades, numa partida curta e sem save

- **Data:** 19/11/2026
- **Status:** ativa (escopo aprovado pelo Victor em 19/11/2026; ampliado no mesmo dia para 12 nós e visual em bolhas)

## Contexto

O Victor quer o Caça-bugs mais divertido, no estilo incremental, com árvore de habilidades. Hoje é uma partida de 75 s: proteger a Produção, golpear, arremessar e pegar as relíquias do Sobre. O público principal é recrutador, que passa poucos minutos no site e quase nunca abre o jogo. Um incremental completo (horas de progresso, save entre visitas) não cabe aqui: brigaria com a decisão 008 e com o tempo de quem visita. Se o Victor quiser um, ele vira projeto à parte, como o Revelação (decisão 012).

## Decisão

**Uma partida em 3 ondas de 40 s, com a árvore entre as ondas.** Cada bug caçado vale 1 fragmento. No fim das ondas 1 e 2, o jogo pausa e abre a árvore num cartão do próprio `<dialog>`: o jogador gasta os fragmentos ou pula. Comprar no meio da ação ficou de fora, porque no celular o dedo está ocupado golpeando.

**A árvore tem 12 nós em 4 ramos de 3, com a stack real do Victor.** Cada nó pede o anterior do mesmo ramo. Os efeitos usam mecânicas que o jogo já tem (golpe, luz da lanterna, vida da Produção, bugs pálidos, combo), sem inimigo novo. Os custos sobem por nível: 5, 9 e 14 fragmentos. Com os ~40 a 55 fragmentos das duas paradas, dá umas 5 ou 6 compras; ninguém compra tudo (custaria 112), então cada partida tem uma build diferente.

| Ramo | Nó (custo) | Efeito no jogo | Por que lembra o conceito |
| --- | --- | --- | --- |
| Go | **Goroutine** (5) | Um caçador automático golpeia, a cada 2 s, o bug mais perto da Produção. | Trabalho concorrente rodando sozinho. |
| Go | **Worker pool** (9) | Passam a ser 3 caçadores automáticos. | Várias goroutines dividindo a fila. |
| Go | **Channels** (14) | O golpe do caçador automático passa adiante para o bug mais perto: 1 acerto em cadeia. | Uma goroutine entrega o trabalho para a próxima. |
| React | **Batching** (5) | O golpe acerta uma área 50% maior. | Várias atualizações num render só. |
| React | **TypeScript** (9) | Bugs pálidos morrem num golpe, sem pedir confirmação. | O erro é pego antes de rodar. |
| React | **Suspense** (14) | Mostra, 1 s antes, de que ponto da borda vem o próximo bug. | Um aviso enquanto o resto ainda carrega. |
| PostgreSQL | **Índice** (5) | A luz da lanterna cobre 50% mais área e deixa os bugs mais lentos. | A busca deixa de varrer tudo. |
| PostgreSQL | **Transação** (9) | Uma vez por partida, desfaz o golpe que derrubaria a Produção: ela volta com 2 de vida. | Rollback. |
| PostgreSQL | **Vacuum** (14) | A cada 8 s, limpa os bugs pálidos da tela. | O autovacuum recolhe o que ficou para trás. |
| Infra | **Docker** (5) | No começo de cada onda, a Produção recupera 2 de vida (até 6). | Subir o contêiner de novo, limpo. |
| Infra | **Redis** (9) | O combo dura o dobro do tempo. | Cache: o que é quente fica à mão. |
| Infra | **RabbitMQ** (14) | O bug que chega na Produção volta para a borda, no máximo 1 a cada 8 s. | A mensagem volta para a fila em vez de se perder. |

Três efeitos mudaram em relação ao pedido, para ficarem simples e úteis:

- **Vacuum:** o pedido era limpar os bugs pálidos no começo de cada onda, mas a arena já começa limpa. Virou uma limpeza a cada 8 s, como o autovacuum.
- **Docker:** o pedido era "+2 de vida". Ficou "recupera 2 de vida, até 6", para a barra de vida continuar com 6 marcas.
- **RabbitMQ:** "1 vez por bug" deixaria a Produção quase imortal. Virou "1 a cada 8 s".

**Visual em bolhas, como o grafo do Obsidian.** O Caçador fica no centro, e os 4 ramos saem dele em diagonal. Cada nó é um círculo que flutua devagar (seno e cosseno, 4 px), e a linha até o pai acompanha. Os estados são:

- **Comprado:** bolha preenchida em âmbar, e a linha acende.
- **Dá para comprar:** contorno âmbar com brilho.
- **Sem fragmentos:** contorno âmbar apagado, com o custo.
- **Bloqueado:** contorno tracejado cinza.

Sem biblioteca. Com movimento reduzido, as bolhas ficam paradas.

**Descrição antes de comprar.** Passar o mouse ou o foco numa bolha mostra, no painel abaixo do grafo, o nome, o ramo, o custo, o efeito, o conceito e o que o nó pede. Clicar ou apertar Enter compra. No toque, o primeiro toque mostra e o segundo, na mesma bolha, compra. Cada bolha é um `<button>` de 46 px com foco visível, e a compra é anunciada por `aria-live`. No celular, o grafo fica mais alto e em pé, e o painel e o botão da próxima onda ficam presos embaixo.

**Tela final** com a build (os nós comprados, com a frase de cada um), pontos, bugs caçados, tempo e a onda alcançada. O recorde continua como hoje.

### Fica de fora

- Save da árvore ou de qualquer progresso entre visitas.
- Prestígio, moedas extras, nós com vários níveis e qualquer coisa "idle" que roda com o jogo fechado.
- Árvore fora do jogo (numa seção do site ou ligada a `src/data/skills.ts`).
- Mexer nas relíquias do Sobre: continuam iguais, como poderes da partida.

## Relação com as outras decisões

- **PRD, "Fora do escopo":** conquistas, oficina e prateleira de itens foram cortadas do *site* para manter só lutar e jogar. A árvore não reabre esse corte: vive só dentro do diálogo do jogo e some quando ele fecha. Não substitui o PRD; o item 5 de "O que o site tem" cita a árvore.
- **008 (só a seção fica guardada):** respeitada. Nada novo em `localStorage`. O recorde (`forja.recorde`) já existia e continua sendo o único dado do jogo.
- **007 (chunk separado):** respeitada. A árvore, os nós e o CSS dela moram em `src/game/caca-bugs/`; nada fora do chunk importa deles.
- **009 (sigilo da Galileu):** os nós citam só tecnologia pública, nada do trabalho.
- **DESIGN:** o jogo continua opcional e fechando com Esc. A árvore usa as cores do HUD da Lanterna: âmbar só no que já foi aprendido ou dá para aprender.

## Critério de pronto

- Partida inteira em até 2,5 min, com 2 paradas na árvore; dá para pular a árvore.
- Cada um dos 12 nós tem efeito que se vê na arena, e a frase dele aparece no painel da árvore e na tela final.
- Uma partida normal dá umas 5 ou 6 compras, e ninguém compra os 12.
- Mouse: passar por cima mostra a descrição, e clicar compra. Teclado: Tab mostra, e Enter compra. Toque: o primeiro toque mostra, e o segundo compra.
- Bolhas com 46 px, foco visível e compra anunciada por `aria-live`; o grafo cabe a 390 px sem rolagem horizontal e sem nome cortado.
- Esc e a aba escondida funcionam com a árvore aberta; P e R não fazem nada nela. O Pausar do cabeçalho fica atrás do diálogo modal.
- Com movimento reduzido, a partida joga sem tremor e as bolhas ficam paradas.
- Nenhuma chave nova no storage; o jogo continua num chunk separado (conferir na saída do `yarn build`).
- `yarn lint` e `yarn build` passam; teste à mão no desktop e a 390 px. O `src/game/CLAUDE.md` e o PRD atualizados.

## Tamanho

Médio para grande: um PR, cerca de dois dias. São ondas e os 12 efeitos no `engine.ts` (~230 linhas a mais), o grafo em bolhas com o painel (~250 linhas), ~60 linhas de CSS e os textos do cartão de abertura e da tela final.

## Consequência

Se a partida passar de ~3 min ou a árvore precisar de save para ter graça, é sinal de que a ideia virou um incremental completo: aí vale um projeto à parte, não crescer o Caça-bugs.

# 015. Caça-bugs com árvore de habilidades, numa partida curta e sem save

- **Data:** 19/11/2026
- **Status:** ativa (escopo aprovado pelo Victor em 19/11/2026; ampliado no mesmo dia para 12 nós, visual em bolhas e onda 3 sem fim)

## Contexto

O Victor quer o Caça-bugs mais divertido, no estilo incremental, com árvore de habilidades. Hoje é uma partida de 75 s: proteger a Produção, golpear, arremessar e pegar as relíquias do Sobre. O público principal é recrutador, que passa poucos minutos no site e quase nunca abre o jogo. Um incremental completo (horas de progresso, save entre visitas) não cabe aqui: brigaria com a decisão 008 e com o tempo de quem visita. Se o Victor quiser um, ele vira projeto à parte, como o Revelação (decisão 012).

## Decisão

**Uma partida em 3 ondas, com a árvore entre as ondas.** As ondas 1 e 2 duram 40 s. Cada bug caçado vale 1 fragmento, inclusive os que os caçadores automáticos derrubam. No fim das ondas 1 e 2, o jogo pausa e abre a árvore num cartão do próprio `<dialog>`: o jogador gasta os fragmentos ou pula. Comprar no meio da ação ficou de fora, porque no celular o dedo está ocupado golpeando.

**A onda 3 não tem fim.** Ela serve para aproveitar a build: continua até a Produção cair. Como todo mundo chega com a mesma build, a dificuldade foi calibrada contra a árvore completa. Ela sobe com os segundos dentro da onda:
- os bugs nascem cada vez mais rápido, de 660 ms até 170 ms entre um e outro;
- a chance de nascerem dois de uma vez sobe;
- os bugs ficam mais rápidos;
- os bugs pálidos e duplicados ficam mais comuns.

O HUD troca o tempo restante pelo tempo sobrevivido e esconde os fragmentos, que não têm mais onde ser gastos. A tela final mostra os segundos na onda sem fim, os pontos, o tempo de partida e a build. O recorde continua na mesma chave (`forja.recorde`).

**A árvore tem 12 nós em 4 ramos de 3, com a stack real do Victor.** Cada nó pede o anterior do mesmo ramo. Os efeitos usam mecânicas que o jogo já tem (golpe, luz da lanterna, vida da Produção, bugs pálidos, combo), sem inimigo novo. **O objetivo é fechar a árvore e testar a build cheia na onda 3.** Os custos sobem por nível, mas ficam baixos: 4, 8 e 12 fragmentos, 96 pela árvore inteira. Chegaram a ser propostos custos altos (15, 30 e 50), pensados para 5 ou 6 compras e builds diferentes. O Victor preferiu poder comprar tudo: chegar à onda sem fim com a árvore completa empolga mais do que terminar com nós faltando.

Medido com um jogador simulado no Chrome headless, que golpeia o bug mais perto da Produção e compra sempre o nó mais barato:
- de 250 a 700 ms entre golpes, ele junta uns 40 fragmentos na primeira parada e de 80 a 100 na segunda, porque os caçadores automáticos também caçam;
- em todos esses ritmos, ele fecha a árvore até a segunda parada, com sobra de 20 a 36 fragmentos;
- com 5, 9 e 14, o ritmo de 700 ms ficava a 4 fragmentos do último nó; por isso os custos baixaram um pouco.

| Ramo | Nó (custo) | Efeito no jogo | Por que lembra o conceito |
| --- | --- | --- | --- |
| Go | **Goroutine** (4) | Um caçador automático golpeia, a cada 2 s, o bug mais perto da Produção. | Trabalho concorrente rodando sozinho. |
| Go | **Worker pool** (8) | Passam a ser 3 caçadores automáticos. | Várias goroutines dividindo a fila. |
| Go | **Channels** (12) | O golpe do caçador automático passa adiante para o bug mais perto: 1 acerto em cadeia. | Uma goroutine entrega o trabalho para a próxima. |
| React | **Batching** (4) | O golpe acerta uma área 50% maior. | Várias atualizações num render só. |
| React | **TypeScript** (8) | Bugs pálidos morrem num golpe, sem pedir confirmação. | O erro é pego antes de rodar. |
| React | **Suspense** (12) | Mostra, 1 s antes, de que ponto da borda vem o próximo bug. | Um aviso enquanto o resto ainda carrega. |
| PostgreSQL | **Índice** (4) | A luz da lanterna cobre 50% mais área e deixa os bugs mais lentos. | A busca deixa de varrer tudo. |
| PostgreSQL | **Transação** (8) | Uma vez por partida, desfaz o golpe que derrubaria a Produção: ela volta com 2 de vida. | Rollback. |
| PostgreSQL | **Vacuum** (12) | A cada 8 s, limpa os bugs pálidos da tela. | O autovacuum recolhe o que ficou para trás. |
| Infra | **Docker** (4) | No começo de cada onda, a Produção recupera 2 de vida (até 6). | Subir o contêiner de novo, limpo. |
| Infra | **Redis** (8) | O combo dura o dobro do tempo. | Cache: o que é quente fica à mão. |
| Infra | **RabbitMQ** (12) | O bug que chega na Produção volta para a borda, no máximo 1 a cada 8 s. | A mensagem volta para a fila em vez de se perder. |

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

- As ondas 1 e 2 duram 40 s cada, com 2 paradas na árvore; dá para pular a árvore.
- A onda 3 continua até a Produção cair e termina sozinha mesmo com a build cheia: quem joga bem dura de 1 a 3 min nela. Nos testes simulados com os 12 nós, um golpe a cada 700 ou 550 ms durou 36 s, a cada 400 ms durou 58 s, a cada 250 ms durou 92 s e a cada 150 ms durou 109 s.
- Cada um dos 12 nós tem efeito que se vê na arena, e a frase dele aparece no painel da árvore e na tela final.
- Jogando razoavelmente, dá para fechar a árvore até a segunda parada.
- Mouse: passar por cima mostra a descrição, e clicar compra. Teclado: Tab mostra, e Enter compra. Toque: o primeiro toque mostra, e o segundo compra.
- Bolhas com 46 px, foco visível e compra anunciada por `aria-live`; o grafo cabe a 390 px sem rolagem horizontal e sem nome cortado.
- Esc e a aba escondida funcionam com a árvore aberta; P e R não fazem nada nela. Na onda sem fim, P, o botão Pausar do jogo, Esc e a aba escondida pausam como nas outras. O Pausar do cabeçalho fica atrás do diálogo modal.
- Com movimento reduzido, a partida joga sem tremor e as bolhas ficam paradas.
- Nenhuma chave nova no storage; o jogo continua num chunk separado (conferir na saída do `yarn build`).
- `yarn lint` e `yarn build` passam; teste à mão no desktop e a 390 px. O `src/game/CLAUDE.md` e o PRD atualizados.

## Tamanho

Médio para grande: um PR, cerca de dois dias. São ondas e os 12 efeitos no `engine.ts` (~230 linhas a mais), o grafo em bolhas com o painel (~250 linhas), ~60 linhas de CSS e os textos do cartão de abertura e da tela final.

## Consequência

A partida não tem mais teto de 2,5 min, e isso continua cabendo no Caça-bugs:
- o jogo é opcional e fecha com Esc a qualquer momento;
- as duas primeiras ondas seguem curtas;
- a onda sem fim termina sozinha, porque a dificuldade sobe até a build cheia não dar conta;
- nada é salvo além do recorde.

Se a onda 3 precisar de save, de progresso entre partidas ou de durar muito mais que alguns minutos para ter graça, a ideia virou um incremental completo. Aí vale um projeto à parte, não crescer o Caça-bugs.

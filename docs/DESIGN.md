# Design

Tema: **Forja do Caçador**, um mundo noturno de caçador soulslike. O tema mora na moldura (fundo, ícones, chefes, sobrescritos), nunca no texto corrido.

## Princípios

1. **Conteúdo primeiro.** Nome, cargo, stack e currículo no primeiro quadro a 390 px, sem animação. Todo texto já nasce legível.
2. **Títulos comuns.** "Projetos", "Desafios técnicos", "Experiência". O termo de jogo vai só num sobrescrito curto (`tag` em `src/data/sections.ts`).
3. **Um elemento de personalidade por seção**, no máximo.
4. **Todo jogo tem atalho:** "Ler sem lutar" nas lutas; o Caça-bugs é opcional e fecha com Esc.
5. **Interação de verdade:** arrastar, arremessar, carregar o golpe. Ornamento sem interação não entra.

## Visual: "HUD da Lanterna" (decisão 014)

Preto quase puro, grade de células com linha de 1 px e o âmbar da lanterna como única luz quente. Cantos retos, sem sombra de card. Seções alternam `--bg` e `--bg-2` para quebrar o ritmo.

## Cores

Os tokens ficam no `:root` de `src/styles/forja.css`, com o contraste medido no comentário do topo. Os nomes dos tokens vêm da versão anterior (`--gold` agora é o âmbar). Resumo:

| Token | Uso |
| --- | --- |
| `--bg` #0B0B0C, `--bg-2` #101011, `--surface` #141415 | fundo, seções alternadas e cards |
| `--line` #2A2927, `--line-2` #3D3A36 | linhas da grade e bordas |
| `--text` #E4E0D8, `--muted` #9C978E | texto e texto secundário |
| `--moon` #A9D6E5 | links e mensagens da luta |
| `--gold` #F0B44C | âmbar da lanterna: destaque, foco, botão principal, sobrescritos |
| `--blood` #E0505C | barras de vida e nome do chefe (5,1:1 sobre o fundo) |

## Fontes

- Archivo condensada (`font-stretch: 68%`), peso 800, caixa alta: nome, títulos de seção, de projeto e do menu. Nunca numa frase.
- IBM Plex Sans: corpo.
- IBM Plex Mono: células, sobrescritos, fichas técnicas e HUD, no mínimo 12 px.

## O caçador

Capuz e cajado, rosto na sombra com dois pontos âmbar, lanterna no gancho do cajado. É a fonte da luz da tela de título: contorno âmbar só do lado da lanterna. O desenho mora em `src/scene/hunter.ts`; a arena e a marca usam a mesma silhueta em SVG (`src/components/icons.tsx`, `public/favicon.svg`).

## Movimento

- Com `prefers-reduced-motion`, nada anima (regra global no CSS e checagem em cada módulo de canvas). As lutas abrem já reveladas.
- O botão Pausar do cabeçalho congela animações CSS e os loops de canvas.
- Loops infinitos só quando a seção está visível e a aba está aberta.
- A "ficha que se imprime" roda uma vez por sessão e só usa `translate`.
- Os sobrescritos das seções acendem (borda âmbar) quando a seção entra na tela.

## Acessibilidade

- Foco visível dourado, link "Pular para o conteúdo", tudo pelo teclado.
- Alvos de toque de 44 px.
- O cursor nativo nunca é trocado nem escondido. A mira de lock-on tem `pointer-events: none` e some no toque.
- O mini game usa `<dialog>` com `showModal()`: foco preso e Esc nativos.

## Para quem volta

Faixa curta, sem modal, com "Continuar em <seção>" e o currículo. Nenhum dado da visita anterior além da seção (ver decisão 008).

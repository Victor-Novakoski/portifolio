# Design

Tema: **Forja do Caçador**, um mundo noturno de caçador soulslike. O tema mora na moldura (fundo, ícones, chefes, sobrescritos), nunca no texto corrido.

## Princípios

1. **Conteúdo primeiro.** Nome, cargo, stack e currículo no primeiro quadro a 390 px, sem animação. Todo texto já nasce legível.
2. **Títulos comuns.** "Projetos", "Desafios técnicos", "Experiência". O termo de jogo vai só num sobrescrito curto (`tag` em `src/data/sections.ts`).
3. **Um elemento de personalidade por seção**, no máximo.
4. **Todo jogo tem atalho:** "Ler sem lutar" nas lutas; o Caça-bugs é opcional e fecha com Esc.
5. **Interação de verdade:** arrastar, arremessar, carregar o golpe. Ornamento sem interação não entra.

## Cores

Os tokens ficam no `:root` de `src/styles/forja.css`, com o contraste medido no comentário do topo. Resumo:

| Token | Uso |
| --- | --- |
| `--bg` #0E0D12, `--surface` #17151D | fundo e cards |
| `--text` #EDE7DC, `--muted` #A8A1B3 | texto e texto secundário |
| `--moon` #A9D6E5 | links |
| `--gold` #E3C17A | destaque, foco, botão principal |
| `--blood` #D2384F | só barras, ícones e texto grande (4:1); texto pequeno usa `--blood-t` |

## Fontes

- Cormorant SC: nome e títulos curtos, nunca numa frase.
- Alegreya Sans: corpo.
- IBM Plex Mono: fichas técnicas e HUD, no mínimo 12 px.

## Movimento

- Com `prefers-reduced-motion`, nada anima (regra global no CSS e checagem em cada módulo de canvas). As lutas abrem já reveladas.
- O botão Pausar do cabeçalho congela animações CSS e os loops de canvas.
- Loops infinitos só quando a seção está visível e a aba está aberta.
- A "ficha que se imprime" roda uma vez por sessão e só usa `translate`.

## Acessibilidade

- Foco visível dourado, link "Pular para o conteúdo", tudo pelo teclado.
- Alvos de toque de 44 px.
- O cursor nativo nunca é trocado nem escondido. A mira de lock-on tem `pointer-events: none` e some no toque.
- O mini game usa `<dialog>` com `showModal()`: foco preso e Esc nativos.

## Para quem volta

Faixa curta, sem modal, com "Continuar em <seção>" e o currículo. Nenhum dado da visita anterior além da seção (ver decisão 008).

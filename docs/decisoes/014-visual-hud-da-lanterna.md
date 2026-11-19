# 014. Visual "HUD da Lanterna" e caçador de capuz e cajado

- **Data:** 19/11/2026
- **Status:** ativa (muda o visual da 004; o tema e os jogos continuam)

## Contexto

O Victor gostava da ideia da Forja, mas não do visual: seções iguais (linha fina, versalete, card roxo-acinzentado), rótulos mono em toda linha, chefes escondidos atrás de um véu de texto e um caçador amador (bloco preto, chapéu em disco, faixa clara no rosto). Foram pesquisadas 10 referências em galerias grátis (Awwwards, SiteInspire, Land-book) e sites de jogos, e propostas três direções: Bestiário de Gravura, Baralho de Chefes e HUD da Lanterna.

## Decisão

- Direção **HUD da Lanterna**: preto quase puro, âmbar da lanterna como única luz quente, grade de células com linha de 1 px, Archivo condensada em caixa alta nos títulos, IBM Plex Sans no corpo e IBM Plex Mono nos rótulos.
- Dos chefes, a ficha vem da direção Bestiário: **Golpe, Fraqueza e Recompensa** (o risco, a solução e o resultado, com os mesmos textos). O nome do chefe aparece só na barra de vida da arena; as instruções saem do véu e ficam numa linha abaixo dela.
- O caçador vira **capuz e cajado** (acabamento escolhido: barra rasgada, lanterna balançando no gancho, sem chapéu), isolado em `src/scene/hunter.ts` atrás de `drawHunter`/`hunterHook`, para poder virar uma ilustração depois sem mexer na cena.
- **Sai o chapéu arremessável**, com o botão, o segredo "chapéu" e a nota do cosplay na tela de título. O chapéu continua citado no Sobre, como peça do cosplay.
- Saem as barras VIDA/VIGOR do hero; o status vira uma faixa de células.

## Consequência

- Uma única lanterna é a fonte da luz da tela de título: a lanterna na corda (Verlet) saiu, e a do cajado virou a peça interativa (arrastar e soltar para balançar no gancho; "Balançar a lanterna" e o segredo "luz" dão um empurrão).
- Cores e fontes moram nos tokens de `src/styles/forja.css`; o contraste medido está no comentário do topo.

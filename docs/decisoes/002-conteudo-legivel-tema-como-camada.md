# 002. Conteúdo legível primeiro, tema como camada

- **Data:** 23/10/2026
- **Status:** ativa

## Contexto

A versão "The Lost Developer" abria num mapa do mundo: o nome e o cargo só apareciam dentro de "Sobre Mim", as regiões não eram focáveis pelo teclado e a imagem do mapa pesava 3,7 MB. Um recrutador saía em 10 segundos sem saber de quem era o site.

## Decisão

- O mapa sai de vez, sem rota opcional. A estrutura passa a ser uma página única com rolagem e cabeçalho fixo.
- Nome, cargo, stack e currículo no primeiro quadro, sem animação, também a 390 px.
- Títulos comuns sempre ("Desafios técnicos"); o termo de jogo só num sobrescrito curto.
- O tema fica na moldura (cores, fontes, ícones, transições), nunca no texto corrido. No máximo um elemento de personalidade por seção.

## Consequência

- Todo elemento de jogo precisa de um atalho para quem só quer ler.
- Vale para qualquer tema futuro: a 003 e a 004 trocam o tema, não esta regra.

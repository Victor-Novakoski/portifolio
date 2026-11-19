# 008. Faixa de retorno guarda só a seção

- **Data:** 24/10/2026
- **Status:** ativa

## Contexto

A versão Brasa mostrava a quem voltava o horário e o tempo da visita anterior. A pesquisa de UX mostrou que isso parece vigilância, principalmente quando a pessoa abre o site na frente do gestor. O revisor queria tirar até o atalho.

## Decisão

Uma faixa curta, sem modal, com "Continuar em <seção>" e o currículo. Só a última seção fica guardada (`forja.secao` e `forja.visitou`, em `localStorage`), sem horário, tempo ou contagem. Para testar no `yarn dev`, `?volta=1`.

## Consequência

Qualquer ideia nova de "lembrar o visitante" precisa respeitar este limite ou substituir esta decisão.

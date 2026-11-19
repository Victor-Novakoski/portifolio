# 011. Sem testes automatizados por enquanto

- **Data:** 24/10/2026
- **Status:** ativa

## Contexto

O site é quase todo apresentação e canvas. Não havia runner de testes no repositório, e o risco maior era visual (primeiro quadro, celular, movimento reduzido).

## Decisão

Não adicionar testes agora. A CI roda lint e build (com checagem de tipos) em todo PR, e cada mudança visual é conferida no navegador a 1440, 390 e 360 px e com movimento reduzido.

## Consequência

As funções puras (`lib/trigram.ts`, `lib/visit.ts`, `lib/storage.ts`) ficam sem rede de proteção. Se o site ganhar regra de negócio, esta decisão deve ser revista.

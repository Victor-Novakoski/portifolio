# src/scene

O canvas da tela de título: céu com montanhas, névoa e brasas, o caçador "Capuz e cajado" com a lanterna no gancho do cajado.

## Regras

- `mountTitleScene(title, { sky })` devolve `{ destroy, swingLamp }`. O componente `title-screen.tsx` chama `destroy()` no cleanup.
- O loop só roda se a cena estiver visível, a aba aberta, o site sem pausa e sem movimento reduzido. Com movimento reduzido, desenha um quadro parado, sem brasas, com a lanterna do caçador parada (`swingLamp` não faz nada).
- `devicePixelRatio` limitado a 1,5, para o celular não pesar.
- Se o canvas não der contexto 2D, a cena vira no-op: o texto da tela de título já está no HTML e não depende dela.
- O caçador mora em `hunter.ts`, atrás de duas funções: `drawHunter(c, { x, y, scale, t, lampAngle })`, que desenha e devolve `{ lamp: { x, y } }` (onde a lanterna ficou, em coordenadas do canvas), e `hunterHook({ x, y, scale })`, o gancho do cajado (pivô da lanterna). `lampAngle` vem da cena: oscilação base + pêndulo amortecido, que o `swingLamp` empurra e o arrastar segura (a lanterna aponta do gancho para o ponteiro; ao soltar, a velocidade do ponteiro vira balanço). Para trocar o desenho por uma ilustração, implemente as mesmas duas funções em `hunter.ts`; a cena não muda.
- O desenho usa uma camada offscreen reaproveitada (recriada só se o tamanho do canvas mudar), não uma por quadro.
- Só existe uma lanterna, a do cajado (decisão 014). O toque acha a lanterna pelo ponto que `drawHunter` devolveu no último quadro.

## Armadilhas conhecidas

- **Só reconstruir o cenário quando a largura muda** (`lastWidth`). No celular, a barra de endereço muda a altura ao rolar; reconstruir nisso sorteia montanhas novas a cada rolagem.
- A física (pêndulo da lanterna) fica em variáveis do módulo. Não leve isso para state do React.

## Ver também

- docs/decisoes/005-jogo-em-modulos-imperativos.md

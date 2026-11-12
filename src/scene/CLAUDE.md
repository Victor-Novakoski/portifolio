# src/scene

O canvas da tela de título: céu com montanhas, névoa e brasas, o chapéu arremessável e a lanterna pendurada numa corda.

## Regras

- `mountTitleScene(...)` devolve `{ destroy, throwHat, swingLamp, tipHat }`. O componente `title-screen.tsx` chama `destroy()` no cleanup.
- O loop só roda se a cena estiver visível, a aba aberta, o site sem pausa e sem movimento reduzido. Com movimento reduzido, desenha um quadro parado, sem brasas, e o chapéu não voa: o botão só mostra a nota.
- `devicePixelRatio` limitado a 1,5, para o celular não pesar.
- Se o canvas não der contexto 2D, a cena vira no-op: o texto da tela de título já está no HTML e não depende dela.
- O chapéu é peça real do cosplay do Victor. O botão do chapéu (`tipHat`) mostra a nota de `profile.hatNote`.

## Armadilhas conhecidas

- **Só reconstruir o cenário quando a largura muda** (`lastWidth`). No celular, a barra de endereço muda a altura ao rolar; reconstruir nisso sorteia montanhas novas a cada rolagem.
- O arremesso usa física simples em variáveis do módulo. Não leve isso para state do React.

## Ver também

- docs/decisoes/005-jogo-em-modulos-imperativos.md

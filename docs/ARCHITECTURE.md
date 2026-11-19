# Arquitetura

Site estático de uma página. O React cuida da estrutura, do texto e dos estados que mudam pouco; o que se mexe a 60 fps (canvas, física, lutas, mini game) vive em módulos TypeScript imperativos com `mount → destroy()`.

```
src/
  App.tsx       a página: seções na ordem de data/sections.ts; rota desconhecida mostra o 404
  data/         todo o conteúdo do site (perfil, projetos, chefes, experiência, habilidades, seções)
  components/   uma seção ou peça de UI por arquivo
  scene/        canvas da tela de título
  game/         luta contra os chefes (fight.ts) e o Caça-bugs (caca-bugs/, chunk separado)
  hooks/        seção atual na rolagem
  lib/          runtime (pausa e dono do teclado), storage seguro, movimento, trigramas, visita
  styles/       forja.css, o tema inteiro
public/         og.png, favicon, currículo em PDF
```

## Fluxos que atravessam pastas

- **Pausa:** o cabeçalho chama `runtime.setPaused`. Isso põe a classe `paused` no `<html>` (CSS congela) e avisa os módulos de canvas, que param o próprio loop.
- **Teclado:** cada sistema registra o próprio `keydown` e consulta `runtime.get().active` (`fight`, `game` ou ninguém). Não há despachante central (decisão 006).
- **Mini game:** `lib/game-loader.ts` faz o `import()` dinâmico; o hover ou foco no botão pré-carrega. Lutas e cabeçalho abrem o jogo por um evento de `window` (`openGame`).
- **Visita:** `lib/visit.ts` lê a última seção uma vez, antes de qualquer efeito gravar a atual.

## Deploy

Vercel, a partir da `main`. O `vercel.json` manda toda rota sem extensão para o `index.html` e põe cache imutável em `/assets`. O `vite.config.ts` monta canonical, `og:url` e `og:image` a partir de `VERCEL_PROJECT_PRODUCTION_URL` (ou `SITE_URL`).

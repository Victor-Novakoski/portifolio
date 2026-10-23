# Victor Novakoski · Portfólio

![Prévia do portfólio](public/og.png)

Portfólio de Victor Novakoski, desenvolvedor full stack (Go, React, TypeScript e PostgreSQL).

A visita funciona como uma entrega em rota: cada seção é um ponto de parada, o selo "Rastreie esta visita" mostra o histórico com horário, e a rota termina na fogueira do contato. É a mesma ideia do Rastreia, o projeto de rastreio de entregas em tempo real que aparece no site.

## O que tem no site

- Projetos: Rastreia e Panda Cooking, com ficha técnica e links
- Desafios técnicos resolvidos, com um diagrama de evento entre instâncias da API
- Experiência, habilidades e onde cada uma foi usada
- Contato e currículo em PDF

## Stack

React 19, TypeScript e Vite, com CSS puro (sem framework de UI nem biblioteca de animação). As animações respeitam `prefers-reduced-motion`.

## Rodando localmente

```bash
yarn install
yarn dev        # http://localhost:5173
yarn lint
yarn build      # checa os tipos e gera dist/
```

## Deploy

Pensado para a Vercel. O `vercel.json` manda qualquer rota para o `index.html` (rotas desconhecidas mostram a página 404 do app). O endereço usado no canonical e nas tags de compartilhamento vem de `VERCEL_PROJECT_PRODUCTION_URL`, ou de `SITE_URL` se for definido.

## Estrutura

```
src/
  data/        conteúdo do site (perfil, projetos, desafios, experiência, habilidades)
  components/  uma seção por arquivo
  hooks/       jornada da visita, progresso da rota e revelações
  styles/      brasa.css, o tema
```

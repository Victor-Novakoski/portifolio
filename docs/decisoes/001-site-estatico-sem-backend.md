# 001. Site estático em React + Vite, sem backend

- **Data:** 23/10/2026
- **Status:** ativa

## Contexto

O portfólio só mostra conteúdo: projetos, experiência, contato e um currículo em PDF. A hospedagem precisa ser de custo zero, e um recrutador abre o link pelo celular.

## Decisão

Página única em React + TypeScript com Vite, publicada como site estático na Vercel (plano gratuito). Sem backend, banco, formulário com servidor ou analytics. Contato por e-mail, LinkedIn e GitHub. CI no GitHub Actions com lint e build em todo PR.

## Consequência

- Deploy é só `vite build`; rotas desconhecidas caem no `index.html`, que mostra o 404 do app (`vercel.json`).
- Canonical e tags de compartilhamento são montados no build a partir de `VERCEL_PROJECT_PRODUCTION_URL` ou `SITE_URL`.
- Qualquer estado do visitante fica no navegador dele (`localStorage`), e o site precisa funcionar sem isso.

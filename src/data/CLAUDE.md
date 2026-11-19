# src/data

Todo o texto do site mora aqui. Os componentes só leem; não escreva conteúdo direto no JSX.

## Regras

- **Sigilo da Galileu:** só cargo, período e stack (`experience.ts`). Nada de nome de cliente, nome de repositório, código, prints, números internos ou descrição do domínio sem autorização do Victor. Habilidades usadas lá aparecem como "no trabalho".
- **Nada inventado:** sem número, métrica ou história que o Victor não confirmou. Se faltar, deixe `TODO: confirmar com o Victor` em vez de preencher. Os desafios seguem Risco → Solução → Resultado porque não há história de falha real para contar.
- **Uma fonte só por chefe:** `bosses.ts` alimenta a luta, o "Ler sem lutar" e o modo de movimento reduzido. Não duplique os fragmentos em outro lugar.
- **Ordem das seções:** `sections.ts` define a ordem, o menu de título, o cabeçalho e o "Continuar em". Mudar o `id` de uma seção quebra o retorno de quem já visitou (cai em "projetos").
- **Sem telefone no site.** Contato é e-mail, LinkedIn, GitHub e o PDF do currículo.
- **Currículo:** todo botão aponta para `profile.cvUrl` (`/curriculo-victor-novakoski.pdf`, em `public/`). Ao trocar o PDF, mantenha o nome do arquivo. A fonte editável é `docs/curriculo/curriculo-victor-novakoski.docx`: para mudar o currículo, edite o docx e exporte para PDF com LibreOffice.
- **Prints de projeto:** só com dados fictícios, em WebP, dentro de `src/assets/projects/`.
- **Sobre:** só fatos que o Victor contou (props, cosplays, artesanato). Sem menção a família ou relacionamento.

## Armadilhas conhecidas

- Cada card de `projects.ts` vira âncora pelo `id` (`/#rastreia`, citada no currículo). Não mude esses `id`s sem trocar o currículo. A rolagem é refeita após a montagem e o carregamento das fontes (`useProjectAnchor` em `projects.tsx`), e `.item` tem `scroll-margin-top` por causa do cabeçalho fixo. O Rastreia já tem o link do repositório (público, decisão 013).
- O Revelação é jogo de diversão, não projeto de carreira, mas o card fica (`wide: true` ocupa a linha inteira no desktop).

## Ver também

- docs/decisoes/009-sigilo-da-galileu.md
- docs/decisoes/013-rastreia-com-repositorio-aberto.md
- docs/decisoes/012-revelacao-nos-projetos.md

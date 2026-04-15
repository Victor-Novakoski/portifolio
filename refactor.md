# MVP para Portfólio "Soulslike"

## Visão geral e objetivo

O objetivo deste MVP é transformar a ideia conceitual do portfólio interativo **"The Lost Developer"** em um projeto real executável. Em vez de mostrar um portfólio como um *grid* de cartões, a proposta é conduzir o visitante por uma experiência narrativa inspirada em jogos Soulslike, onde cada seção do site representa um “mapa” ou “chefe”. Essa abordagem aproveita a expectativa contemporânea por micro‑interações e transições suaves — hoje, as interfaces não se limitam a botões e formulários; a experiência de usuário e a narrativa visual são fundamentais.

## Pilha de tecnologias

* **React** – biblioteca JavaScript para construir interfaces de usuário baseadas em componentes, permitindo dividir a aplicação em partes reutilizáveis.
* **Vite** – *bundler* rápido que acelera o desenvolvimento front‑end.
* **Tailwind CSS** – framework *utility‑first* que possibilita criar designs responsivos com classes utilitárias. Ele oferece eficiência, flexibilidade e responsividade; permite manter consistência visual, gera CSS otimizado e funciona bem com frameworks como React.
* **shadcn/ui** – biblioteca de componentes de interface, utilizada para elementos base (botões, *cards*) com estilo consistente.
* **GSAP (GreenSock Animation Platform)** – biblioteca de animação avançada para JavaScript. GSAP é poderosa e altamente personalizável; fornece recursos como *timelines*, funções de *easing* e *tweening*, além de performance superior.
* **Framer Motion** – biblioteca de animações para React que facilita transições e micro‑interações suaves.
* **Trilha sonora (opcional)** – sons ambiente para reforçar a imersão.
* **Controle de versão** – Git + GitHub para versionamento e hospedagem do código.
* **Hospedagem** – Vercel/Netlify para *deploy* rápido e certificado HTTPS.

## Arquitetura e estrutura de projeto

### Organização de pastas

* `src/` – código‑fonte da aplicação.
  * `components/` – componentes reutilizáveis (HUD, navegação, cartas de projeto, árvore de habilidades).
  * `pages/` – páginas/rotas principais (Hub inicial, Forgotten Battlefield, Codex, Skill Tree, Trials, Shrine).
  * `data/` – estrutura JSON ou Markdown para descrever projetos, habilidades e desafios; facilita atualização sem mexer no código.
  * `styles/` – configuração do Tailwind e estilos globais.
  * `assets/` – imagens, sons e vídeos curtos.
* `public/` – arquivos estáticos públicos.

### Navegação e roteamento

Utilizar **React Router** para gerenciar as rotas (áreas do portfólio). Para reforçar a ideia de exploração, a navegação pode ser controlada por botões ou *links* escondidos que o usuário descobre (por exemplo, desbloquear “The Codex” após visitar dois projetos).

### Estado e progressão

Guardar no estado global (Context API ou Zustand) as informações de progresso do visitante: quais áreas já foram exploradas e quais projetos foram “derrotados” (visualizados). Isso permite desbloquear áreas subsequentes e exibir mensagens como “boss defeated”.

### Animações

* Usar **GSAP** para animações mais complexas (timelines de entrada de seções, transições com partículas ou *glow*). GSAP permite controlar precisamente tempo e comportamento.
* Usar **Framer Motion** para micro‑interações e transições de componentes (hover em cards, botões pulsando). A combinação de ambas as bibliotecas oferece um equilíbrio entre controle avançado e produtividade.
* Integrar sons ambiente no Hub e em algumas seções; oferecer opção de ativar/desativar áudio.

## Funcionalidades do MVP

A seguir estão as funcionalidades mínimas para validar a experiência proposta:

### Hub (tela inicial)

* Introdução com nome e frase estilo Souls (“A mind forged in code…”).
* Botões: **Start Journey**, **Load Memory** (para pessoas que voltam) e **Enter the Archive** (acesso direto a projetos).
* Animação de entrada lenta (fade e partículas) para criar atmosfera.

### Forgotten Battlefield (projetos)

* Lista de projetos; cada projeto é apresentado como um “chefe” com nome e arte.
* Hover mostra “lore” (descrição breve).
* Ao clicar, abre um modal ou página de arena com:
  * História e contexto do projeto.
  * Tecnologias usadas (representadas como “habilidades do chefe”).
  * Problemas resolvidos (ataques que você derrotou).
  * Capturas de tela, gifs ou vídeos curtos.

### Codex (sobre você)

* Página apresentada como um livro antigo.
* Conteúdo: trajetória profissional, *stack*, objetivos.
* Efeitos de virar páginas com animação de GSAP.

### Skill Tree (competências)

* Representação visual de uma árvore de habilidades.
* Habilidades desbloqueadas (frontend, backend) e bloqueadas (por exemplo, IA).
* Hover mostra descrição.
* Estado global registra habilidades “dominadas” à medida que projetos correspondentes são visitados.

### Trials (experiências/desafios)

* Apresentação de problemas técnicos que você resolveu, em formato de missões. Ex.: “Trial 1 – Scaling API under load”, “Trial 2 – Dynamic metadata validation”.
* Cada *trial* contém descrição do problema, abordagem e resultado.

### Shrine (contato)

* Seção minimalista para contato.
* Links: e‑mail (“Summon Ritual”), LinkedIn (“Call for Alliance”), GitHub (“Ancient Repository”).
* Formulário opcional para envio de mensagem.

## Etapas de desenvolvimento

Abaixo está um plano de execução em etapas, como um programador sênior planeja um MVP. Cada etapa contém entregas claras e tecnologias envolvidas.

| Etapa | Descrição / Entregas | Tecnologia & Observações |
|---|---|---|
| **1. Levantamento de requisitos e narrativa** |  <br>– Definir quantos projetos serão incluídos e os nomes/descrições que serão usados como “chefes”.  <br>– Escrever a narrativa geral (“desenvolvedor amaldiçoado preso em um sistema corrompido”).  <br>– Levantar conteúdo para o Codex, Skill Tree e Trials.  <br>– Selecionar ou produzir imagens e áudio. | Reuniões com stakeholders. Textos preparados em Markdown ou JSON. |
| **2. Design e wireframes** |  <br>– Produzir wireframes das seções (Hub, Battlefield, Codex, etc.) com foco em layout responsivo e hierarquia visual.  <br>– Definir paleta de cores (preto, cinza, dourado, azul espectral) e fontes.  <br>– Planejar a navegação (menus, transições).  <br>– Escolher componentes de shadcn/ui. | Ferramentas de design (Figma/Adobe XD). Um layout limpo e profissional facilita a navegação. |
| **3. Setup do projeto** |  <br>– Criar repositório Git, configurar Vite com React e TypeScript.  <br>– Instalar Tailwind CSS, configurar o arquivo `tailwind.config.js` e classes personalizadas.  <br>– Instalar shadcn/ui e configurar tema base.  <br>– Instalar GSAP, Framer Motion e React Router. | Comandos `npm`. Garantir que Tailwind seja configurado com *purge* para performance. |
| **4. Desenvolvimento da estrutura** |  <br>– Construir componente de layout principal (HUD).  <br>– Implementar roteamento entre páginas.  <br>– Criar páginas do Hub, Battlefield, Codex, Skill Tree, Trials e Shrine com *placeholders*.  <br>– Configurar estado global para progresso do usuário. | React, React Router, Context API ou Zustand. |
| **5. Conteúdo dinâmico** |  <br>– Criar arquivo `data/projects.json` com informações dos projetos.  <br>– Criar componentes que leem esses dados e geram cartas de projeto.  <br>– Implementar modais ou rotas de arena para cada projeto. | Uso de JSON/Markdown. |
| **6. Animações e micro‑interações** |  <br>– Aplicar GSAP para transições de página e entrada das seções (timelines, partículas).  <br>– Aplicar Framer Motion para hover, scroll e animações de elementos.  <br>– Implementar “cursor Soulslike” com rastro (CSS + JavaScript).  <br>– Adicionar sons ambiente e controle de áudio. | A importância de micro‑interações para a experiência do usuário está consolidada em estudos modernos. |
| **7. Design responsivo e acessibilidade** |  <br>– Utilizar utilidades responsivas do Tailwind para ajustar layout em dispositivos móveis.  <br>– Garantir contraste adequado de cores e navegação via teclado.  <br>– Adicionar atributos `aria` e legendas nas imagens. | Tailwind oferece utilitários responsivos e boa performance. |
| **8. Testes** |  <br>– Realizar testes manuais de navegação, animações e progressão.  <br>– Testar em navegadores (Chrome, Firefox, Safari) e dispositivos móveis.  <br>– Corrigir bugs de layout e performance. | Ferramentas de teste (ex.: Lighthouse para performance). |
| **9. Deploy** |  <br>– Configurar build de produção (Vite) e hospedagem no Vercel/Netlify.  <br>– Configurar domínio personalizado, HTTPS e meta tags para SEO.  <br>– Ativar monitoramento (Google Analytics) opcional. | CI/CD. |
| **10. Feedback e iteração** |  <br>– Coletar feedback de usuários e recrutadores.  <br>– Avaliar métricas de engajamento (tempo na página, cliques).  <br>– Priorizar melhorias para versões futuras (ex.: modo desenvolvedor, progressão avançada, integração com CMS). | Ferramentas de analytics, entrevistas com usuários. |

## Considerações de design

* **Narrativa e storytelling** – Uma boa apresentação não é apenas um repositório de projetos; ela deve contar uma história sobre sua jornada. Organizar o portfólio de forma a contar a trajetória profissional ajuda recrutadores a entender sua evolução. A proposta Soulslike usa metáforas de “chefes” e “mapas” para tornar essa narrativa memorável.
* **Qualidade sobre quantidade** – Incluir somente projetos representativos e experiências relevantes. Selecionar peças fortes e variar para mostrar versatilidade.
* **Elementos interativos** – Uso de animações, *hovers* e seções interativas para engajar o usuário. Elementos clicáveis e vídeos tornam o portfólio mais dinâmico. Contudo, manter a navegação simples e clara para que recrutadores possam encontrar facilmente as informações.
* **Design responsivo** – É essencial que o portfólio funcione bem em desktops, tablets e smartphones. Tailwind simplifica a criação de layouts responsivos.
* **Consistência visual** – Usar uma paleta limitada (preto, cinza, dourado e azul espectral) e fontes serifadas elegantes para transmitir estética medieval e sombria. Tailwind e shadcn/ui ajudam a manter consistência.

## Entregas e cronograma sugerido

Uma possível divisão em sprints (semanas) para um MVP de 5–6 semanas:

1. **Semana 1 – Planejamento e design**: Levantamento de requisitos, narrativa, wireframes e seleção de *assets*.
2. **Semana 2 – Setup e estrutura inicial**: Configuração do projeto (Vite, React, Tailwind, shadcn/ui), criação de roteamento e páginas básicas.
3. **Semana 3 – Conteúdo dinâmico**: Implementação de estrutura de dados e componentes para projetos, habilidades e desafios.
4. **Semana 4 – Animações e interação**: Integração de GSAP/Framer Motion, criação de animações de entrada e micro‑interações.
5. **Semana 5 – Responsividade, testes e polimento**: Ajustes de layout para dispositivos móveis, testes de usabilidade, correção de bugs e adição de sons.
6. **Semana 6 – Deploy e feedback**: Publicação, monitoramento, coleta de feedback e planejamento para versão futura.

## Próximos passos e extensões futuras

Uma vez validado o MVP, podem ser exploradas funcionalidades extras:

* **Modo desenvolvedor**: atalho secreto que revela diagramas de arquitetura, *snippets* de código e decisões técnicas.
* **Sistema de conquistas**: permitir ao visitante desbloquear realizações (ex.: “visitou todos os projetos”).
* **Integração com CMS**: para atualizar projetos e desafios sem alterar o código.
* **Internacionalização**: permitir trocar o idioma (PT/EN).
* **Integração com analytics**: acompanhar quais seções atraem mais atenção.

## Conclusão

Este plano transforma a ideia conceitual de um portfólio Soulslike em um MVP profissional. O uso de bibliotecas como React e Tailwind CSS traz produtividade e modularidade; GSAP e Framer Motion oferecem controle sobre animações complexas e micro‑interações. A narrativa inspira‑se em recomendações de especialistas, que sugerem portfólios que contam uma história da carreira e utilizam elementos interativos para envolver recrutadores. Ao seguir essas etapas, você poderá desenvolver um portfólio memorável e diferenciado, que demonstra tanto habilidades técnicas quanto criatividade.
# PRD: Diario de Tratamento (Treatment Diary)

## Introduction

O Diario de Tratamento e uma area dedicada para pacientes de cannabis medicinal registrarem seu uso diario, sintomas, efeitos e evolucao ao longo do tratamento. Inspirado nos melhores padroes de apps como Releaf (antes/depois de sintomas), Bearable (input minimo por taps, correlacoes automaticas) e Goldleaf (estetica de diario premium), o objetivo e produzir dados estruturados que sirvam tanto como agenda pessoal do paciente quanto como insumo clinico futuro para medicos.

O diferencial e o modelo **antes/depois**: o paciente registra a severidade dos sintomas antes de usar o produto e re-avalia depois, gerando dados de eficacia mensuravelis — o tipo de informacao que prescritores mais valorizam.

### Referencia de UX (pesquisa)

| App | Padrao adotado |
|-----|---------------|
| Releaf | Modelo antes/depois de sintomas (0-10), chips de metodo, favoritos para quick-log |
| Bearable | Severidade em 4 niveis (nenhum/leve/moderado/severo), correlacoes automaticas, minimal-tap |
| Goldleaf | Spider chart de efeitos, estetica de diario, campo de notas reflexivas |
| Strainprint | Dados estruturados de grau clinico, re-avaliacao pos-onset |

**Decisoes de design para o CannHub:**
- **Escala de severidade**: 4 niveis (nenhum/leve/moderado/severo) para sintomas — mais consistente que 0-10, menos fadiga (referencia Bearable)
- **Efeitos**: multi-select com chips (positivos e negativos) + escalas numericas para sintomas-chave
- **Input minimo**: maioria das interacoes com 1-2 taps; sliders e chips sobre texto
- **Favoritos/templates**: salvar combinacoes frequentes para quick-log (referencia Releaf)
- **Timeline diaria**: cards por dia expandiveis, com icones de metodo e indicadores de melhora (delta)

## Goals

- Permitir que pacientes registrem cada uso de cannabis medicinal com dados estruturados (produto, dose, horario, via de administracao)
- Capturar severidade de sintomas antes e depois do uso, gerando dados de eficacia mensuravel
- Oferecer campos pre-definidos (multi-select, escalas) combinados com texto livre para flexibilidade
- Exibir historico em timeline navegavel com filtros e resumos diarios
- Apresentar dashboard com graficos de evolucao (tendencias de sintomas, produtos mais eficazes)
- Minimizar friccao no registro diario para maximizar adesao (quick-log, favoritos, poucos taps)

## User Stories

### US-001: Modelo Prisma do Diario
**Descricao:** Como desenvolvedor, preciso dos modelos de dados para persistir entradas do diario, sintomas e efeitos.

**Acceptance Criteria:**
- [ ] Criar modelo `DiaryEntry` no Prisma: `id`, `userId`, `date` (DateTime), `time` (String HH:mm), `productId?` (relacao opcional com Product), `customProductName?` (String, para produtos manuais), `administrationMethod` (enum: oil, flower, vape, edible, topical, capsule, other), `dose` (String — ex: "3 gotas", "0.5ml", "10mg"), `doseUnit` (enum: drops, ml, mg, g, puffs, units), `doseAmount` (Decimal), `notes?` (texto livre), `isFavorite` (Boolean default false), `createdAt`, `updatedAt`
- [ ] Criar modelo `DiarySymptomLog`: `id`, `diaryEntryId`, `symptomKey` (String — chave do sintoma pre-definido), `customSymptomName?` (String), `severityBefore` (enum: none, mild, moderate, severe), `severityAfter?` (enum, preenchido no re-check)
- [ ] Criar modelo `DiaryEffectLog`: `id`, `diaryEntryId`, `effectKey` (String — chave do efeito), `isPositive` (Boolean), `customEffectName?` (String)
- [ ] Criar modelo `DiaryFavorite`: `id`, `userId`, `name` (String), `productId?`, `customProductName?`, `administrationMethod`, `doseAmount`, `doseUnit`, `symptomKeys` (String[] — sintomas pre-selecionados)
- [ ] Relacoes: DiaryEntry belongsTo User, DiaryEntry hasMany DiarySymptomLog, DiaryEntry hasMany DiaryEffectLog, DiaryEntry belongsTo Product (opcional)
- [ ] Migration roda com sucesso
- [ ] `pnpm prisma:generate` sem erros

### US-002: Enums e tipos compartilhados
**Descricao:** Como desenvolvedor, preciso dos enums e tipos do diario no pacote shared para usar no backend e frontend.

**Acceptance Criteria:**
- [ ] Adicionar em `packages/shared` (ou onde os enums compartilhados vivem): `AdministrationMethod`, `DoseUnit`, `SymptomSeverity` (none/mild/moderate/severe), lista de `PREDEFINED_SYMPTOMS` (pain, anxiety, insomnia, nausea, inflammation, fatigue, depression, appetite_loss, headache, muscle_spasm, stress, ptsd), lista de `PREDEFINED_EFFECTS` positivos (relaxed, pain_relief, sleepy, calm, focused, euphoric, hungry, creative, energized) e negativos (dry_mouth, dizzy, paranoia, anxious, headache, nausea, drowsy, red_eyes)
- [ ] Labels em PT-BR para todos os enums no `constants/labels.ts` do frontend
- [ ] Typecheck passa em ambos os pacotes

### US-003: Use cases de CRUD do diario (Backend)
**Descricao:** Como paciente, preciso criar, ler, atualizar e deletar entradas do diario.

**Acceptance Criteria:**
- [ ] Use case `CreateDiaryEntry` — recebe userId + dados da entrada + array de sintomas (com severityBefore) + array de efeitos. Retorna `Either<Error, { entry: DiaryEntry }>`. Valida que productId (se informado) pertence a uma associacao vinculada ao paciente
- [ ] Use case `UpdateDiaryEntry` — atualiza entrada existente (somente do proprio user). Permite atualizar `severityAfter` nos sintomas (re-avaliacao pos-uso)
- [ ] Use case `DeleteDiaryEntry` — soft delete ou hard delete da entrada (somente do proprio user)
- [ ] Use case `GetDiaryEntry` — retorna entrada com sintomas e efeitos populated
- [ ] Use case `ListDiaryEntries` — paginado, filtros por: `dateFrom`, `dateTo`, `productId`, `administrationMethod`, `symptomKey`. Ordenado por data+hora desc
- [ ] Testes unitarios para todos os use cases (in-memory repos, factories)
- [ ] `pnpm test` passa

### US-004: Use case de favoritos/templates (Backend)
**Descricao:** Como paciente, quero salvar combinacoes frequentes como favoritos para re-log rapido.

**Acceptance Criteria:**
- [ ] Use case `CreateDiaryFavorite` — salva template com produto, metodo, dose e sintomas pre-selecionados
- [ ] Use case `ListDiaryFavorites` — lista favoritos do user
- [ ] Use case `DeleteDiaryFavorite` — remove favorito
- [ ] Use case `CreateEntryFromFavorite` — cria DiaryEntry a partir de um favorito (pre-preenche campos, paciente so confirma e ajusta)
- [ ] Testes unitarios
- [ ] `pnpm test` passa

### US-005: Use case de insights/resumo (Backend)
**Descricao:** Como paciente, quero ver resumos e tendencias do meu tratamento.

**Acceptance Criteria:**
- [ ] Use case `GetDiarySummary` — retorna para um periodo (default 30 dias): total de entradas, sintomas mais frequentes, produto mais usado, media de severidade antes vs depois por sintoma (delta de melhora), distribuicao por metodo de administracao
- [ ] Use case `GetSymptomTrend` — retorna evolucao de um sintoma especifico ao longo do tempo (array de pontos: data, severityBefore media, severityAfter media)
- [ ] Testes unitarios
- [ ] `pnpm test` passa

### US-006: Controllers e endpoints REST (Backend)
**Descricao:** Como desenvolvedor frontend, preciso dos endpoints HTTP para integrar o diario.

**Acceptance Criteria:**
- [ ] `POST /diary` — criar entrada (JWT, body: dados da entrada + sintomas + efeitos)
- [ ] `GET /diary` — listar entradas paginadas com filtros (JWT, query params)
- [ ] `GET /diary/:id` — detalhe da entrada (JWT)
- [ ] `PATCH /diary/:id` — atualizar entrada, incluindo re-avaliacao de sintomas (JWT)
- [ ] `DELETE /diary/:id` — deletar entrada (JWT)
- [ ] `POST /diary/favorites` — criar favorito (JWT)
- [ ] `GET /diary/favorites` — listar favoritos (JWT)
- [ ] `DELETE /diary/favorites/:id` — deletar favorito (JWT)
- [ ] `POST /diary/favorites/:id/log` — criar entrada a partir de favorito (JWT)
- [ ] `GET /diary/summary` — resumo do periodo (JWT, query: dateFrom, dateTo)
- [ ] `GET /diary/symptoms/:key/trend` — tendencia de sintoma (JWT, query: dateFrom, dateTo)
- [ ] DTOs com validacao (class-validator)
- [ ] Todos os endpoints protegidos com `@UseGuards(JwtAuthGuard)`
- [ ] Registrar controllers e use cases no `http.module.ts`
- [ ] Testes E2E para fluxo completo (criar, listar, atualizar severityAfter, summary)
- [ ] `pnpm test:e2e` passa

### US-007: Hooks React Query (Frontend)
**Descricao:** Como desenvolvedor frontend, preciso dos hooks para consumir a API do diario.

**Acceptance Criteria:**
- [ ] `useDiaryEntries(filters)` — GET /diary com filtros, paginacao, React Query
- [ ] `useDiaryEntry(id)` — GET /diary/:id
- [ ] `useCreateDiaryEntry()` — POST /diary, invalidate lista
- [ ] `useUpdateDiaryEntry()` — PATCH /diary/:id, invalidate lista + detalhe
- [ ] `useDeleteDiaryEntry()` — DELETE /diary/:id, invalidate lista
- [ ] `useDiaryFavorites()` — GET /diary/favorites
- [ ] `useCreateDiaryFavorite()` — POST /diary/favorites
- [ ] `useDeleteDiaryFavorite()` — DELETE /diary/favorites/:id
- [ ] `useLogFromFavorite()` — POST /diary/favorites/:id/log
- [ ] `useDiarySummary(dateFrom, dateTo)` — GET /diary/summary
- [ ] `useSymptomTrend(key, dateFrom, dateTo)` — GET /diary/symptoms/:key/trend
- [ ] Arquivo: `src/hooks/use-diary.ts`
- [ ] Typecheck passa

### US-008: Pagina do Diario — Formulario de novo registro (`/diario`)
**Descricao:** Como paciente, quero registrar um uso de forma rapida com campos estruturados e texto livre.

**Acceptance Criteria:**
- [ ] Pagina `/diario` com layout: header com titulo + botao "Novo registro"
- [ ] Modal/drawer de novo registro com sections:
  - **Quando**: date picker (default hoje) + time picker (default agora)
  - **O que**: seletor de produto (dropdown com produtos das associacoes vinculadas via API + opcao "Outro" com campo texto), metodo de administracao (chips com icones SVG: oleo, flor, vape, comestivel, topico, capsula)
  - **Quanto**: input numerico + seletor de unidade (gotas, ml, mg, g, puffs)
  - **Como estou antes** (pre-uso): multi-select chips de sintomas pre-definidos (cada um com toggle de severidade 4 niveis: nenhum/leve/moderado/severo, visual com cores: cinza/amarelo/laranja/vermelho). Opcao "+ Adicionar sintoma" para custom
  - **Efeitos sentidos** (pos-uso): multi-select chips divididos em positivos (verde) e negativos (vermelho). Opcao de preencher depois (re-avaliacao)
  - **Notas**: textarea livre opcional (placeholder: "Como foi a experiencia?")
  - **Salvar como favorito**: toggle no footer do form
- [ ] Botao "Salvar" cria a entrada via API
- [ ] Validacao: ao menos data + produto/produto custom + dose obrigatorios
- [ ] Design seguindo paleta v2 do CannHub (brand-green-deep, cream, off-white, icones SVG sem emojis)
- [ ] Responsive mobile (drawer bottom-sheet em mobile)
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-009: Pagina do Diario — Timeline/historico (`/diario`)
**Descricao:** Como paciente, quero ver meu historico de uso em uma timeline organizada por dia.

**Acceptance Criteria:**
- [ ] Secao principal da `/diario`: timeline de entradas agrupadas por dia
- [ ] Cada card de entrada mostra: horario, icone do metodo, nome do produto, dose, badges de sintomas com indicador delta (melhora/piora/sem mudanca: seta verde para baixo = melhora, seta vermelha para cima = piora), trecho das notas (truncado)
- [ ] Click no card expande/abre detalhe inline com todos os campos + opcao de editar
- [ ] Filtros no topo: periodo (7d, 30d, 90d, custom), metodo, produto, sintoma
- [ ] Paginacao infinita (scroll) ou botao "Carregar mais"
- [ ] Estado vazio: ilustracao SVG + texto "Comece registrando seu primeiro uso" + botao CTA
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-010: Quick-log via favoritos
**Descricao:** Como paciente que usa o mesmo produto diariamente, quero re-registrar com 1-2 taps usando favoritos.

**Acceptance Criteria:**
- [ ] Secao "Registros rapidos" no topo da `/diario` (abaixo do header, acima da timeline)
- [ ] Cards horizontais scrollaveis com favoritos salvos: icone do metodo + nome do produto + dose
- [ ] Tap no card abre modal pre-preenchido (so precisa confirmar horario e marcar sintomas atuais)
- [ ] Opcao de gerenciar favoritos (editar nome, excluir)
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-011: Re-avaliacao pos-uso (follow-up)
**Descricao:** Como paciente, quero re-avaliar meus sintomas apos o efeito do produto para medir eficacia.

**Acceptance Criteria:**
- [ ] Entradas com sintomas sem `severityAfter` mostram badge "Pendente re-avaliacao" na timeline
- [ ] Botao "Como estou agora?" no card da entrada — abre mini-modal com os mesmos sintomas do registro, pre-selecionados, para o paciente atualizar a severidade pos-uso
- [ ] Apos re-avaliacao, card mostra indicadores delta (ex: "Dor: moderada -> leve" com seta verde)
- [ ] Opcao de notificacao/lembrete configuravel (30min, 1h, 2h apos registro) — implementacao basica com state local, push notifications e escopo futuro
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-012: Card resumo no Dashboard (`/painel`)
**Descricao:** Como paciente, quero ver um resumo do meu diario no dashboard principal.

**Acceptance Criteria:**
- [ ] Novo card "Diario de Tratamento" no `/painel`, mesmo estilo dos cards existentes (Perfil Clinico, Documentos, Associacoes)
- [ ] Conteudo do card: total de registros no mes, ultimo registro (produto + horario + ha quanto tempo), sintoma mais rastreado, indicador geral de melhora (media dos deltas)
- [ ] Se sem registros: estado vazio com CTA "Comece seu diario"
- [ ] Link "Ver diario completo" → `/diario`
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-013: Dashboard de insights (`/diario` — aba ou secao)
**Descricao:** Como paciente, quero ver graficos e tendencias do meu tratamento.

**Acceptance Criteria:**
- [ ] Secao/aba "Insights" na pagina `/diario`
- [ ] Grafico de linha: evolucao de severidade media (before vs after) dos top 3 sintomas ao longo do tempo (ultimos 30/60/90 dias)
- [ ] Grafico de barras: distribuicao de metodos de administracao
- [ ] Card "Produto mais eficaz": produto com maior delta medio de melhora
- [ ] Card "Consistencia": dias com registro vs dias totais no periodo (ex: "18 de 30 dias")
- [ ] Usar biblioteca de graficos leve (recharts — ja popular no ecossistema React)
- [ ] Typecheck passa
- [ ] Verify in browser using dev-browser skill

### US-014: Rota e navegacao
**Descricao:** Como paciente, preciso acessar o diario facilmente.

**Acceptance Criteria:**
- [ ] Nova rota `/diario` no App.tsx com lazy loading, protegida por `ProtectedRoute`
- [ ] Link "Diario" no header/navbar (visivel apenas para users autenticados)
- [ ] Link no card do dashboard (`/painel`) apontando para `/diario`
- [ ] Scroll to top na navegacao (ja implementado globalmente)
- [ ] Typecheck passa
- [ ] `pnpm build` passa no web

## Functional Requirements

- **FR-1:** O sistema deve permitir criar uma entrada de diario com: data, horario, produto (da associacao vinculada OU manual), metodo de administracao, dose (quantidade + unidade), sintomas com severidade pre-uso (4 niveis), efeitos sentidos (positivos/negativos), e notas livres
- **FR-2:** O sistema deve permitir re-avaliar sintomas apos o uso (severityAfter), gerando delta de melhora/piora
- **FR-3:** O sistema deve exibir historico em timeline agrupada por dia, com filtros por periodo, metodo, produto e sintoma
- **FR-4:** O sistema deve permitir salvar combinacoes frequentes como favoritos e criar entradas a partir deles (quick-log)
- **FR-5:** O sistema deve calcular e exibir insights: tendencia de sintomas, produto mais eficaz, distribuicao de metodos, consistencia de uso
- **FR-6:** O sistema deve exibir card resumo no dashboard existente (`/painel`) com metricas do mes
- **FR-7:** Todos os endpoints do diario devem ser protegidos por JWT — paciente so acessa seus proprios dados
- **FR-8:** Produto pode ser selecionado da lista de associacoes vinculadas (via `PatientAssociationLink` + `Product` existentes) OU cadastrado manualmente (campo texto livre para importados/manipulados)
- **FR-9:** Sintomas pre-definidos: dor, ansiedade, insonia, nausea, inflamacao, fadiga, depressao, perda de apetite, cefaleia, espasmo muscular, estresse, TEPT. Paciente pode adicionar custom
- **FR-10:** Efeitos pre-definidos positivos: relaxado, alivio de dor, sonolento, calmo, focado, euforico, fome, criativo, energizado. Negativos: boca seca, tontura, paranoia, ansioso, cefaleia, nausea, sonolencia excessiva, olhos vermelhos. Paciente pode adicionar custom
- **FR-11:** Escalas de severidade usam 4 niveis (none/mild/moderate/severe) — nao escala 0-10 — para consistencia e rapidez de input (referencia Bearable)
- **FR-12:** UI segue design system v2 do CannHub: paleta brand-green, icones SVG inline (sem emojis), DM Sans/DM Serif Display, cards rounded-card, responsive mobile

## Non-Goals (Out of Scope)

- **Acesso do medico/prescritor** ao diario do paciente — escopo futuro (Fase 2: painel prescritor com link compartilhavel ou exportacao PDF)
- **Notificacoes push** reais (requer service worker) — apenas lembrete visual no app por agora
- **Integracao com dispositivos** (wearables, smartwatch)
- **Tracking de outros medicamentos** alem de cannabis (pode ser escopo futuro inspirado no Bearable)
- **Correlacoes automaticas** entre fatores (ex: "nos dias que voce usou X, dor foi 40% menor") — escopo de Fase 2 com mais dados acumulados
- **Gamificacao** (streaks, badges)
- **Modo offline** (progressive web app)
- **Auto-cadastro de produtos** fora das associacoes (o campo manual e texto livre, nao cria Product no banco)

## Design Considerations

### Layout da pagina `/diario`

```
+--------------------------------------------------+
|  HEADER: "Diario de Tratamento"  [+ Novo registro]|
+--------------------------------------------------+
|  QUICK-LOG: [Fav 1] [Fav 2] [Fav 3] →           |
+--------------------------------------------------+
|  FILTROS: [7d] [30d] [90d] [Custom]  [Metodo ▼]  |
+--------------------------------------------------+
|  TABS: [ Timeline | Insights ]                    |
+--------------------------------------------------+
|                                                    |
|  === Hoje, 06 Abr ===                             |
|  ┌──────────────────────────────────┐             |
|  │ 08:30  🫒 Oleo CBD 30mg/ml       │  <- icone  |
|  │        3 gotas | Dor: mod→leve ↓│    SVG      |
|  │        "Tomei antes do cafe..."  │             |
|  └──────────────────────────────────┘             |
|                                                    |
|  === Ontem, 05 Abr ===                            |
|  ┌──────────────────────────────────┐             |
|  │ 22:00  💨 Vape CBD              │             |
|  │        2 puffs | Insonia: sev→lv│             |
|  │        ⚠ Pendente re-avaliacao   │             |
|  └──────────────────────────────────┘             |
+--------------------------------------------------+
```

### Formulario de novo registro (modal/drawer)

```
+--------------------------------------------------+
|  Novo Registro                            [X]     |
+--------------------------------------------------+
|  QUANDO                                           |
|  [06/04/2026]  [08:30]                            |
+--------------------------------------------------+
|  O QUE                                            |
|  Produto: [Oleo CBD 30mg/ml - Alianca ▼]         |
|  Metodo:  (o) Oleo  ( ) Flor  ( ) Vape  ...     |
+--------------------------------------------------+
|  QUANTO                                           |
|  [3] [gotas ▼]                                    |
+--------------------------------------------------+
|  COMO ESTOU ANTES                                 |
|  [Dor ●●●○] [Ansiedade ●●○○] [+ Sintoma]        |
+--------------------------------------------------+
|  EFEITOS SENTIDOS (opcional, preencha depois)     |
|  Positivos: [Relaxado] [Alivio dor] [+ Outro]    |
|  Negativos: [Boca seca] [+ Outro]                |
+--------------------------------------------------+
|  NOTAS (opcional)                                 |
|  [                                      ]         |
+--------------------------------------------------+
|  [ ] Salvar como favorito                         |
|            [Salvar registro]                      |
+--------------------------------------------------+
```

### Componentes reutilizaveis a criar
- `SeveritySelector` — 4 circulos com cores (cinza/amarelo/laranja/vermelho) para selecao de severidade
- `SymptomChip` — chip com nome + indicador de severidade, clicavel
- `EffectChip` — chip verde (positivo) ou vermelho (negativo)
- `MethodSelector` — chips com icones SVG por metodo de administracao
- `DiarySummaryCard` — card para o dashboard
- `DiaryEntryCard` — card da timeline
- `QuickLogBar` — barra horizontal de favoritos

### Icones SVG necessarios (estilo Feather/Lucide, strokeWidth 1.5)
- Oleo (droplet), Flor (flower), Vape (wind/cloud), Comestivel (cookie), Topico (hand), Capsula (pill)
- Seta melhora (trending-down, verde), Seta piora (trending-up, vermelho), Sem mudanca (minus, cinza)
- Diario (book-open), Favorito (star), Insights (bar-chart-2)

## Technical Considerations

### Backend
- Novo modulo `diary` em `src/domain/diary/` seguindo a mesma estrutura DDD (enterprise/entities + application/use-cases + repositories)
- Repository abstrato `DiaryEntriesRepository` com implementacao Prisma
- Mappers: `DiaryEntryMapper`, `DiarySymptomLogMapper`, `DiaryEffectLogMapper`
- Factories para testes: `makeDiaryEntry()`, `makeDiarySymptomLog()`, `makeDiaryFavorite()`
- In-memory repo para unit tests
- Paginacao: cursor-based ou offset (alinhar com padrao existente)
- O use case `CreateDiaryEntry` deve validar que o `productId` (se informado) pertence a uma associacao vinculada ao paciente (via `PatientAssociationLink`)

### Frontend
- Pagina com lazy loading (React.lazy) como todas as outras
- React Query para cache e invalidacao
- Biblioteca de graficos: `recharts` (leve, React-native, boa DX) — instalar como dependencia
- Formulario: React Hook Form ou controlled components (alinhar com padrao existente no projeto)
- Mobile: drawer de formulario como bottom-sheet (css-only com translate-y)

### Relacao com entidades existentes
- `DiaryEntry.userId` → `User.id` (relacao direta, sem passar por Patient)
- `DiaryEntry.productId` → `Product.id` (opcional — permite produtos manuais)
- Para listar produtos disponiveis no seletor: reusar logica de `PatientAssociationLink` + `Product` ja existente

### Performance
- Timeline com paginacao (20 entradas por pagina)
- Insights calculados no backend (nao enviar todos os registros para o frontend agregar)
- Indices no Prisma: `DiaryEntry(userId, date)`, `DiarySymptomLog(diaryEntryId)`

## Success Metrics

- Pacientes conseguem registrar um uso em menos de 60 segundos (com quick-log: menos de 15 segundos)
- Taxa de re-avaliacao (severityAfter preenchido) acima de 50% das entradas
- Pacientes ativos registram ao menos 3 entradas por semana em media
- Dashboard de insights carrega em menos de 2 segundos
- Zero regressao nos testes existentes (`pnpm test`, `pnpm build`)

## Open Questions

1. **Lembrete de re-avaliacao**: implementar com setTimeout local no frontend por agora, ou ja planejar infra de notificacao (push/email)?
2. **Exportacao para medico**: quando entrar no roadmap? Formato preferido — PDF com graficos ou link compartilhavel com token temporario?
3. **Historico de produtos manuais**: vale criar uma entidade `CustomProduct` para o paciente reusar produtos manuais ja cadastrados, ou texto livre e suficiente?
4. **Limites**: existe limite maximo de entradas por dia? (ex: para evitar abuso de API)
5. **LGPD**: dados do diario sao dados sensiveis de saude — precisamos de consentimento explicito adicional alem do aceite de termos no cadastro?
6. **Grafico de tendencias**: usar recharts ou outra lib? Verificar se o projeto ja tem alguma dependencia de graficos.

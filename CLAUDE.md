# CannHub — Referência do Projeto

## O que é

Plataforma que conecta pacientes de cannabis medicinal a associações brasileiras. Três lados: pacientes, associações e admin. O diferencial é viabilizar o acesso real ao medicamento com segurança jurídica e documental.

## Monorepo

```
cannahub/
├── apps/
│   ├── api/         # NestJS — Clean Architecture + DDD
│   └── web/         # React 19 + Vite + Tailwind
├── packages/
│   └── shared/      # Tipos, enums, schemas Zod compartilhados (19 enums)
├── docker-compose.yml          # Dev: Postgres (:5432) + Redis (:6379)
└── pnpm-workspace.yaml
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript, PostgreSQL + Prisma (adapter-pg) |
| Frontend | React 19 + Vite + Tailwind, Zustand + React Query |
| Auth | JWT + Passport, RBAC com roles hierárquicas + PermissionsGuard |
| AI | Anthropic Claude Haiku (extração de campos clínicos) |
| Segurança | Helmet (headers), bcryptjs para hashing |
| Infra | Docker (Postgres + Redis) |

## Regras de desenvolvimento

- **Sempre rodar testes antes de finalizar alterações**: `pnpm test` (unit) e `pnpm test:e2e` (e2e) no apps/api, `pnpm build` no apps/web
- **Labels centralizados**: toda label de exibição (status, tipos, condições) vive em `apps/web/src/constants/labels.ts` — nunca duplicar em páginas
- **Sem hacks**: não usar `hydrate()` como workaround, não duplicar campos (ex: `status` + `accountStatus`), não usar `as any`
- **Sem emojis**: usar SVG inline (Feather/Lucide, strokeWidth 1.3-1.6) em vez de emojis — evitar aparência de IA
- **Imagens em WebP**: converter toda imagem para WebP (cwebp -q 80) antes de usar no frontend
- **RBAC no backend**: segurança vem de `@UseGuards(JwtAuthGuard, PermissionsGuard)` + `@RequirePermission()`, não de separação de projetos
- **Either pattern**: use cases retornam `Either<Error, Result>`, nunca lançam exceções

## Docker & Infraestrutura

### Dev (raiz: docker-compose.yml)
```bash
docker compose up -d              # Sobe Postgres + Redis
```
| Service | Container | Porta | Credenciais | DB |
|---------|-----------|-------|-------------|-----|
| postgres | cannahub-postgres | 5432 | cannahub_user:cannahub_password | cannahub_db |
| redis | cannahub-redis | 6379 | — | — |

### Testes E2E (apps/api/docker-compose.test.yml)
```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d   # Sobe Postgres de teste
pnpm test:e2e                                      # Roda E2E (porta 8239)
```
| Service | Container | Porta | Credenciais | DB |
|---------|-----------|-------|-------------|-----|
| postgres-test | auth-postgres-test | 8239 | auth_test_user:auth_test_password | auth_test_db |

### Legacy (apps/api/docker-compose.yml) — NÃO usar para dev
Docker-compose antigo do projeto auth-min. Porta 8238. O dev usa o da raiz (porta 5432).

### Variáveis de ambiente

**apps/api/.env** (dev):
```
DATABASE_URL="postgresql://cannahub_user:cannahub_password@localhost:5432/cannahub_db"
JWT_SECRET="cannahub-dev-jwt-secret-key-min-32-chars"
SECRET_ENCRYPTION_KEY="cannahub-dev-encryption-key-min-32-chars"
PORT=3000
```

**apps/api/.env.test** (E2E):
```
DATABASE_URL="postgresql://auth_test_user:auth_test_password@localhost:8239/auth_test_db"
JWT_SECRET="test-jwt-secret-key-with-32-characters-minimum"
SECRET_ENCRYPTION_KEY="test-encryption-key"
PORT=3001
```

## Comandos

```bash
# Raiz
docker compose up -d              # Sobe Postgres + Redis

# API (cd apps/api)
pnpm dev                          # Dev server (port 3000)
pnpm build                        # Compile TypeScript
pnpm test                         # 192 unit tests (Vitest)
pnpm test:e2e                     # 46 E2E tests (precisa docker-compose.test.yml + apps/api/.env.test)
pnpm prisma:generate              # Gera Prisma client
npx prisma db push                # Sync schema com DB

# Web (cd apps/web)
pnpm dev                          # Vite dev server (port 5173, proxy /api → :3000)
pnpm build                        # tsc + vite build
```

## Fluxo principal do paciente

```
Cadastro (/cadastro)  →  Acolhimento (/acolhimento)  →  Documentos (/documentos)  →  Painel (/painel)
  tipo de conta            perfil clínico (5-6 steps)     upload 4 docs                 visão consolidada
  + dados básicos          condição, experiência,         receita, laudo,               status cadastro,
  + login automático       [acesso atual*], receita,      RG/CNH, comprovante           perfil clínico,
                           forma de uso, assistido                                      docs, associações

* Step condicional: "Como você acessa cannabis atualmente?" — aparece só quando experiência !== 'never'
```

## Rotas do frontend (24 páginas)

| Rota | Página | Auth | Guard |
|------|--------|------|-------|
| `/` | Home (landing v2 — hero dark, 5 etapas, cards com fotos WebP) | Não | — |
| `/quiz` | Triagem (4 perfis com ícones SVG) | Não | — |
| `/cadastro` | Registro (2 steps: tipo + dados) | Não | — |
| `/login` | Login | Não | — |
| `/acolhimento` | Onboarding (5-7 steps, multi-select, step condicional de dependente p/ guardian/caregiver) | Sim | ProtectedRoute |
| `/documentos` | Upload de documentos | Sim | ProtectedRoute |
| `/painel` | Dashboard do paciente (associações + card resumo do diário) | Sim | ProtectedRoute |
| `/diario` | Diário de Tratamento (timeline + insights, follow-ups, quick-log) | Sim | ProtectedRoute |
| `/tratamentos` | Hub de tratamentos v2 (filter chips, grid assimétrico, proof cards) | Não | — |
| `/tratamentos/categoria/:slug` | Categoria de tratamento (neurológicas, saúde mental, dor, oncologia) | Não | — |
| `/tratamentos/:slug` | Detalhe por condição (barra nav, hero com stat, sidebar TOC) | Não | — |
| `/legislacao` | Legislação v2 (timeline editorial, FAQ accordion, sidebar) | Não | — |
| `/catalogo` | Catálogo unificado (ícones SVG por tipo, sem emojis) | Não | — |
| `/medicos` | Diretório de médicos (filtros: estado, especialidade, modalidade) | Não | — |
| `/medicos/:slug` | Perfil do médico | Não | — |
| `/associacoes` | Associações v2 (search bar, sidebar filtros, cards expandidos) | Não | — |
| `/associacoes/:slug` | Detalhe da associação (vínculo dinâmico, serviços contextuais, produtos da API) | Não | — |
| `/associacoes/:slug/catalogo` | Catálogo da associação (preço restrito a aprovados, ícones SVG) | Não | — |
| `/associacao/painel` | Painel associação — dashboard métricas | Sim | AssociationRoute (role: association) |
| `/associacao/produtos` | Painel associação — CRUD produtos (cards por categoria, edição inline) | Sim | AssociationRoute |
| `/associacao/associados` | Painel associação — gestão de vínculos (aprovar/rejeitar/remover) | Sim | AssociationRoute |
| `/associacao/perfil` | Painel associação — edição perfil + config anuidade | Sim | AssociationRoute |
| `/admin/usuarios` | Painel admin — lista de usuários | Sim | AdminRoute (role: admin) |
| `/admin/usuarios/:id` | Painel admin — detalhe do usuário | Sim | AdminRoute (role: admin) |

### Guards do frontend
- **ProtectedRoute**: verifica `isAuthenticated`, redireciona para `/cadastro`
- **AssociationRoute**: verifica `isAuthenticated` + `user.roles.includes('association')`, redireciona para `/painel`
- **AdminRoute**: verifica `isAuthenticated` + `user.roles.includes('admin')`, redireciona para `/painel`

## Endpoints da API

### Auth
- `POST /auth/user` — registro (público, retorna tokens + user)
- `POST /login` — login (público, retorna tokens + user)
- `GET /auth/me` — dados do user logado + roles + status granulares (JWT)
- `POST /auth/refresh` — refresh token (público)
- `DELETE /auth/user/:id` — deletar conta
- `POST /logout/:userId` — revogar todos devices
- `DELETE /revoke-device-session` — revogar sessão
- `PUT /auth/profile` — atualizar perfil (name, phone, cpf) (JWT)

### RBAC
- `POST /roles` — criar role
- `GET /roles` — listar roles
- `POST /roles/assign` — atribuir role
- `DELETE /roles/remove` — remover role
- `POST /permissions` — criar permissão
- `GET /permissions` — listar permissões

### Onboarding
- `POST /onboarding/start` — iniciar sessão (+ atualiza user.onboardingStatus → in_progress)
- `PATCH /onboarding/step` — submeter step (1-6, step 6 = currentAccessMethod condicional)
- `POST /onboarding/complete` — completar (+ atualiza user.onboardingStatus → completed)
- `GET /onboarding/summary` — resumo (inclui currentAccessMethod)
- `POST /onboarding/escalate` — escalar pra humano
- `POST /onboarding/extract` — extrair campos com IA
- `POST /onboarding/dependent` — cadastrar dependente (JWT, guardian/caregiver; nome, nascimento, documento, relationshipType)
- `GET /onboarding/dependents` — listar dependentes do responsável logado (JWT)

### Diário de Tratamento (JWT — paciente só acessa o próprio)
- `POST /diary` — criar entrada (produto, dose, método, sintomas com `severityBefore` 0-10 NRS)
- `GET /diary` — listar entradas (filtros: dateFrom/dateTo, productId, administrationMethod, symptomKey, targetCondition; paginado)
- `GET /diary/:id` — detalhe (sintomas + follow-ups aninhados)
- `PATCH /diary/:id` — atualizar entrada (notes, isFavorite, etc.)
- `DELETE /diary/:id` — excluir entrada
- `POST /diary/favorites` · `GET /diary/favorites` · `DELETE /diary/favorites/:id` — templates de quick-log
- `POST /diary/favorites/:id/log` — criar entrada a partir de um favorito
- `POST /diary/entries/:id/follow-ups` — re-avaliação pós-uso (`severityAfter`, efeitos, tags) — N follow-ups por entrada
- `PATCH /diary/follow-ups/:id` · `DELETE /diary/follow-ups/:id` — editar/excluir follow-up
- `GET /diary/summary` — resumo (sintomas frequentes, produto mais usado, deltas antes→depois, distribuição por método)
- `GET /diary/symptoms/:key/trend` — tendência de um sintoma ao longo do tempo

> ⚠️ Ordem importa no `http.module.ts`: as rotas estáticas (`/diary/summary`, `/diary/favorites`, `/diary/entries/*`, `/diary/follow-ups/*`) devem ser registradas ANTES do catch-all `/diary/:id`, senão o Express casa `:id="summary"` e retorna 404.

### Diretório de Médicos (público)
- `GET /doctors` — listar médicos (filtros: state, specialty, modalidade)
- `GET /doctors/:slug` — perfil do médico

### Associations & Documents (público)
- `GET /associations` — listar associações (@Public, filtros: region, state, hasAssistedAccess)
- `GET /associations/:id` — detalhe associação (@Public)
- `GET /associations/:id/products` — produtos com variantes da associação (@Public)
- `GET /associations/:id/product-types` — tipos de produto da associação (@Public)
- `POST /associations/:id/link` — paciente solicita vínculo (JWT, cria Patient se não existir)
- `GET /my-links` — vínculos do paciente logado com nome da associação + `documentsShared` (JWT)
- `PATCH /my-links/:id/share-documents` — paciente liga/desliga compartilhamento de docs com a associação (JWT, body `{ share }`, só vínculo ativo)
- `GET /documents` — listar documentos do user (JWT)

### Painel da Associação (requer role association + permissões)
- `GET /association/dashboard` — métricas (membros, pendentes, produtos) — `association_profile:read`
- `GET /association/products` — listar produtos com variantes — `association_catalog:read`
- `POST /association/products` — criar produto + variantes — `association_catalog:create`
- `PATCH /association/products/:id` — atualizar produto + substituir variantes — `association_catalog:update`
- `DELETE /association/products/:id` — excluir produto — `association_catalog:delete`
- `GET /association/members` — listar vínculos (filtro por status, inclui `documentsShared`) — `association_members:read`
- `GET /association/members/:id/documents` — documentos compartilhados pelo paciente (nome + docs); só se `documentsShared` e vínculo ativo — `association_documents:read`
- `PATCH /association/members/:id/approve` — aprovar vínculo — `association_members:update`
- `PATCH /association/members/:id/reject` — rejeitar vínculo — `association_members:update`
- `DELETE /association/members/:id` — cancelar membro ativo — `association_members:update`
- `GET /association/profile` — perfil da associação — `association_profile:read`
- `PATCH /association/profile` — atualizar perfil + config anuidade — `association_profile:update`

### Admin (requer role admin + permissões)
- `GET /admin/users` — listar usuários (filtros, busca, paginação) — `admin_users:read`
- `GET /admin/users/:id` — detalhe completo (user + onboarding + documents) — `admin_users:read`
- `PATCH /admin/users/:id/status` — aprovar/rejeitar paciente — `admin_users:update`
- `DELETE /admin/users` — excluir usuários em massa (body: `{ userIds }`) — `admin_users:update`
- `PATCH /admin/documents/:id/approve` — aprovar documento (cascade → documentsStatus) — `admin_documents:update`
- `PATCH /admin/documents/:id/reject` — rejeitar documento (body: `{ reason }`) — `admin_documents:update`

## RBAC — Roles e Permissões

### Roles existentes
| Role | Slug | Level | Descrição |
|------|------|-------|-----------|
| Admin | `admin` | 100 | Acesso ao painel de aprovação |
| Association | `association` | 50 | Acesso ao painel de gestão da associação |

### Permissões existentes
| Permissão | Resource | Action |
|-----------|----------|--------|
| `admin_users:read` | admin_users | read |
| `admin_users:update` | admin_users | update |
| `admin_documents:read` | admin_documents | read |
| `admin_documents:update` | admin_documents | update |
| `association_catalog:read` | association_catalog | read |
| `association_catalog:create` | association_catalog | create |
| `association_catalog:update` | association_catalog | update |
| `association_catalog:delete` | association_catalog | delete |
| `association_members:read` | association_members | read |
| `association_members:update` | association_members | update |
| `association_documents:read` | association_documents | read |
| `association_profile:read` | association_profile | read |
| `association_profile:update` | association_profile | update |

### Seeds
```bash
cd apps/api
npx tsx prisma/seed-admin-user.ts                    # Cria admin adm@teste.com + role + permissões
npx tsx prisma/seed-admin.ts email@ex.com            # Promove user existente para admin
npx tsx prisma/seed-association-user.ts               # Cria associacaoalianca@teste.com + Aliança Medicinal + role
npx tsx prisma/seed-association-user.ts email assocId  # Promove user existente para association
npx tsx prisma/seed-products.ts                       # Cria 12 produtos da Aliança Medicinal
npx tsx prisma/seed-amme-products.ts                  # Cria AMME Medicinal + 18 produtos
npx tsx prisma/seed-amme-user.ts                      # Cria admamme@teste.com + director AMME
npx tsx prisma/seed-diary.ts                          # Popula diário de paciente@teste.com (senha abc123): 5 entradas + 6 follow-ups + favorito
```

### Tipos de usuário
| Tipo | accountType | Role | Acesso |
|------|-------------|------|--------|
| Paciente | patient | — | /painel, /acolhimento, /documentos |
| Responsável Legal | guardian | — | Idem (gerencia dependentes) |
| Cuidador | caregiver | — | Idem |
| Prescritor | prescriber | — | Futuro: painel de prescrições |
| Veterinário | veterinarian | — | Futuro: painel veterinário |
| Associação | — | association | /associacao/* (painel, produtos, associados, perfil) |
| Admin CannHub | — | admin | /admin/* |

## Entidades principais (Prisma)

```
User → accountType, accountStatus, onboardingStatus, documentsStatus
       onboardingStatus: not_started | in_progress | completed
       documentsStatus: not_submitted | pending_review | approved | rejected
OnboardingSession → perfil clínico (condition, experience, currentAccessMethod, preferredForm, hasPrescription, assistedAccess)
Document → tipo, URL S3, status (pending/approved/rejected), motivo rejeição, reviewedBy
Association → name, cnpj, status, description, region, state, city, profileTypes[], hasAssistedAccess, contact, logoUrl, membershipFee, membershipPeriod, membershipDescription
AssociationMember → associationId + userId, role (staff/manager/director), status
PatientAssociationLink → associationId + patientId, requestedBy/approvedBy, startDate/endDate, status, feeStatus, feeExpiresAt, feePaidAt, documentsShared/documentsSharedAt (consentimento do paciente p/ associação ver docs)
Product → associationId, name, description, type, category, concentration, cbd, thc, dosagePerDrop, inStock, imageUrl
ProductVariant → productId, volume, price (Decimal 10,2)
DiaryEntry → userId, date, time, productId?/customProductName, administrationMethod, doseAmount/doseUnit, targetCondition, isFavorite
DiarySymptomLog → diaryEntryId, symptomKey, severityBefore (0-10 NRS)        ← estado ANTES do uso
DiaryFollowUp → diaryEntryId, evaluatedAt, notes, tags[]                      ← re-avaliação pós-uso (N por entrada)
DiaryFollowUpSymptom → followUpId, symptomLogId, severityAfter (0-10)         ← estado DEPOIS (delta de eficácia)
DiaryEffectLog → followUpId, effectKey, isPositive                            ← efeitos (só fazem sentido pós-uso)
DiaryFavorite → userId, name, produto/dose, symptomKeys[]                     ← template de quick-log
Doctor → slug, name, crm, state, city, specialties[], telemedicine, inPerson, bio (diretório público)
Patient, Dependent, ProfessionalProfile → domínio de pacientes
Role → name, slug, level, assignableRoles
Permission → name, slug, resource, action
UserRole → userId + roleId (junction)
RolePermission → roleId + permissionId (junction)
Device, LoginHistory, AuditLog → tracking de segurança
```

## Frontend — Arquitetura

### Labels centralizados
**Arquivo**: `apps/web/src/constants/labels.ts`

Contém TODOS os mapas de labels (ACCOUNT_TYPE_LABELS, CONDITION_LABELS, etc.), a função `formatMultiSelect()`, e as cores de badges. Nunca duplicar em páginas.

### Auth Store (Zustand)
**Arquivo**: `apps/web/src/stores/auth-store.ts`

Interface `User`: `{ id, email, name?, accountType?, accountStatus?, onboardingStatus?, documentsStatus?, verificationStatus?, phone?, cpf?, roles? }`

Fluxo de login:
1. `POST /login` → recebe tokens
2. `GET /auth/me` → recebe perfil completo (com roles)
3. `store.login()` → salva tudo de uma vez

### Hooks (React Query)
| Hook | Arquivo | Endpoints |
|------|---------|-----------|
| useLogin, useRegister | use-auth.ts | POST /login, POST /auth/user, GET /auth/me |
| useOnboardingSummary, etc. | use-onboarding.ts | GET/POST/PATCH onboarding/* |
| useUpdateProfile | use-profile.ts | PUT /auth/profile |
| useAddress, useSaveAddress | use-address.ts | GET/PUT /auth/address |
| useAdminUsers, useAdminUserDetail, useApproveDocument, useRejectDocument, useUpdateUserStatus, useDeleteUsers | use-admin.ts | GET/PATCH/DELETE /admin/* |
| useAssociationProducts, useAssociationProductTypes, useMyLinks, useRequestAssociationLink | use-association-link.ts | GET /associations/:id/products, /product-types, /my-links, POST /associations/:id/link |

## Design System — v2 (redesign março 2026)

### Fontes
- **Headlines/Logo**: DM Serif Display (serif)
- **Body/UI**: DM Sans

### Paleta (atualizada — tons mais escuros e firmes)
```
green-deep: #192F1A    green-mid: #25461E    green-light: #3D6A27
green-pale: #E6F0DA    green-xs: #B8D09A
cream: #EDE7DA         cream-dark: #DDD4C3   cream-darker/sand: #BDB2A0
off/white: #F7F3EC
text: #141F14          text-md: #314230      muted: #5C7260     text-xs: #8A9C8C
```

### Tints por categoria (tratamentos)
```
Neurológicas: #EBF2E1    Saúde mental: #E8EEF7
Dor: #F5EDEA             Oncologia: #EEE9F5
```

### Padrões visuais
- Navbar full-width fixa, `backdrop-blur-[16px]`, `max-w-[1100px]`
- Logo: folha SVG preenchida (#192F1A) + serif "CannHub"
- Ícones: SVG inline `strokeWidth="1.5-1.7"` (Feather/Lucide)
- Botões: `rounded-[8px]` (primary) e `rounded-btn` (pill), sombras leves
- Hero sections: `bg-brand-green-deep` com texto decorativo em opacity 3-4%
- Seções alternadas: bg-off → bg-cream → bg-verde → bg-off
- Cards com rounded-card (18px), hover com translateY e shadow
- Lazy loading em todas as páginas (code splitting)

## Regras de negócio importantes

- **accountType vive só no User** — coletado no cadastro, NÃO duplicado na OnboardingSession
- **Preços no catálogo**: visíveis apenas para `accountStatus === 'approved'`
- **Vínculo com associação**: opcional — algumas associações não exigem vínculo/taxa, basta conta aprovada
- **Documentos**: admin sempre vê; associação só vê se o paciente **consentir** (toggle `documentsShared` no vínculo ativo, via `PATCH /my-links/:id/share-documents`) — opt-in revogável a qualquer momento
- **Dependentes**: coletados em step condicional do onboarding (`/acolhimento`), exibido só quando `accountType ∈ {guardian, caregiver}`; persistidos em `Dependent` via `POST /onboarding/dependent` (gate é frontend-only, igual ao step `currentAccessMethod`)
- **Onboarding multi-select**: condições e formas de uso aceitam múltiplas seleções (armazenadas como string separada por vírgula)
- **JwtAuthGuard NÃO é global** — cada controller precisa `@UseGuards(JwtAuthGuard)` ou `@Public()`
- **Sync de status**: StartOnboarding → onboardingStatus='in_progress', CompleteOnboarding → onboardingStatus='completed'
- **Cascade de docs**: ApproveDocument verifica se todos docs do user estão aprovados → documentsStatus='approved'; RejectDocument → documentsStatus='rejected'

## Testes

### Unit tests (192 — Vitest)
```bash
cd apps/api && pnpm test
```
Usam in-memory repositories + factories (makeUser, makeDocument, etc.). Sem banco.

### E2E tests (46 — Vitest + Supertest)
```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d   # Primeiro: sobe Postgres teste
pnpm test:e2e
```
Requerem Postgres na porta 8239 **e** `apps/api/.env.test` (gitignored — ver seção Variáveis de ambiente). `setup-e2e.ts` roda `prisma db push` antes dos testes. Os 2 arquivos e2e rodam **sequencialmente** (`fileParallelism: false`) por compartilharem o mesmo banco.

### Frontend
```bash
cd apps/web && pnpm build    # Type-check + Vite build (verifica compilação)
```

## Roadmap

### Fase 1 — MVP (concluída)
Auth, cadastro, onboarding, documentos, catálogo por associação, tratamentos (8 condições + 4 categorias), legislação, dashboard paciente, painel admin de aprovação, redesign v2 completo (home, tratamentos, legislação, associações)

### Fase 1.5 — Painel da Associação (concluída)
Backend: 13 use cases, 14 controllers, 12 endpoints, role association + 8 permissões, Product/ProductVariant no Prisma, anuidade configurável. Frontend: 4 páginas (dashboard, produtos, associados, perfil), guard AssociationRoute, hooks React Query, botão Solicitar Vínculo funcional, dashboard paciente com vínculos, serviços CannHub contextuais. Seed: Aliança Medicinal com 12 produtos.

### Fase 1.6 — Diário de Tratamento (concluída)
Backend: módulo `diary` (DDD) — 6 modelos Prisma, 14 use cases, 14 endpoints; modelo **antes + multi follow-up** com severidade 0-10 NRS, favoritos, resumo e tendência. Frontend: rota `/diario` (timeline + aba Insights com Recharts lazy-loaded), 12 componentes, card resumo no `/painel`. Testes: specs unitários de follow-up + e2e completo (46 e2e). Seed: `prisma/seed-diary.ts`.

### Fase 2 — Conteúdo (próxima)
Blog, diretório médicos/advogados, eventos, SEO, auto-cadastro associações

### Fase 3 — Transação
Pagamento com split (iugu), pedidos, inteligência de mercado

## Próximos passos

### Painel da Associação (concluído)
- [x] Painel da associação (`/associacao/painel`) — dashboard com métricas
- [x] Gestão de catálogo — CRUD de produtos (cards por categoria, edição inline, variantes)
- [x] Gestão de associados — listar, aprovar/rejeitar vínculo, remover associado, filtro por status
- [x] Cobrança de vínculo — anuidade configurável por associação (valor, periodicidade, status pagamento)
- [x] Edição de perfil da associação — textos, contato, descrição, config anuidade
- [x] Role `association` no RBAC — guard AssociationRoute + 8 permissões
- [x] Botão Solicitar Vínculo funcional (cria Patient + link, trata erros PT-BR)
- [x] Dashboard paciente mostra associações vinculadas com status
- [x] Produtos disponíveis dinâmicos (API, fallback sample data)
- [x] Card Serviços CannHub contextual por status do paciente
- [x] Seed: Aliança Medicinal (ID fixo) + 12 produtos + user associacaoalianca@teste.com

### Frontend
- [x] Perfil individual da Associação — `/associacoes/:slug`
- [x] Conectar Quiz → Cadastro (passar tipo via URL param)
- [x] Responsividade mobile (menu hamburger)
- [x] CTAs contextuais (serviços CannHub)
- [x] Step condicional no onboarding
- [x] Catálogo por associação com controle de acesso
- [x] Página de tratamentos com referências científicas
- [x] Multi-select no onboarding
- [x] Scroll to top em navegação
- [x] Página de legislação (/legislacao)
- [x] Painel admin de aprovação (/admin/usuarios)
- [x] Exclusão de usuários em massa (admin)
- [x] Labels centralizados (constants/labels.ts)
- [x] Lazy loading / code splitting (todas as páginas)
- [x] Redesign v2 — Home (hero dark, 5 etapas, cards com fotos WebP, sem emojis)
- [x] Redesign v2 — Tratamentos hub (hero 2 colunas, filter chips, grid assimétrico, proof cards)
- [x] Redesign v2 — Tratamento detalhe (barra de condições, hero com stat, sidebar TOC)
- [x] Redesign v2 — Tratamento categoria (4 categorias, hero com tint, endocannabinoid context)
- [x] Redesign v2 — Legislação (timeline editorial, FAQ accordion, sidebar)
- [x] Redesign v2 — Associações (search bar, sidebar filtros, cards expandidos)
- [x] Dados de tratamentos centralizados (src/data/treatments.ts — 8 condições + treatment-categories.ts — 4 categorias)
- [x] SVGs ilustrativos por condição (public/treatments/) + imagens WebP nos cards
- [x] Ícones SVG no catálogo e quiz (substituiu emojis)
- [ ] Upload real de documentos (S3)
- [x] Integrar catálogo com API real (substituiu sample-products.ts → GET /associations/:id/products)
- [x] Diretório de médicos (/medicos) + perfil (/medicos/:slug)
- [ ] Páginas de detalhe para novas condições (artrite, endometriose, náuseas quimio, dor oncológica)

### Segurança (próximos passos)
- [x] Helmet: headers de segurança (HSTS, X-Frame-Options, X-Content-Type-Options, etc.) — CSP desativado em dev
- [x] CORS: whitelist via `ALLOWED_ORIGINS` (dev reflete a origem; prod bloqueia se não configurado) — `main.ts`
- [x] Rate limiting: `@nestjs/throttler` — 100/min global, 5/min no login e registro, `skipIf` em ambiente de teste
- [x] Refresh token rotation: revoga o token apresentado e emite um novo (jti único) no `/auth/refresh`
- [ ] Migrar JWT de localStorage para httpOnly cookies (requer ajuste backend + frontend)
- [ ] CSP headers no frontend (meta tag no index.html)
- [ ] Account lockout após N tentativas falhadas
- [ ] Upload S3: validar MIME type, limitar tamanho, gerar UUID como nome, URLs assinadas com expiração curta

### Backend
- [x] Controllers: associations (list, get by id), documents (list), update profile
- [x] Status granulares: onboardingStatus, documentsStatus no User
- [x] Painel admin: list, detail, approve/reject docs, approve/reject user, delete
- [x] Seed de permissões e user admin
- [x] Módulo completo de associações: CRUD produtos, gestão de membros, configuração de anuidade
- [x] Endpoint de vínculo com associação (POST /associations/:id/link) + GET /my-links
- [x] Role `association` + 8 permissões (association_catalog:*, association_members:*, association_profile:*)
- [x] Modelos Prisma: Product, ProductVariant, campos de anuidade/fee
- [x] 13 use cases + 30 testes unitários novos (total: 123)
- [x] Seed: Aliança Medicinal (12 produtos) + user associacaoalianca@teste.com
- [x] Mensagens de erro em PT-BR
- [x] Seed: AMME Medicinal (18 produtos) + user admamme@teste.com
- [x] Endpoints de médicos (GET /doctors, GET /doctors/:slug)
- [ ] Notificações por e-mail (Resend)
- [ ] Upload S3 com URLs assinadas

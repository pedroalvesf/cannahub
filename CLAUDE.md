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
| Infra | Docker (Postgres + Redis), bcryptjs para hashing |

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
pnpm test                         # 93 unit tests (Vitest)
pnpm test:e2e                     # 22 E2E tests (precisa docker-compose.test.yml rodando)
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

## Rotas do frontend (17 páginas)

| Rota | Página | Auth | Guard |
|------|--------|------|-------|
| `/` | Home (landing v2 — hero dark, 5 etapas, cards com fotos WebP) | Não | — |
| `/quiz` | Triagem (4 perfis com ícones SVG) | Não | — |
| `/cadastro` | Registro (2 steps: tipo + dados) | Não | — |
| `/login` | Login | Não | — |
| `/acolhimento` | Onboarding (5-6 steps, multi-select, condicional) | Sim | ProtectedRoute |
| `/documentos` | Upload de documentos | Sim | ProtectedRoute |
| `/painel` | Dashboard do paciente | Sim | ProtectedRoute |
| `/tratamentos` | Hub de tratamentos v2 (filter chips, grid assimétrico, proof cards) | Não | — |
| `/tratamentos/categoria/:slug` | Categoria de tratamento (neurológicas, saúde mental, dor, oncologia) | Não | — |
| `/tratamentos/:slug` | Detalhe por condição (barra nav, hero com stat, sidebar TOC) | Não | — |
| `/legislacao` | Legislação v2 (timeline editorial, FAQ accordion, sidebar) | Não | — |
| `/catalogo` | Catálogo unificado (ícones SVG por tipo, sem emojis) | Não | — |
| `/associacoes` | Associações v2 (search bar, sidebar filtros, cards expandidos) | Não | — |
| `/associacoes/:slug` | Detalhe da associação (4 estados auth) | Não | — |
| `/associacoes/:slug/catalogo` | Catálogo da associação (preço restrito a aprovados, ícones SVG) | Não | — |
| `/admin/usuarios` | Painel admin — lista de usuários | Sim | AdminRoute (role: admin) |
| `/admin/usuarios/:id` | Painel admin — detalhe do usuário | Sim | AdminRoute (role: admin) |

### Guards do frontend
- **ProtectedRoute**: verifica `isAuthenticated`, redireciona para `/cadastro`
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

### Associations & Documents
- `GET /associations` — listar associações (@Public, filtros: region, state, hasAssistedAccess)
- `GET /associations/:id` — detalhe associação (@Public)
- `GET /documents` — listar documentos do user (JWT)

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

### Permissões existentes
| Permissão | Resource | Action |
|-----------|----------|--------|
| `admin_users:read` | admin_users | read |
| `admin_users:update` | admin_users | update |
| `admin_documents:read` | admin_documents | read |
| `admin_documents:update` | admin_documents | update |

### Seed do admin
```bash
cd apps/api
npx tsx prisma/seed-admin-user.ts          # Cria user adm@teste.com + role + permissões
npx tsx prisma/seed-admin.ts email@ex.com  # Promove user existente para admin
```

### Tipos de usuário (futuro RBAC)
| Tipo | accountType | Role (futuro) | Acesso |
|------|-------------|---------------|--------|
| Paciente | patient | patient | /painel, /acolhimento, /documentos |
| Responsável Legal | guardian | patient | Idem (gerencia dependentes) |
| Cuidador | caregiver | patient | Idem |
| Prescritor | prescriber | prescriber | Futuro: painel de prescrições |
| Veterinário | veterinarian | prescriber | Futuro: painel veterinário |
| Associação | — | association | Futuro: /associacao/painel |
| Admin CannHub | — | admin | /admin/* |

## Entidades principais (Prisma)

```
User → accountType, accountStatus, onboardingStatus, documentsStatus
       onboardingStatus: not_started | in_progress | completed
       documentsStatus: not_submitted | pending_review | approved | rejected
OnboardingSession → perfil clínico (condition, experience, currentAccessMethod, preferredForm, hasPrescription, assistedAccess)
Document → tipo, URL S3, status (pending/approved/rejected), motivo rejeição, reviewedBy
Association → name, cnpj, status, description, region, state, city, profileTypes[], hasAssistedAccess, contact, logoUrl, claimedAt
AssociationMember → associationId + userId, role (staff/manager/director), status
PatientAssociationLink → associationId + patientId, requestedBy/approvedBy, startDate/endDate, status (requested/approved/rejected)
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
- **Documentos**: associação nunca vê — só admin
- **Onboarding multi-select**: condições e formas de uso aceitam múltiplas seleções (armazenadas como string separada por vírgula)
- **JwtAuthGuard NÃO é global** — cada controller precisa `@UseGuards(JwtAuthGuard)` ou `@Public()`
- **Sync de status**: StartOnboarding → onboardingStatus='in_progress', CompleteOnboarding → onboardingStatus='completed'
- **Cascade de docs**: ApproveDocument verifica se todos docs do user estão aprovados → documentsStatus='approved'; RejectDocument → documentsStatus='rejected'

## Testes

### Unit tests (93 — Vitest)
```bash
cd apps/api && pnpm test
```
Usam in-memory repositories + factories (makeUser, makeDocument, etc.). Sem banco.

### E2E tests (22 — Vitest + Supertest)
```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d   # Primeiro: sobe Postgres teste
pnpm test:e2e
```
Requerem Postgres na porta 8239. `setup-e2e.ts` roda `prisma db push` antes dos testes.

### Frontend
```bash
cd apps/web && pnpm build    # Type-check + Vite build (verifica compilação)
```

## Roadmap

### Fase 1 — MVP (concluída)
Auth, cadastro, onboarding, documentos, catálogo por associação, tratamentos (8 condições + 4 categorias), legislação, dashboard paciente, painel admin de aprovação, redesign v2 completo (home, tratamentos, legislação, associações)

### Fase 1.5 — Painel da Associação (próxima)
Painel de gestão para associações: textos, imagens, catálogo (produtos/preços/estoque), gestão de associados (vínculo, aprovação, exclusão), cobrança de anuidade, controle de membros

### Fase 2 — Conteúdo
Blog, diretório médicos/advogados, eventos, SEO, auto-cadastro associações

### Fase 3 — Transação
Pagamento com split (iugu), pedidos, inteligência de mercado

## Próximos passos

### Painel da Associação (prioridade)
- [ ] Painel da associação (`/associacao/painel`) — dashboard com métricas
- [ ] Gestão de catálogo — CRUD de produtos (nome, descrição, preço, estoque, imagens, concentração, tipo)
- [ ] Gestão de associados — listar, aprovar/rejeitar vínculo, excluir associado
- [ ] Cobrança de vínculo — anuidade configurável por associação (valor, periodicidade, status pagamento)
- [ ] Edição de perfil da associação — textos, imagens, contato, descrição
- [ ] Role `association` no RBAC — guard para `/associacao/*`

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
- [ ] Integrar catálogo com API real (substituir sample-products.ts)
- [ ] Diretório de médicos (/medicos) + perfil (/medicos/:slug)
- [ ] Páginas de detalhe para novas condições (artrite, endometriose, náuseas quimio, dor oncológica)

### Backend
- [x] Controllers: associations (list, get by id), documents (list), update profile
- [x] Status granulares: onboardingStatus, documentsStatus no User
- [x] Painel admin: list, detail, approve/reject docs, approve/reject user, delete
- [x] Seed de permissões e user admin
- [ ] Módulo completo de associações: CRUD produtos, gestão de membros, configuração de anuidade
- [ ] Endpoint de vínculo com associação (POST /associations/:id/link)
- [ ] Endpoints de médicos (GET /doctors, GET /doctors/:id)
- [ ] Notificações por e-mail (Resend)
- [ ] Upload S3 com URLs assinadas
- [ ] Seed de dados (associações reais: Aliança Medicinal, AMME Medicinal)
- [ ] Role `association` + permissões (association_catalog:*, association_members:*, association_profile:*)

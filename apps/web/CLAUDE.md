# CannHub Web — Referência Frontend

## Comandos

```bash
pnpm dev          # Vite dev server (port 5173, proxy /api → localhost:3000)
pnpm build        # tsc + vite build
pnpm preview      # Preview production build
```

## Estrutura

```
src/
├── App.tsx                     # Router (17 rotas), ScrollToTop, lazy loading
├── index.css                   # Tailwind base + animações custom
├── components/
│   ├── layout/header.tsx       # Navbar fixa (full-width, backdrop-blur)
│   ├── onboarding/             # OptionCard, StepProgress, OnboardingFlow (multi-select)
│   └── ui/theme-toggle.tsx     # Cycle light/dark/system
├── constants/
│   └── labels.ts               # Labels centralizados (status, tipos, condições, formatMultiSelect)
├── data/
│   ├── sample-associations.ts  # 11 associações (inclui Aliança Medicinal + AMME Medicinal)
│   ├── sample-products.ts      # 31 produtos por associação (Aliança: 12, AMME: 19)
│   ├── treatments.ts           # 8 condições com dados completos (about, symptoms, evidence, protocols)
│   └── treatment-categories.ts # 4 categorias (neurológicas, saúde mental, dor, oncologia)
├── hooks/
│   ├── use-auth.ts             # useLogin(), useRegister() — faz login + GET /auth/me em sequência
│   ├── use-admin.ts            # useAdminUsers(), useDeleteUsers(), etc.
│   ├── use-onboarding.ts       # useOnboardingSummary(), useStartOnboarding(), useSubmitStep(), etc.
│   └── use-profile.ts          # useUpdateProfile() mutation
├── lib/
│   ├── api.ts                  # Axios com interceptors (Bearer, device headers, refresh token)
│   └── query-client.ts         # QueryClient centralizado (shared entre App e stores)
├── pages/                      # 17 páginas (ver rotas abaixo)
└── stores/
    ├── auth-store.ts           # Zustand: isAuthenticated, user, login/logout/hydrate
    └── theme-store.ts          # Zustand: light/dark/system cycle
```

## Rotas

| Rota | Componente | Auth | Descrição |
|------|-----------|------|-----------|
| `/` | HomePage | Não | Landing redesign v2 (hero dark, reconhecimento, antes/depois, depoimento, por que CannHub) |
| `/quiz` | QuizPage | Não | Triagem (4 perfis 2x2) |
| `/cadastro` | RegisterPage | Não | Registro 2 steps (tipo de conta + dados) |
| `/login` | LoginPage | Não | Email + senha |
| `/acolhimento` | OnboardingPage | Sim | 5-6 steps clínicos (multi-select condições/formas, step condicional: acesso atual) |
| `/documentos` | DocumentsPage | Sim | Upload 4 documentos |
| `/painel` | DashboardPage | Sim | Dashboard do paciente (edição inline, perfil clínico, docs, associações) |
| `/tratamentos` | TreatmentsPage | Não | Hub de tratamentos v2 (hero 2 cols, filter chips, grid assimétrico, proof cards) |
| `/tratamentos/categoria/:slug` | TreatmentCategoryPage | Não | Categoria (neurológicas, saúde mental, dor, oncologia) com tint, endocannabinoid context |
| `/tratamentos/:slug` | TreatmentDetailPage | Não | Detalhe por condição (barra nav, hero com stat, sidebar TOC, conteúdo editorial) |
| `/legislacao` | LegislationPage | Não | Legislação v2 (hero claro, timeline, FAQ accordion, sidebar) |
| `/catalogo` | CatalogPage | Não | Catálogo unificado (cepas + produtos) |
| `/associacoes` | AssociationsPage | Não | Associações v2 (search bar, sidebar filtros, cards expandidos) |
| `/associacoes/:slug` | AssociationDetailPage | Não | Detalhe com CTA contextual (4 estados auth) |
| `/associacoes/:slug/catalogo` | AssociationCatalogPage | Não | Catálogo da associação (preços restritos a conta aprovada) |
| `/admin/usuarios` | AdminUsersPage | Admin | Painel de aprovação (tabela, filtros, bulk delete) |
| `/admin/usuarios/:id` | AdminUserDetailPage | Admin | Detalhe do user (dados, onboarding, docs, ações) |

## API client (`lib/api.ts`)

- `baseURL: '/api'` — Vite proxy reescreve removendo `/api` prefix
- Request interceptor: adiciona `Authorization: Bearer <token>` se logado
- Request interceptor: envia device headers (`x-browser`, `x-operatingsystem`, `x-type`, `x-ipaddress`) em rotas de auth
- Response interceptor: tenta refresh token automático em 401, redireciona para `/login` se falha

## Stores (Zustand)

### auth-store
- `user`: `{ id, email, name?, accountType?, accountStatus?, verificationStatus?, status?, phone?, cpf? }`
- `login(accessToken, refreshToken, user)` — salva no localStorage + state, limpa React Query cache
- `logout()` — limpa localStorage + state + React Query cache, usa `window.location.href = '/'`
- `hydrate()` — restaura do localStorage, depois faz `GET /auth/me` pra sincronizar (preserva phone/cpf com `??` fallback)

### theme-store
- Ciclo: light → dark → system
- Aplica classe `dark` no `<html>`

## Hooks (React Query)

### use-auth.ts
- `useLogin()` — `POST /login`, auto-login no auth store
- `useRegister()` — `POST /auth/user`, auto-login, redirect para `/acolhimento`

### use-onboarding.ts
- `useOnboardingSummary()` — `GET /onboarding/summary`
- `useStartOnboarding()` — `POST /onboarding/start`
- `useSubmitStep()` — `PATCH /onboarding/step`
- `useCompleteOnboarding()` — `POST /onboarding/complete`
- `useExtractFromText()` — `POST /onboarding/extract`
- `useEscalate()` — `POST /onboarding/escalate`

## Design System — v2 (redesign março 2026)

### Fontes
- **Headlines/Logo**: DM Serif Display (serif) — itálico para ênfase
- **Body/UI**: DM Sans

### Paleta (Tailwind tokens `brand-*` — atualizada v2)
```
green-deep:    #192F1A    → Cor principal, hero backgrounds, CTAs
green-mid:     #25461E    → Hover de botões
green-light:   #3D6A27    → Labels, accents, eyebrows
green-pale:    #E6F0DA    → Badges, hover backgrounds, tints
green-xs:      #B8D09A    → Destaques em fundos escuros
cream:         #EDE7DA    → Background alternativo, seções
cream-dark:    #DDD4C3    → Bordas, dividers
cream-darker:  #BDB2A0    → Textos terciários, separadores
off/white:     #F7F3EC    → Background principal
text:          #141F14    → Texto principal (mais denso)
text-md:       #314230    → Texto secundário forte
muted:         #5C7260    → Texto secundário
text-xs:       #8A9C8C    → Labels, metadados, datas
```

### Tints por categoria (páginas de tratamento)
```
Neurológicas: #EBF2E1    Saúde mental: #E8EEF7
Dor: #F5EDEA             Oncologia: #EEE9F5
```

### Dark mode tokens
`surface-dark`, `surface-dark-card` — aplicados via `dark:` prefix

### Padrões visuais
- **Navbar**: `fixed top-0 left-0 w-full`, `backdrop-blur-[12px]`, conteúdo `max-w-[1100px] mx-auto`
- **Logo**: div com `rounded-[80%_0_80%_0] rotate-[15deg]` + "CannHub" em serif
- **Ícones**: SVG inline com `strokeWidth="1.3-1.6"` (estilo Feather/Lucide) — sem emojis em nenhum lugar
- **Botões**: `rounded-btn` (pill 100px), hover com transition
- **Sombras**: leves (`rgba(36,61,44, 0.04)` a `0.12`)
- **Animações**: `animate-fade-up-{1..4}`, `animate-fade-down` na nav

### Spacing crítico
- Páginas com Header: `pt-[80px]` (nav fixa cobre 80px)
- Home: `pt-[100px]` (hero com mais respiro)

### Cards
- **Seleção (register, quiz)**: list-style horizontal (avatar circle + ícone SVG + texto + chevron). Não usar cards coloridos individuais
- **Produto**: `rounded-card`, gradiente por tipo, badge, pill concentração, indicadores THC/CBD
- **SVG ilustrativos**: `public/cards/` (7 arquivos para landing)
- **Fotos WebP**: `public/treatments/` (imagens convertidas de PNG → WebP com cwebp -q 80, ~95% de redução)

## Controle de acesso

- `user.accountStatus` (ou `user.status`) controla visibilidade:
  - **Preços no catálogo da associação**: só `approved`
  - **Botão "Solicitar Vínculo"**: só `approved`
  - **Não logado**: cadeado + "Criar conta"
  - **Pendente**: cadeado + "Cadastro incompleto" + link para painel
  - **Recusado**: cadeado + "Cadastro recusado" + link para painel
- Vínculo com associação é **opcional** — conta aprovada é suficiente para ver preços

## Fluxo do paciente no frontend

```
/cadastro (tipo + dados) → /acolhimento (5-6 steps multi-select) → /documentos (upload) → /painel (visão geral)
                                                                                              ↓
                                                                            /associacoes → /:slug/catalogo (preços após aprovação)
```

## Onboarding — steps dinâmicos

O frontend usa `getVisibleSteps(answers)` para montar a lista de steps visíveis. Cada step tem `key` e `backendStepNumber` desacoplados:

| Frontend order | key | backendStepNumber | Multi-select? | Condicional? |
|---|---|---|---|---|
| 1 | condition | 1 | Sim | Não |
| 2 | experience | 2 | Não | Não |
| 3 | currentAccessMethod | 6 | Não | Sim (experience !== 'never') |
| 4 | prescription | 3 | Não | Não |
| 5 | preferredForm | 4 | Sim | Não |
| 6 | assistedAccess | 5 | Não | Não |

Steps multi-select armazenam valores como string separada por vírgula (ex: `"anxiety,depression,insomnia"`).

## TypeScript

- `noUncheckedIndexedAccess` habilitado — arrays/records indexados precisam fallback (`?? defaultValue`)
- Path alias: `@/*` → `src/*`

## Assets

- `public/cards/` — 7 SVGs ilustrativos (paciente_adulto, responsavel_legal, medicos_veterinarios, etc.)
- Estilo SVG: traço #233A34, preenchimento mint #A8C8A4, fundo beige #F3EEDF

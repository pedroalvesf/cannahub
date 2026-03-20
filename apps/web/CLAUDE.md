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
├── App.tsx                     # Router (9 rotas)
├── index.css                   # Tailwind base + animações custom
├── components/
│   ├── layout/header.tsx       # Navbar fixa (full-width, backdrop-blur)
│   ├── onboarding/             # OptionCard, StepProgress, OnboardingFlow
│   └── ui/theme-toggle.tsx     # Cycle light/dark/system
├── data/
│   └── sample-associations.ts  # 9 associações com slugs, about, contato (shared entre pages)
├── hooks/
│   ├── use-auth.ts             # useLogin(), useRegister() (React Query mutations)
│   ├── use-onboarding.ts       # useOnboardingSummary(), useStartOnboarding(), useSubmitStep(), etc.
│   └── use-profile.ts          # useUpdateProfile() mutation
├── lib/api.ts                  # Axios com interceptors (Bearer, device headers, refresh token)
├── pages/                      # 9 páginas (ver rotas abaixo)
└── stores/
    ├── auth-store.ts           # Zustand: isAuthenticated, user, login/logout/hydrate
    └── theme-store.ts          # Zustand: light/dark/system cycle
```

## Rotas

| Rota | Componente | Auth | Descrição |
|------|-----------|------|-----------|
| `/` | HomePage | Não | Landing (hero + cards SVG + CTA + LGPD + footer) |
| `/quiz` | QuizPage | Não | Triagem (4 perfis 2x2) |
| `/cadastro` | RegisterPage | Não | Registro 2 steps (tipo de conta + dados) |
| `/login` | LoginPage | Não | Email + senha |
| `/acolhimento` | OnboardingPage | Sim | 5-6 steps clínicos (step condicional: acesso atual) |
| `/documentos` | DocumentsPage | Sim | Upload 4 documentos |
| `/painel` | DashboardPage | Sim | Dashboard do paciente |
| `/catalogo` | CatalogPage | Não | Cepas + produtos (preço restrito) |
| `/associacoes` | AssociationsPage | Não | 9 associações (vínculo restrito) |
| `/associacoes/:slug` | AssociationDetailPage | Não | Detalhe com CTA contextual (4 estados auth) |

## API client (`lib/api.ts`)

- `baseURL: '/api'` — Vite proxy reescreve removendo `/api` prefix
- Request interceptor: adiciona `Authorization: Bearer <token>` se logado
- Request interceptor: envia device headers (`x-browser`, `x-operatingsystem`, `x-type`, `x-ipaddress`) em rotas de auth
- Response interceptor: tenta refresh token automático em 401, redireciona para `/login` se falha

## Stores (Zustand)

### auth-store
- `user`: `{ id, email, name?, accountType?, accountStatus?, verificationStatus?, status? }`
- `login(accessToken, refreshToken, user)` — salva no localStorage + state
- `logout()` — limpa localStorage + state
- `hydrate()` — restaura do localStorage, depois faz `GET /auth/me` pra sincronizar status atualizado

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

## Design System — "Rota 1 Lightized"

### Fontes
- **Headlines/Logo**: DM Serif Display (serif) — itálico para ênfase
- **Body/UI**: DM Sans

### Paleta (Tailwind tokens `brand-*`)
```
green-deep: #243D2C    → Cor principal (CTAs, headings, logo)
green-mid:  #3A6647    → Hover de botões
green-light:#5A9468    → Labels, accents, progress
green-pale: #D4E8DA    → Badges, hover backgrounds
cream:      #F4EFE4    → Background principal
cream-dark: #E5DDC9    → Bordas, dividers
sand:       #C8BFA8    → Footer links, textos terciários
text:       #1C2B21    → Texto principal
muted:      #607060    → Textos secundários
white:      #FDFCF9    → Cards, superfícies elevadas
```

### Dark mode tokens
`surface-dark`, `surface-dark-card` — aplicados via `dark:` prefix

### Padrões visuais
- **Navbar**: `fixed top-0 left-0 w-full`, `backdrop-blur-[12px]`, conteúdo `max-w-[1100px] mx-auto`
- **Logo**: div com `rounded-[80%_0_80%_0] rotate-[15deg]` + "CannHub" em serif
- **Ícones**: SVG inline com `strokeWidth="1.3"` (estilo Feather/Lucide)
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

## Controle de acesso

- `user.accountStatus` (ou `user.status`) controla visibilidade:
  - **Preços de produtos**: só `approved`
  - **Botão "Solicitar Vínculo"**: só `approved`
  - Não aprovados veem cadeado + link para cadastro

## Fluxo do paciente no frontend

```
/quiz (triagem) → /cadastro (tipo via URL param + dados) → /acolhimento (5-6 steps) → /documentos (upload) → /painel (visão geral)
```

## Onboarding — steps dinâmicos

O frontend usa `getVisibleSteps(answers)` para montar a lista de steps visíveis. Cada step tem `key` e `backendStepNumber` desacoplados:

| Frontend order | key | backendStepNumber | Condicional? |
|---|---|---|---|
| 1 | condition | 1 | Não |
| 2 | experience | 2 | Não |
| 3 | currentAccessMethod | 6 | Sim (só quando experience !== 'never') |
| 4 | prescription | 3 | Não |
| 5 | preferredForm | 4 | Não |
| 6 | assistedAccess | 5 | Não |

## TypeScript

- `noUncheckedIndexedAccess` habilitado — arrays/records indexados precisam fallback (`?? defaultValue`)
- Path alias: `@/*` → `src/*`

## Assets

- `public/cards/` — 7 SVGs ilustrativos (paciente_adulto, responsavel_legal, medicos_veterinarios, etc.)
- Estilo SVG: traço #233A34, preenchimento mint #A8C8A4, fundo beige #F3EEDF

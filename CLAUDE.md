# CannHub — Documento de Produto & Referência Técnica

## O que é

O CannHub é uma plataforma que conecta pacientes de cannabis medicinal a associações brasileiras. Funciona como um ecossistema completo — parte informativa, parte operacional. O diferencial central em relação ao que existe hoje (como o Hempi) é que o CannHub não apenas cataloga: ele viabiliza o acesso real ao medicamento com segurança jurídica e documental para todas as partes.

A plataforma opera em três lados:
- **Pacientes** — criam conta, informam perfil clínico, enviam documentação e, após aprovação, encontram associações compatíveis com sua receita e solicitam vínculo.
- **Associações** — cadastradas inicialmente pela equipe CannHub, recebem solicitações de pacientes verificados e visualizam perfil clínico de quem solicita vínculo.
- **Admin** — valida documentos, cadastra associações, modera o catálogo e acompanha dados agregados de demanda.

---

## Estado Atual do Desenvolvimento

### Backend (apps/api) — Completo para MVP
- **Arquitetura**: Clean Architecture + DDD (Entity, AggregateRoot, Either pattern, abstract repositories, use cases, Prisma mappers)
- **Módulo Onboarding** completo: 6 use cases (start, submit-step, complete, get-summary, escalate, extract-from-text)
- **AI Integration**: Claude Haiku para extração estruturada de campos clínicos a partir de texto livre
- **Testes**: 71 testes passando (20 arquivos) — in-memory repos, fake AI extractor, factories
- **Entidades**: OnboardingSession, SupportTicket, SupportMessage, Doctor
- **Controllers**: 6 endpoints REST para onboarding

### Frontend (apps/web) — 6 Páginas Implementadas
Todas as páginas seguem o design system "Rota 1 Lightized" com cards SVG ilustrativos customizados.

**Rotas ativas:**
| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Landing completa: hero, "Para quem" (4 cards SVG ilustrativos), "Benefícios" (3 cards SVG), CTA strip, LGPD, footer |
| `/quiz` | Quiz/Triagem | Página "Conheça a CannHub" com 4 blocos de perfil (2x2 grid) |
| `/acolhimento` | Acolhimento | Quiz 6 passos com cards, free text, LGPD, resumo |
| `/documentos` | Validação de Documentos | 4 cards upload horizontais com stepper e aviso de confiança |
| `/catalogo` | Catálogo | Página unificada com tabs Cepas/Produtos. **Cepas**: sidebar com filtros (tipo/terpenos/efeitos/indicações), cards com badge tipo (Indica/Sativa/Híbrida) e indicadores circulares THC/CBD. **Produtos**: óleos (1%-6% CBD), gummies, cápsulas, tópicos, sidebar com filtros (tipo/concentração/associação/estoque). Preço e botão "Solicitar" visíveis apenas para `status === 'approved'` |
| `/associacoes` | Associações | 8 associações de exemplo (5 regiões). Cards com barra verde, badge verificada, stats, perfis atendidos, tags de produtos. Filtros: região/produtos/perfil/acesso assistido. **Botão "Solicitar Vínculo" restrito a aprovados** |

---

## Design System — "Rota 1 Lightized"

### Fontes
- **Headlines/Logo**: DM Serif Display (serif) — Google Fonts
- **Body/UI**: DM Sans — Google Fonts
- Headlines usam itálico para ênfase, font-light (300) para subtítulos

### Paleta de Cores
```
--green-deep:   #243D2C   → Cor principal (logo, CTAs, headings, cards escuros)
--green-mid:    #3A6647   → Hover de botões, links secundários
--green-light:  #5A9468   → Labels, accent bars, eyebrows, progress
--green-pale:   #D4E8DA   → Badges, hover backgrounds
--cream:        #F4EFE4   → Background principal (fundo de página)
--cream-dark:   #E5DDC9   → Bordas, dividers
--sand:         #C8BFA8   → Footer links, textos terciários
--text:         #1C2B21   → Texto principal
--text-muted:   #607060   → Textos secundários, descrições
--white:        #FDFCF9   → Cards, superfícies elevadas
```

### Tailwind Tokens (tailwind.config.js)
- `brand-green-deep`, `brand-green-mid`, `brand-green-light`, `brand-green-pale`
- `brand-cream`, `brand-cream-dark`, `brand-sand`
- `brand-text`, `brand-muted`, `brand-white`
- `surface` (cream), `surface-card` (white), `surface-dark`, `surface-dark-card`

### UI Elements
- **Navbar**: Full-width fixa no topo (`fixed top-0 left-0 w-full`, `backdrop-blur`, `shadow-nav`, `border-b`). Conteúdo centralizado via `max-w-[1100px] mx-auto`
- **Logo**: Folha rotacionada (div com `rounded-[80%_0_80%_0] rotate-[15deg]`) + "CannHub" em serif
- **Cards de perfil/benefício**: SVG ilustrativos customizados em `public/cards/` (7 arquivos). Usados como `<img>` nos grids. Estilo: traço #233A34, preenchimento mint #A8C8A4, fundo beige #F3EEDF
- **Cards de produto**: `rounded-card`, gradiente de fundo por tipo, badge de tipo, pill de concentração, indicadores circulares THC/CBD
- **Botões**: `rounded-btn` (100px pill), sombras com `shadow-hero`
- **CTA Strip**: Banner dark green com `rounded-banner` (24px)
- **Sombras**: Leves (`rgba(36, 61, 44, 0.04)` a `0.12`)
- **Animações**: `animate-fade-up-{1..4}` escalonadas, `animate-fade-down` na nav, `animate-pulse-slow` decorativo
- **Padding-top**: Páginas com Header usam `pt-[80px]` para não colidir com nav fixa. Home usa `pt-[100px]` (hero com mais respiro)

### Assets
- `public/cards/` — 7 SVGs ilustrativos: `paciente_adulto`, `responsavel_legal`, `medicos_veterinarios`, `iniciantes`, `seguranca_juridica`, `curadoria_de_cepas`, `acolhimento_real`

### Ícones
- SVG inline com `strokeWidth="1.3"` (estilo Feather/Lucide, linhas finas)

### Controle de acesso no frontend
- **Auth store** (`stores/auth-store.ts`): campo `user.status` (`pending | approved | rejected`)
- **Produtos**: preço e botão "Solicitar" só aparecem para `status === 'approved'`. Não aprovados veem cadeado + link para cadastro
- Regra de negócio: informações comerciais (preços) requerem documentação validada (receita + laudo) por questões legais

---

## Cadastro e Perfil do Paciente

### Tipos de conta
- Paciente adulto — uso próprio
- Responsável legal — por menor ou dependente
- Médico prescritor — com CRM vinculado
- Veterinário — com CRMV vinculado
- Cuidador — com procuração ou documento legal

### Perfil clínico
- Condição de saúde principal (dor crônica, ansiedade, epilepsia, autismo/TEA, Parkinson, esclerose múltipla, fibromialgia, náusea, TDAH, PTSD, uso veterinário, outro)
- Forma de uso preferida: óleo sublingual, vaporização, fumo, tópico, cápsula, comestível
- Tempo de experiência: nunca usei / menos de 6 meses / 6m–1a / 1–3 anos / mais de 3 anos

### Documentação obrigatória
- Receita médica ou notificação de receita B
- Laudo ou relatório médico assinado com CRM
- Documento de identidade (RG ou CNH)
- Comprovante de residência recente (até 90 dias)

### Campos adicionais estratégicos
- **Acesso assistido:** o paciente declara se tem dificuldade financeira para arcar com o medicamento. Associações que trabalham com doação ou custo mínimo podem identificar esses pacientes. A plataforma apenas facilita — quem decide é a associação.
- **Interesse em cultivo próprio:** checkbox simples. Alimenta futuramente o direcionamento para advogados de Habeas Corpus, fornecedores de equipamentos e cursos.

---

## Validação Documental

Processo manual no MVP. A equipe analisa cada documento e aprova ou rejeita em até 48h, com motivo obrigatório em caso de rejeição.

Fluxo:
1. Paciente faz upload → arquivos vão direto pro S3, banco salva URL e status `pending`
2. Admin acessa fila de documentos pendentes no painel
3. Admin visualiza cada arquivo via URL assinada com expiração
4. Aprovação: status do User muda para `approved`, job dispara e-mail de confirmação
5. Rejeição: motivo registrado, e-mail enviado ao paciente com instruções

> A associação vê o perfil clínico do paciente ao receber uma solicitação, mas nunca os documentos — esses ficam restritos ao admin.

---

## Catálogo de Cepas e Produtos

### Cepas (informativo, público)
- Nome e tipo: Indica / Sativa / Híbrida
- Percentuais: THC%, CBD%, CBN%, CBG%
- Terpenos dominantes
- Efeitos: relaxamento, foco, sono, energia, criatividade
- Indicações médicas e contraindicações
- Sabor/aroma, imagem

### Produtos das associações (visível para membros aprovados)
- Cepa vinculada
- Tipo: óleo, flor, cápsula, tópico, comestível, vape
- Concentração (mg/ml para óleos), volume/peso
- Preço (visível apenas para membros aprovados)
- Estoque, fotos, laudo de análise (quando disponível)
- Associação vendedora

> O catálogo é o mecanismo de match: quando o paciente informa os dados da receita, a plataforma exibe as associações que têm aquele produto ou similares.

---

## Vínculo Paciente–Associação

1. Paciente aprovado informa dados da receita (produto, concentração, forma de uso)
2. Plataforma exibe associações compatíveis
3. Paciente solicita vínculo pela plataforma
4. Associação recebe pedido com perfil clínico do paciente
5. Associação aceita ou recusa
6. Com vínculo ativo: canal de contato aberto entre as partes

> No MVP, o canal de contato é a abertura das informações da associação. O pagamento integrado com split vem na Fase 3.

---

## Perfis das Associações

Associações são pré-cadastradas com informações públicas. Quando quiserem assumir o perfil:
1. Criam conta na plataforma
2. Reivindicam o perfil existente
3. Passam por validação básica do admin
4. Começam a receber solicitações de pacientes verificados

Cada perfil exibe: tipo de paciente atendido, produtos disponíveis, se trabalha com doação ou acesso assistido, e dados de contato.

---

## Hub de Conteúdo e Verticais Informativas

- **Blog e conteúdo educacional:** legislação, cultivo legal, diferenças entre tipos de óleo, direitos do paciente. SEO nessa área no Brasil é praticamente inexplorado.
- **Agenda de eventos:** encontros, congressos e iniciativas do ecossistema canábico nacional.
- **Diretório de advogados canábicos:** perfis com especialidade (Habeas Corpus para cultivo, importação, regularização), estado de atuação e forma de contato. Atende pacientes com interesse em cultivo próprio.

---

## Inteligência de Mercado para Associações

Com dados agregados e anonimizados dos pacientes, é possível mostrar para as associações:
- Demanda reprimida por produto específico em determinada região
- Formas de uso mais comuns por condição de saúde
- Concentrações mais prescritas sem fornecedor disponível

Feature premium futura: associações pagam para acessar dados de demanda ou receber alertas de mercado. Os dados começam a ser coletados desde o primeiro cadastro.

---

## Modelo de Negócio

| Fonte de Receita | Fase | Detalhe |
|---|---|---|
| Comissão sobre vendas | Fase 3 | 10% split via iugu |
| Diretório de advogados | Fase 2 | Leads qualificados |
| Plano premium para associações | Fase 2–3 | Destaque + dados de demanda |
| Parcerias com fornecedores de cultivo | Fase 2–3 | Equipamentos, sementes, cursos |

---

## Estrutura Técnica

### Monorepo
```
cannahub/
├── apps/
│   ├── api/                    # NestJS (Clean Architecture + DDD)
│   │   ├── src/
│   │   │   ├── domain/         # Entidades, use cases, repos abstratos
│   │   │   │   └── onboarding/ # Módulo de acolhimento
│   │   │   ├── infra/          # Prisma, controllers, AI, módulos NestJS
│   │   │   └── core/           # Either, Entity, AggregateRoot base
│   │   ├── prisma/             # Schema + migrations
│   │   └── test/               # In-memory repos, fakes, factories
│   └── web/                    # React PWA
│       └── src/
│           ├── components/
│           │   ├── layout/     # Header (pill navbar)
│           │   ├── onboarding/ # OptionCard, StepProgress, OnboardingFlow
│           │   └── ui/         # ThemeToggle
│           ├── hooks/          # useOnboarding (React Query)
│           ├── lib/            # api.ts (axios)
│           ├── pages/          # home, quiz, onboarding, documents, catalog, associations
│           ├── stores/         # auth-store (com user.status), theme-store (Zustand)
│           ├── App.tsx         # Router (6 rotas)
│           └── index.css       # Tailwind base
├── packages/
│   └── shared/                 # Tipos, enums, schemas Zod compartilhados
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── CLAUDE.md
```

### Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL + Prisma |
| Frontend | React 19 + Vite + Tailwind |
| Estado | Zustand + React Query (TanStack) |
| Formulários | React Hook Form + Zod |
| Autenticação | JWT + Passport (NestJS) |
| Upload/Arquivos | Multer + AWS S3 |
| Filas | Bull + Redis |
| E-mail | Resend |
| AI | Anthropic Claude Haiku (extração de campos) |
| Pagamento | iugu (Fase 3) |
| Deploy API | Railway ou Render |
| Deploy Web | Vercel |
| Arquivos | AWS S3 + CloudFront |

### Módulos NestJS
- `auth` — autenticação JWT, tipos de conta
- `users` — perfil, dados pessoais, perfil clínico
- `documents` — upload, validação, status
- `associations` — perfil, produtos, onboarding
- `strains` — catálogo de cepas
- `products` — produtos reais das associações
- `memberships` — vínculo paciente-associação
- `orders` — pedidos (Fase 3)
- `admin` — painel de aprovação e moderação
- `onboarding` — acolhimento híbrido (guiado + AI + escalação humana)

### Entidades principais (Prisma)
```
User              → Documents, Memberships, Orders, OnboardingSession
Association       → Products, Memberships
Product           → Association, Strain
Strain            → Products (informativo)
Membership        → User ↔ Association (status: requested/active/denied)
Document          → User (tipo, URL S3, status, motivo rejeição)
OnboardingSession → User (perfil clínico, respostas, status, summary)
SupportTicket     → OnboardingSession (escalação para humano)
SupportMessage    → SupportTicket
Doctor            → Diretório de médicos prescritores
Order             → User, Association, Products (Fase 3)
PaymentConfig     → comissão 10%, gateway iugu (modelado desde o início)
```

---

## Roadmap

### Fase 1 — MVP (Mês 1–3)
Monorepo configurado, auth completo por tipo de conta, cadastro de pacientes, upload e armazenamento de documentos, painel admin de aprovação, catálogo de cepas, perfis de associações pré-cadastradas, sistema de memberships, notificações por e-mail, PWA.

### Fase 2 — Conteúdo (Mês 4–6)
Blog e hub educacional, diretório de advogados, agenda de eventos, SEO estruturado, painel de auto-cadastro para associações.

### Fase 3 — Transação (Mês 7+)
Pagamento integrado com split via iugu, pedidos e histórico, dashboard de inteligência de mercado para associações, app nativo se a demanda justificar.

---

## Próximos Passos (a partir de onde paramos)

### Frontend — Prioridade Imediata
- [x] **Página de Associações** (`/associacoes`) — ✅ Implementada
- [ ] **Página de Login/Registro** — telas de auth (botão "Entrar" no header não funciona ainda)
- [ ] **Dashboard do Paciente** — status dos documentos, status de aprovação, vínculos com associações
- [ ] **Conectar Quiz → Acolhimento** — os cards de perfil no Quiz devem linkar para `/acolhimento` passando o tipo selecionado
- [ ] **Perfil individual da Associação** — página de detalhe ao clicar em um card

### Frontend — Melhorias
- [ ] Responsividade mobile da navbar (menu hamburger)
- [ ] Dark mode refinado
- [ ] Integrar páginas com API real (hooks useOnboarding já prontos)
- [ ] Upload real de documentos (conectar com S3)
- [ ] Catálogo de cepas e produtos com dados reais da API

### Backend
- [ ] Módulos auth, users, documents, associations, strains, products, memberships
- [ ] Painel admin de aprovação de documentos
- [ ] Sistema de notificações por e-mail (Resend)
- [ ] Upload S3 com URLs assinadas
- [ ] Seed de dados (cepas, associações, produtos)

---

## Comandos por Projeto

### API (`cd apps/api`)
```bash
pnpm dev                # Start dev server (port 3000)
pnpm build              # Compile TypeScript
pnpm test               # Unit tests (71 passando)
pnpm test:e2e           # E2E tests
pnpm prisma:migrate     # Run migrations
pnpm prisma:generate    # Generate Prisma client
pnpm db:seed            # Seed database
```

### Web (`cd apps/web`)
```bash
pnpm dev                # Start Vite dev server (port 5173)
pnpm build              # Build for production (tsc + vite build)
pnpm preview            # Preview production build
```

### Infra (raiz)
```bash
docker compose up -d    # Sobe Postgres + Redis
docker compose down     # Para tudo
```

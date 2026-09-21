# SMHI Platform — System Architecture Overview

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Approved

---

## 1. Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| Modular Monolith | Single deployable unit with clean internal module boundaries |
| Separation of Concerns | Presentation, API, business logic, and persistence are separate layers |
| Content-First | CMS-managed content is a first-class capability |
| Security by Design | RBAC, validation, audit logs, and secure uploads from day one |
| Scalable Boundaries | Module boundaries allow future extraction to services if needed |

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT TARGET                        │
│              Namecheap hosting (future phase)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │   Public Website  │    │   Admin / CMS    │               │
│  │   Next.js 14+     │    │   Next.js 14+    │               │
│  │   React 18        │    │   React 18       │               │
│  │   TypeScript       │    │   TypeScript     │               │
│  │   Tailwind CSS     │    │   Tailwind CSS   │               │
│  └────────┬─────────┘    └────────┬─────────┘               │
│           │                        │                          │
└───────────┼────────────────────────┼──────────────────────────┘
            │    HTTPS / REST        │
┌───────────┼────────────────────────┼──────────────────────────┐
│           ▼                        ▼                          │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              APPLICATION API LAYER                   │     │
│  │           NestJS (Modular Monolith)                  │     │
│  │                                                      │     │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ │     │
│  │  │  Auth   │ │  CMS    │ │ Content  │ │ Events  │ │     │
│  │  │ Module  │ │ Module  │ │  Module  │ │ Module  │ │     │
│  │  └─────────┘ └─────────┘ └──────────┘ └─────────┘ │     │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ │     │
│  │  │ Gallery │ │Articles │ │  Media   │ │ Enquiry │ │     │
│  │  │ Module  │ │ Module  │ │  Module  │ │ Module  │ │     │
│  │  └─────────┘ └─────────┘ └──────────┘ └─────────┘ │     │
│  │                                                      │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
┌─────────▼─────────┐       ┌─────────────▼─────────────┐
│   MySQL Database   │       │   S3 Object Storage       │
│   (Prisma ORM)     │       │   Images/PDF/Media        │
│                    │       │   + CDN (future)           │
│   - Content        │       │                            │
│   - Auth           │       │   - Uploads                │
│   - Events         │       │   - Optimized derivatives  │
│   - Projects       │       │   - Alt text metadata      │
│   - Users          │       │                            │
└───────────────────┘       └────────────────────────────┘
```

## 3. Technology Stack

### 3.1 Frontend — Public Website (`apps/web`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14+ (App Router) | SSR/ISR, routing, API routes |
| React | 18 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | Latest | Reusable component primitives |
| Framer Motion | Latest | Subtle animations |
| next/font | Built-in | Font optimization |

### 3.2 Frontend — Admin CMS (`apps/admin`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14+ (App Router) | Admin routing, SSR |
| React | 18 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | Admin components |
| React Hook Form | Latest | Form management |
| Zod | Latest | Client-side validation |

### 3.3 Backend API (`apps/api` or `packages/api`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 10+ | Modular API framework |
| TypeScript | 5.x | Type safety |
| Prisma | Latest | ORM + migrations |
| class-validator | Latest | Request validation |
| class-transformer | Latest | Data transformation |
| bcrypt | Latest | Password hashing |
| JWT (passport-jwt) | Latest | Authentication |

### 3.4 Database

| Technology | Purpose |
|-----------|---------|
| MySQL 8.x | Primary relational database |
| Prisma | Schema management + migrations |

### 3.5 Media Storage

| Technology | Purpose |
|-----------|---------|
| Local filesystem (dev) | Development file storage |
| S3-compatible storage (prod) | Production media storage |

### 3.6 Development Tools

| Tool | Purpose |
|------|---------|
| Turborepo | Monorepo build orchestration |
| pnpm | Package management |
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| lint-staged | Pre-commit checks |

## 4. Module Architecture

Each domain module follows the same structure:

```
src/
├── modules/
│   └── [module]/
│       ├── [module].module.ts        # NestJS module definition
│       ├── controllers/              # HTTP handlers (thin)
│       ├── services/                 # Business logic
│       ├── repositories/             # Data access (via Prisma)
│       ├── dto/                      # Request/response DTOs
│       ├── entities/                 # Domain entities
│       └── guards/                   # Module-specific guards
```

### 4.1 Core Modules

| Module | Responsibility |
|--------|---------------|
| `auth` | Login, logout, sessions, password management, MFA preparation |
| `users` | User CRUD, role assignment, profile management |
| `roles` | Role definitions, permission management |
| `pages` | CMS page management, block editor |
| `projects` | Project/program CRUD, categories, media |
| `events` | Event CRUD, countdown, registration, timezone handling |
| `gallery` | Album management, media upload, ordering |
| `articles` | Article CRUD, categories, tags, scheduling |
| `stories` | Testimonial management, consent workflow |
| `team` | Team member profiles, ordering |
| `resources` | Downloadable resources, categories |
| `media` | Central media library, upload, optimization |
| `enquiries` | Contact/support messages, assignment, status |
| `subscribers` | Newsletter subscriptions |
| `settings` | Global site configuration |
| `audit` | Audit logging |
| `navigation` | Menu/footer link management |
| `homepage` | Homepage section configuration |

## 5. Data Flow

### 5.1 Public Content Request

```
Browser → Next.js (SSR/ISR) → API (GET /api/v1/[content]) → Prisma → MySQL
                ↓
        Cached HTML/JSON returned
```

### 5.2 CMS Content Management

```
Admin Browser → Next.js Admin → API (POST/PATCH /api/v1/admin/[content])
                                        ↓
                                Validation + RBAC Check
                                        ↓
                                Prisma → MySQL
                                        ↓
                                Audit Log Entry
```

### 5.3 Media Upload

```
Admin Browser → API Upload Endpoint → Validate (type/size)
                                        ↓
                                Save to Storage
                                        ↓
                                Generate Derivatives (hero/card/thumb)
                                        ↓
                                Create MediaAsset Record
                                        ↓
                                Return Media URL
```

## 6. Security Boundaries

| Layer | Security Measure |
|-------|-----------------|
| Transport | HTTPS everywhere (production) |
| Authentication | Server-side sessions with secure cookies |
| Authorization | RBAC enforced at API controller level |
| Input | Zod/class-validator on every endpoint |
| Output | Never expose raw DB errors or internal paths |
| Uploads | Type, size, extension validation |
| Rate Limiting | Login, password reset, public forms |
| Audit | All auth, publish, delete, settings changes logged |

## 7. Deployment Architecture

### 7.1 Development (Local)

```
localhost:3000  → Public Website (Next.js)
localhost:3001  → Admin CMS (Next.js)
localhost:3002  → API (NestJS)
localhost:3306  → MySQL
```

### 7.2 Production (Namecheap — Future Phase)

```
shedam.org       → Public Website (Next.js SSR)
admin.shedam.org → Admin CMS (Next.js)
api.shedam.org   → API (NestJS)
                 → MySQL (Namecheap database)
                 → File storage (local or S3)
```

## 8. Environment Configuration

| Variable | Development | Production |
|----------|------------|------------|
| `DATABASE_URL` | `mysql://root:pass@localhost:3306/smhi` | Namecheap DB URL |
| `JWT_SECRET` | Local secret | Production secret |
| `NODE_ENV` | `development` | `production` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3002` | `https://api.shedam.org` |
| `UPLOAD_DIR` | `./uploads` | S3 or production path |

## 9. Future Considerations

| Concern | Current Approach | Future Enhancement |
|---------|-----------------|-------------------|
| Media Storage | Local filesystem | S3 + CDN |
| Caching | ISR/SSG | Redis layer |
| Search | Database queries | Elasticsearch/Meilisearch |
| Email | Basic transactional | SendGrid/Mailgun |
| Analytics | Basic tracking | Plausible/Fathom |
| Monitoring | Console logs | Sentry + APM |

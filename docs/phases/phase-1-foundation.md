# SMHI Platform — Phase 1: Foundation

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Pending

---

## 1. Objectives

- Set up monorepo structure
- Initialize all applications
- Configure development tooling
- Implement database schema
- Build design system base
- Create authentication system

## 2. Deliverables

### 2.1 Monorepo Setup
- Turborepo configuration
- pnpm workspace setup
- Shared TypeScript configs
- Shared ESLint/Prettier configs
- Git hooks (Husky + lint-staged)

### 2.2 Public Website (`apps/web`)
- Next.js 14+ with App Router
- TypeScript configuration
- Tailwind CSS setup
- shadcn/ui initialization
- Base layout component
- Font optimization (Inter + Plus Jakarta Sans)

### 2.3 Admin CMS (`apps/admin`)
- Next.js 14+ with App Router
- TypeScript configuration
- Tailwind CSS setup
- shadcn/ui initialization
- Authentication pages (login)
- Dashboard layout shell

### 2.4 Backend API (`apps/api`)
- NestJS application setup
- Module structure
- Prisma integration
- MySQL connection
- Base exception filters
- CORS configuration

### 2.5 Database
- Prisma schema with all 16 entities
- Migration scripts
- Seed data (roles, default settings)
- Development database setup

### 2.6 Design System (`packages/ui`)
- Color tokens (CSS custom properties)
- Typography tokens
- Spacing tokens
- Button components (primary, secondary, ghost)
- Card component
- Input component
- Layout components (Container, Grid)

### 2.7 Authentication
- Login/logout API endpoints
- JWT token management
- Password hashing (bcrypt)
- Session middleware
- RBAC guard

## 3. Task Breakdown

### Week 1-2: Monorepo & Configuration
| Task | Owner | Status |
|------|-------|--------|
| Initialize Turborepo project | Lead | Pending |
| Configure pnpm workspaces | Lead | Pending |
| Set up shared TypeScript configs | Lead | Pending |
| Set up ESLint + Prettier | Lead | Pending |
| Configure Husky + lint-staged | Lead | Pending |
| Create `.env.example` files | Lead | Pending |

### Week 3-4: Application Scaffolding
| Task | Owner | Status |
|------|-------|--------|
| Initialize Next.js public website | Lead | Pending |
| Initialize Next.js admin CMS | Lead | Pending |
| Initialize NestJS API | Lead | Pending |
| Set up Prisma with MySQL | Lead | Pending |
| Create base Prisma schema | Lead | Pending |
| Run initial migration | Lead | Pending |

### Week 5-6: Design System & Auth
| Task | Owner | Status |
|------|-------|--------|
| Create design tokens package | Lead | Pending |
| Build base UI components | Lead | Pending |
| Implement login/logout API | Lead | Pending |
| Create JWT middleware | Lead | Pending |
| Implement RBAC guards | Lead | Pending |
| Build login page | Lead | Pending |

## 4. Technical Notes

### 4.1 Monorepo Structure
```
smhi-platform/
├── apps/
│   ├── web/           # Public website (Next.js)
│   ├── admin/         # Admin CMS (Next.js)
│   └── api/           # Backend API (NestJS)
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configs (TS, ESLint)
│   └── database/      # Prisma schema + migrations
├── docs/              # Project documentation
├── turbo.json         # Turborepo config
├── pnpm-workspace.yaml
├── package.json
└── .gitignore
```

### 4.2 Environment Variables

#### API (.env)
```
DATABASE_URL=mysql://root:password@localhost:3306/smhi_dev
JWT_SECRET=your-development-secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3002
UPLOAD_DIR=./uploads
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Admin (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

## 5. Acceptance Criteria

- [ ] Monorepo builds successfully with `turbo build`
- [ ] All three applications start without errors
- [ ] Database connects and migrations run
- [ ] Design tokens render correctly
- [ ] Login/logout flow works end-to-end
- [ ] RBAC blocks unauthorized access
- [ ] `pnpm dev` starts all services concurrently
- [ ] No TypeScript errors
- [ ] ESLint passes with no errors

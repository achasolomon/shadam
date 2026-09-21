# SMHI Platform — Documentation Index

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer

---

## 1. Project Documents

| Document | Location | Description |
|----------|----------|-------------|
| PM Requirements | `docs/requirement.md` | System & implementation documentation |
| Governance Document | `shadam-governance.md` | Founding & governance document |

## 2. Architecture Documents

| Document | Location | Description |
|----------|----------|-------------|
| System Overview | `docs/architecture/01-system-overview.md` | High-level architecture, tech stack, deployment |
| Database Schema | `docs/architecture/02-database-schema.md` | All 16 database tables, indexes, seed data |
| API Conventions | `docs/architecture/03-api-conventions.md` | REST API standards, endpoints, pagination |
| Design System | `docs/architecture/04-design-system.md` | Colors, typography, spacing, components |
| Governance Mapping | `docs/architecture/05-governance-mapping.md` | Governance structure → platform features |

## 3. Phase Documents

| Document | Location | Description |
|----------|----------|-------------|
| Phase 0: Discovery | `docs/phases/phase-0-discovery.md` | Stakeholder confirmation, environment setup |
| Phase 1: Foundation | `docs/phases/phase-1-foundation.md` | Monorepo, DB, auth, design system |
| Phase 2: CMS | `docs/phases/phase-2-cms.md` | Admin dashboard, content modules |
| Phase 3: Public Site | `docs/phases/phase-3-public-site.md` | All public-facing pages |
| Phase 4: Engagement | `docs/phases/phase-4-engagement.md` | Widget, newsletter, registration |
| Phase 5: Hardening | `docs/phases/phase-5-hardening.md` | Accessibility, security, performance |
| Phase 6: Launch | `docs/phases/phase-6-launch.md` | Migration, training, deployment |

## 4. Decision Records (ADRs)

| Document | Location | Description |
|----------|----------|-------------|
| ADR-001 | `docs/decisions/ADR-001-monorepo-architecture.md` | Turborepo monorepo decision |
| ADR-002 | `docs/decisions/ADR-002-frontend-framework.md` | Next.js App Router decision |
| ADR-003 | `docs/decisions/ADR-003-backend-framework.md` | NestJS backend decision |
| ADR-004 | `docs/decisions/ADR-004-database-choice.md` | MySQL + Prisma decision |
| ADR-005 | `docs/decisions/ADR-005-styling-approach.md` | Tailwind CSS + shadcn/ui decision |
| ADR-006 | `docs/decisions/ADR-006-authentication-strategy.md` | JWT sessions + RBAC decision |

## 5. Guides

| Document | Location | Description |
|----------|----------|-------------|
| Development Setup | `docs/guides/development-setup.md` | Local environment setup |
| Contributing | `docs/guides/contributing.md` | Contribution guidelines |
| Deployment | `docs/guides/deployment.md` | Production deployment guide |
| CMS User Guide | `docs/guides/cms-user-guide.md` | How to use the CMS |

## 6. Document Status

| Status | Meaning |
|--------|---------|
| ✅ Approved | Document reviewed and approved |
| 🔄 In Progress | Document being written/updated |
| 📝 Draft | Initial draft, needs review |
| ⏳ Pending | Not yet started |

## 7. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Sep 2026 | Lead Engineer | Initial documentation |

# ADR-001: Monorepo Architecture

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer, Project Manager

---

## Context

The SMHI platform consists of three main applications:
1. Public website (Next.js)
2. Admin CMS (Next.js)
3. Backend API (NestJS)

Plus shared packages:
- UI components
- Configuration files
- Database schema

We need to decide how to organize these codebases.

## Decision

**Adopt a monorepo architecture using Turborepo with pnpm workspaces.**

## Rationale

### Options Considered

1. **Monorepo with Turborepo** ✅
   - Single repository for all code
   - Shared types and utilities
   - Consistent tooling
   - Atomic commits across packages
   - Better developer experience
   - Easier refactoring

2. **Polyrepo (separate repositories)**
   - Independent deployment
   - Clear ownership
   - ❌ Harder to share code
   - ❌ Version coordination complexity
   - ❌ Duplicate tooling setup

3. **Monorepo with Nx**
   - Powerful build system
   - ❌ Steeper learning curve
   - ❌ Heavier for small teams
   - ❌ More complex configuration

### Why Turborepo?

- **Simpler** than Nx for our scale
- **Fast** incremental builds
- **Good pnpm support**
- **Easy to understand** for junior developers
- **Native TypeScript support**

## Consequences

### Positive
- Single `pnpm install` for all dependencies
- Shared TypeScript configuration
- Consistent linting and formatting
- Atomic commits across packages
- Faster development iterations
- Easier onboarding

### Negative
- All code in one repository
- Need to manage shared dependencies carefully
- Build cache management required

### Mitigations
- Clear package boundaries
- Dependabot for dependency updates
- Turborepo remote caching (future)

## Configuration

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

# ADR-002: Frontend Framework Choice

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer

---

## Context

We need to build:
1. A public website with strong SEO requirements
2. An admin CMS with authentication and complex forms

Both need to be performant, accessible, and maintainable.

## Decision

**Use Next.js 14+ (App Router) with React 18 and TypeScript for both frontend applications.**

## Rationale

### Options Considered

1. **Next.js (App Router)** ✅
   - SSR/ISR for SEO
   - Server Components for performance
   - File-based routing
   - Great TypeScript support
   - Large ecosystem
   - Good DX

2. **Next.js (Pages Router)**
   - Mature and stable
   - ❌ Less modern API
   - ❌ No Server Components
   - ❌ More client-side JavaScript

3. **Remix**
   - Good nested routing
   - ❌ Smaller ecosystem
   - ❌ Less SSR flexibility

4. **Nuxt.js (Vue)**
   - Good for Vue teams
   - ❌ We're using React
   - ❌ Smaller ecosystem than React

5. **SvelteKit**
   - Very fast
   - ❌ Smaller ecosystem
   - ❌ Team less familiar

### Why Next.js App Router?

- **SEO Critical**: Mental health content needs to be discoverable
- **Server Components**: Reduce client-side JavaScript
- **ISR**: Cache pages for performance
- **File-based routing**: Intuitive structure
- **React ecosystem**: Largest component library

## Consequences

### Positive
- Excellent SEO out of the box
- Server Components reduce bundle size
- Strong TypeScript integration
- Good developer experience
- Large community and resources

### Negative
- App Router is newer (less documentation than Pages Router)
- Server Components have learning curve
- More complex data fetching patterns

### Mitigations
- Use established patterns from Next.js documentation
- Document data fetching patterns
- Team training on Server Components

## Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-storage.com',
      },
    ],
  },
  experimental: {
    // Enable when stable
  },
};

module.exports = nextConfig;
```

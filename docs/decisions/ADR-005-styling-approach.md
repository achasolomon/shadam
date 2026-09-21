# ADR-005: Styling Approach

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer

---

## Context

We need a styling solution for:
- Public website with calm, premium design
- Admin CMS with functional interface
- Consistent design system
- Responsive design
- Accessible components

## Decision

**Use Tailwind CSS with shadcn/ui components and CSS custom properties for design tokens.**

## Rationale

### Options Considered

1. **Tailwind CSS + shadcn/ui** ✅
   - Utility-first styling
   - Consistent design tokens
   - Great DX
   - Customizable
   - shadcn/ui provides accessible primitives

2. **Styled Components / CSS-in-JS**
   - Component-level styling
   - ❌ Runtime performance cost
   - ❌ Harder to maintain tokens
   - ❌ SSR complexity

3. **Sass/SCSS**
   - Powerful features
   - ❌ More verbose
   - ❌ No design token system
   - ❌ Less modern

4. **CSS Modules**
   - Scoped styles
   - ❌ More files to manage
   - ❌ No utility classes
   - ❌ Less consistent

### Why Tailwind?

- **Utility Classes**: Fast development
- **Design Tokens**: CSS custom properties
- **Consistency**: Predefined spacing, colors
- **Responsive**: Mobile-first approach
- **Performance**: No runtime cost

### Why shadcn/ui?

- **Accessible**: Built with Radix primitives
- **Customizable**: Tailwind-based
- **Copy-paste**: Own the code
- **Modern**: Latest React patterns
- **Type-safe**: Full TypeScript support

## Design Token Strategy

```css
/* Global tokens as CSS custom properties */
:root {
  /* Colors */
  --color-primary: #1B5E3B;
  --color-primary-hover: #154D30;
  --color-dark: #1A2332;
  --color-surface: #FAFAF8;
  
  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

## Consequences

### Positive
- Fast development with utilities
- Consistent design system
- Accessible components with shadcn/ui
- Easy responsive design
- Good performance

### Negative
- Learning curve for Tailwind
- Large class names
- Need to manage design tokens manually

### Mitigations
- Document design tokens
- Create component examples
- Team training on Tailwind

## Component Pattern

```tsx
// shadcn/ui component customization
import { Button } from '@/components/ui/button';

// Custom button with brand colors
<Button 
  variant="default"
  className="bg-primary hover:bg-primary-hover"
>
  Get Help Now
</Button>
```

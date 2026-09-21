# SMHI Platform — Design System

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Approved

---

## 1. Design Principles

1. **Calm & Premium** — Not generic NGO template styling
2. **Human-Centered** — Mental health content must be respectful and accessible
3. **Trust Before Decoration** — Leadership, services, and support routes matter more than effects
4. **Consistent** — Reusable design tokens and components
5. **Accessible** — WCAG 2.2 AA compliance

## 2. Color Palette

### 2.1 Primary Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-primary` | Deep Forest Green | `#1B5E3B` | Primary CTAs, accents, active states |
| `--color-primary-hover` | Forest Green Dark | `#154D30` | Hover state |
| `--color-primary-light` | Forest Green Light | `#E8F5EE` | Backgrounds, highlights |

### 2.2 Neutral Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-dark` | Dark Charcoal | `#1A2332` | Headers, footer, primary text |
| `--color-dark-secondary` | Charcoal Light | `#2D3A4A` | Secondary text, borders |
| `--color-surface` | Warm White | `#FAFAF8` | Page backgrounds |
| `--color-surface-alt` | Off-White | `#F5F3EF` | Card backgrounds, alternating sections |
| `--color-border` | Light Border | `#E5E2DC` | Dividers, borders |

### 2.3 Accent Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-accent` | Gold | `#D4A843` | Highlights, special accents |
| `--color-accent-light` | Gold Light | `#FDF6E3` | Accent backgrounds |

### 2.4 Semantic Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-success` | Success Green | `#22C55E` | Success states |
| `--color-warning` | Warning Amber | `#F59E0B` | Warning states |
| `--color-error` | Error Red | `#EF4444` | Error states |
| `--color-info` | Info Blue | `#3B82F6` | Information states |

### 2.5 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#1A2332` | Primary text |
| `--text-secondary` | `#6B7280` | Secondary text |
| `--text-muted` | `#9CA3AF` | Muted text |
| `--text-inverse` | `#FFFFFF` | Text on dark backgrounds |

## 3. Typography

### 3.1 Font Families

| Font | Weight | Usage |
|------|--------|-------|
| **Inter** | 400, 500, 600, 700 | Body text, UI elements |
| **Plus Jakarta Sans** | 600, 700, 800 | Headings, display text |

### 3.2 Type Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-display` | 3.5rem (56px) | 1.1 | Hero headlines |
| `--text-h1` | 2.5rem (40px) | 1.2 | Page titles |
| `--text-h2` | 2rem (32px) | 1.25 | Section titles |
| `--text-h3` | 1.5rem (24px) | 1.3 | Subsection titles |
| `--text-h4` | 1.25rem (20px) | 1.4 | Card titles |
| `--text-body` | 1rem (16px) | 1.6 | Body text |
| `--text-body-sm` | 0.875rem (14px) | 1.5 | Small body text |
| `--text-caption` | 0.75rem (12px) | 1.4 | Captions, labels |

## 4. Spacing System

Base unit: **8px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Base unit |
| `--space-3` | 12px | Small spacing |
| `--space-4` | 16px | Medium spacing |
| `--space-5` | 20px | Medium-large spacing |
| `--space-6` | 24px | Large spacing |
| `--space-8` | 32px | Section spacing |
| `--space-10` | 40px | Large section spacing |
| `--space-12` | 48px | XL section spacing |
| `--space-16` | 64px | Hero/feature spacing |

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Cards, buttons |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Featured cards |
| `--radius-full` | 9999px | Pills, avatars |

## 6. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Featured elements |

## 7. Component Design

### 7.1 Buttons

#### Primary Button
```css
background: var(--color-primary);
color: white;
padding: 12px 24px;
border-radius: var(--radius-md);
font-weight: 600;
hover: var(--color-primary-hover);
focus: 2px solid var(--color-primary-light);
```

#### Secondary Button
```css
background: transparent;
color: var(--color-primary);
border: 2px solid var(--color-primary);
padding: 10px 22px;
border-radius: var(--radius-md);
hover: var(--color-primary-light);
```

#### Ghost Button
```css
background: transparent;
color: var(--color-primary);
padding: 12px 24px;
hover: var(--color-primary-light);
```

### 7.2 Cards

```css
background: white;
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);
padding: var(--space-6);
hover: box-shadow: var(--shadow-md);
```

### 7.3 Form Inputs

```css
background: white;
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
padding: 12px 16px;
font-size: var(--text-body);
focus: border-color: var(--color-primary);
focus: ring: 2px solid var(--color-primary-light);
```

## 8. Layout

### 8.1 Grid System

- 12-column desktop grid
- Max content width: **1200px**
- Side padding: **24px** (mobile), **48px** (desktop)

### 8.2 Breakpoints

| Token | Width | Usage |
|-------|-------|-------|
| `--breakpoint-sm` | 640px | Mobile landscape |
| `--breakpoint-md` | 768px | Tablet |
| `--breakpoint-lg` | 1024px | Desktop |
| `--breakpoint-xl` | 1280px | Large desktop |

### 8.3 Content Widths

| Container | Max Width |
|-----------|-----------|
| Default | 1200px |
| Narrow | 800px |
| Wide | 1400px |

## 9. Icons

**Icon Library:** Lucide React (consistent, modern, tree-shakeable)

Usage guidelines:
- Use 20px icons in buttons and navigation
- Use 24px icons in cards and features
- Use 32px+ icons for hero/feature highlights
- Always pair icons with text labels for accessibility

## 10. Motion

### 10.1 Transitions

| Token | Duration | Usage |
|-------|----------|-------|
| `--transition-fast` | 150ms | Hover states, toggles |
| `--transition-base` | 250ms | Page transitions, modals |
| `--transition-slow` | 350ms | Complex animations |

### 10.2 Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering elements |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exiting elements |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes |

### 10.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 11. Image Guidelines

| Context | Aspect Ratio | Quality |
|---------|-------------|---------|
| Hero | 16:9 | High |
| Card Cover | 16:10 | Medium |
| Gallery Thumbnail | 1:1 | Medium |
| Team Photo | 3:4 | High |
| Resource Thumbnail | 4:3 | Medium |

## 12. Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation for all components
- [ ] Screen reader labels for all images
- [ ] Semantic HTML structure
- [ ] Reduced motion support
- [ ] Form error messages associated with inputs

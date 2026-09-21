# SMHI Platform — Phase 3: Public Site

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Pending

---

## 1. Objectives

- Build all public-facing pages
- Implement homepage sections
- Create content detail pages
- Ensure responsive design
- Implement SEO best practices

## 2. Deliverables

### 2.1 Homepage
- Hero section with CMS content
- Event countdown card (when featured event exists)
- About/Who We Are section
- What We Do/Services section
- Projects carousel
- Impact/milestones section
- Gallery preview
- You Are Not Alone/Get Help section
- Latest insights
- Newsletter subscription
- Footer with contact, social, navigation

### 2.2 Header & Navigation
- Responsive navigation
- Dropdown menus
- Mobile hamburger menu
- Support/Donate CTA button
- Back-to-top control

### 2.3 About Pages
- Who We Are (main about page)
- Our Story
- Mission, Vision & Values
- Our Team

### 2.4 What We Do
- Service overview page
- Individual service detail pages:
  - Mental Health Awareness
  - Mental Health Education
  - Professional Referral
  - Community Support
  - Vulnerable Persons Support

### 2.5 Projects
- Projects listing with filters
- Project detail pages
- Related projects

### 2.6 Events
- Events listing (upcoming/past)
- Event detail pages
- Registration links

### 2.7 Gallery
- Album listing
- Album detail with lightbox
- Responsive image grid

### 2.8 Insights
- Articles listing with category filters
- Article detail pages
- Stories listing
- Story detail pages
- Resources listing with download

### 2.9 Get Help
- Support routes overview
- Professional help resources
- Crisis information
- Contact options

### 2.10 Get Involved
- Volunteer opportunities
- Partnership information
- Support/Donate options

### 2.11 Contact
- Contact form
- Contact details
- Location/map
- Social channels

### 2.12 Support Chat Widget
- Collapsible launcher
- Expanded panel with options
- CMS-configurable channels
- Crisis messaging
- Phone/WhatsApp/Email options

### 2.13 Footer
- Navigation links
- Contact information
- Social media links
- Newsletter signup
- Legal links (privacy, terms)
- Copyright

## 3. Task Breakdown

### Week 13-14: Homepage & Layout
| Task | Owner | Status |
|------|-------|--------|
| Build responsive header | Lead | Pending |
| Implement hero section | Lead | Pending |
| Build event countdown | Lead | Pending |
| Create about preview section | Lead | Pending |
| Build services section | Lead | Pending |

### Week 15-16: Content Pages
| Task | Owner | Status |
|------|-------|--------|
| Build About pages | Lead | Pending |
| Build What We Do pages | Lead | Pending |
| Build Projects pages | Lead | Pending |
| Build Events pages | Lead | Pending |
| Build Gallery pages | Lead | Pending |

### Week 17-18: Insights & Engagement
| Task | Owner | Status |
|------|-------|--------|
| Build Articles pages | Lead | Pending |
| Build Stories pages | Lead | Pending |
| Build Resources page | Lead | Pending |
| Build Get Help page | Lead | Pending |
| Build Contact page | Lead | Pending |

### Week 19-20: Footer & Polish
| Task | Owner | Status |
|------|-------|--------|
| Build responsive footer | Lead | Pending |
| Implement support widget | Lead | Pending |
| Add newsletter subscription | Lead | Pending |
| Implement back-to-top | Lead | Pending |
| Final responsive QA | Lead | Pending |

## 4. SEO Implementation

### 4.1 Per-Page Metadata
```typescript
// Every public page must include:
{
  title: string,
  description: string,
  openGraph: {
    title: string,
    description: string,
    image: string,
    url: string,
  },
  twitter: {
    card: 'summary_large_image',
    title: string,
    description: string,
    image: string,
  },
  canonical: string,
}
```

### 4.2 Structured Data
- Organization schema on homepage
- Event schema on event pages
- Article schema on article pages
- BreadcrumbList on all pages

### 4.3 Technical SEO
- Unique title/meta per page
- Canonical URLs
- Sitemap generation
- Robots.txt
- 404/500 error pages

## 5. Acceptance Criteria

- [ ] All pages render correctly on mobile, tablet, desktop
- [ ] Homepage sections display CMS-managed content
- [ ] Event countdown works with real event data
- [ ] All internal links work correctly
- [ ] Images load with proper alt text
- [ ] SEO metadata present on all pages
- [ ] Page load time < 3 seconds on 3G
- [ ] Support widget functions correctly
- [ ] Newsletter subscription works
- [ ] Contact form submits successfully
- [ ] 404 page provides useful navigation
- [ ] Reduced motion support works
- [ ] Keyboard navigation works throughout

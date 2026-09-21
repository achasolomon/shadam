# SMHI Platform — Phase 2: CMS

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Pending

---

## 1. Objectives

- Build complete CMS admin interface
- Implement all content management modules
- Create media library with upload/optimization
- Implement publishing workflow
- Build dashboard with content overview

## 2. Deliverables

### 2.1 Admin Dashboard
- Content status overview (drafts, published, scheduled)
- Recent enquiries list
- Upcoming events widget
- Quick action buttons
- Activity feed

### 2.2 Pages Module
- Page list with filters
- Block-based page editor
- SEO metadata fields
- Slug generation
- Status management
- Preview capability

### 2.3 Projects Module
- Project list with category filters
- Create/edit project form
- Cover image upload
- Rich text body editor
- Category management
- Status workflow (draft → review → published)
- Archive functionality

### 2.4 Events Module
- Event list with date filters
- Create/edit event form
- Date/time/timezone picker
- Venue management
- Registration URL field
- Featured event toggle
- Countdown configuration

### 2.5 Gallery Module
- Album list
- Create/edit album
- Bulk image upload
- Drag-and-drop reordering
- Caption and alt text editing
- Cover image selection

### 2.6 Articles Module
- Article list with category/tag filters
- Create/edit article form
- Rich text editor
- Cover image upload
- Category and tag management
- Author selection
- SEO fields
- Schedule publishing

### 2.7 Stories Module
- Story list with consent status
- Create/edit story form
- Consent verification workflow
- Media attachment
- Review and approval flow

### 2.8 Team Module
- Team member list
- Create/edit profile
- Photo upload
- Social links
- Ordering management

### 2.9 Resources Module
- Resource list with category filters
- Upload resource files
- Category management
- Version tracking
- Download count display

### 2.10 Media Library
- Grid/list view
- Folder organization
- Search and filter
- Bulk upload
- Metadata editing (alt text, caption)
- Usage tracking
- Safe deletion checks

### 2.11 Enquiries
- Inbox view
- Status management (new, in progress, resolved)
- Assignment to team members
- Internal notes
- Category filtering

### 2.12 Settings
- Organization details
- Brand assets
- Support channels
- Social media links
- Contact information

### 2.13 Navigation Management
- Header menu editor
- Footer menu editor
- Drag-and-drop ordering
- External link support

### 2.14 Homepage Configuration
- Section visibility toggles
- Section ordering
- Featured content selection
- Event countdown configuration

## 3. Task Breakdown

### Week 7-8: Dashboard & Pages
| Task | Owner | Status |
|------|-------|--------|
| Build dashboard layout | Lead | Pending |
| Create dashboard widgets | Lead | Pending |
| Implement pages list | Lead | Pending |
| Build page editor | Lead | Pending |
| Add SEO fields | Lead | Pending |

### Week 9-10: Content Modules
| Task | Owner | Status |
|------|-------|--------|
| Implement projects module | Lead | Pending |
| Implement events module | Lead | Pending |
| Implement gallery module | Lead | Pending |
| Implement articles module | Lead | Pending |
| Implement stories module | Lead | Pending |

### Week 11-12: Media & Settings
| Task | Owner | Status |
|------|-------|--------|
| Build media library | Lead | Pending |
| Implement file upload | Lead | Pending |
| Add image optimization | Lead | Pending |
| Build settings pages | Lead | Pending |
| Implement navigation editor | Lead | Pending |

## 4. API Endpoints Required

### 4.1 Dashboard
```http
GET /api/v1/admin/dashboard/stats
GET /api/v1/admin/dashboard/recent-enquiries
GET /api/v1/admin/dashboard/upcoming-events
GET /api/v1/admin/dashboard/content-status
```

### 4.2 Media Upload
```http
POST /api/v1/admin/media/upload
POST /api/v1/admin/media/bulk-upload
GET    /api/v1/admin/media?folder=xxx&search=xxx
PATCH  /api/v1/admin/media/:id
DELETE /api/v1/admin/media/:id
```

## 5. Acceptance Criteria

- [ ] Dashboard shows accurate content statistics
- [ ] All CRUD operations work for each module
- [ ] Publishing workflow enforced (draft → review → published)
- [ ] Media upload with optimization works
- [ ] Bulk upload functions correctly
- [ ] Drag-and-drop ordering works
- [ ] SEO fields save and display correctly
- [ ] Status transitions follow defined workflow
- [ ] RBAC prevents unauthorized actions
- [ ] All forms have proper validation
- [ ] Empty states display correctly
- [ ] Loading states show during async operations

 
SHEDAM MENTAL HEALTH INITIATIVE
SMHI DIGITAL PLATFORM — SYSTEM & IMPLEMENTATION DOCUMENTATION
Product Architecture • CMS • UI/UX • Engineering Standards • Security • Operations
Version 1.0 • September 2026
 
1. Executive Specification
This document defines the product, architecture, UI/UX, CMS, engineering, security, accessibility, content-governance and operational requirements for the SHEDAM Mental Health Initiative (SMHI) digital platform. The product is explicitly not a static brochure website. It is a dynamic public website backed by a secure content-management system (CMS) that allows the SMHI media/content team to manage the organization's digital presence without developer intervention.
Item	Specification
Product	SMHI public website + secure CMS/admin platform
Primary users	Public visitors, people seeking support, partners, volunteers, media/content team, administrators
Design direction	Classic, sleek, calm, credible, human-centered and contemporary
Core content	Programs, projects, events, gallery, articles, stories, resources, team and organizational pages
Primary goal	Build trust, explain SMHI clearly, make support/help easy to find, and give the team control over publishing
Reference	Supplied SMHI flyer and approved homepage design direction

1.1 Core Organizational Positioning
The supplied flyer establishes the initial positioning:
CREATING AWARENESS.
BREAKING THE STIGMA.
CONNECTING PEOPLE TO PROFESSIONAL HELP.

•	Promoting mental-health awareness and education.
•	Breaking stigma surrounding mental health.
•	Connecting people with professional help.
•	Supporting vulnerable and indigent people to access mental-health care.
•	Building healthier and more supportive communities.
The website must preserve this positioning while allowing the organization to grow into additional verified programs and content.
2. Product Principles
Principle	Implementation rule
Content-first	CMS-managed content is a first-class product capability.
Human-centered	Mental-health information must be calm, clear, respectful and accessible.
Truthful maturity	Do not fabricate impact figures, testimonials, projects, partnerships or statistics.
Dynamic by default	Repeated content comes from structured CMS data, not hardcoded page markup.
Reusable UI	Build a coherent design system and reusable components.
Trust before decoration	Leadership, services, support routes, contact details and transparency matter more than visual effects.
Accessible	Target WCAG 2.2 AA practices.
Secure	RBAC, secure uploads, rate limits, audit logs and safe content rendering are mandatory.
Scalable	The architecture must support more projects, events, media and staff without redesigning the core system.



3. Information Architecture
HOME
├── ABOUT
│   ├── Who We Are
│   ├── Our Story
│   ├── Mission, Vision & Values
│   └── Our Team
├── WHAT WE DO
│   ├── Mental Health Awareness
│   ├── Mental Health Education
│   ├── Professional Referral
│   ├── Community Support
│   └── Vulnerable Persons Support
├── PROJECTS
├── EVENTS
├── GET HELP
├── GET INVOLVED
│   ├── Volunteer
│   ├── Partner
│   └── Support Us
├── INSIGHTS
│   ├── Articles
│   ├── Stories
│   └── Resources
├── GALLERY
└── CONTACT

The navigation must be CMS-manageable, but unrestricted nesting should not be allowed without project-lead approval.
4. Technical Architecture
                         ┌─────────────────────────┐
                         │       PUBLIC WEB         │
                         │   Responsive React UI    │
                         └────────────┬────────────┘
                                      │ HTTPS
                         ┌────────────▼────────────┐
                         │       APPLICATION API   │
                         │ Auth • CMS • Content    │
                         │ Events • Projects       │
                         └───────┬────────┬────────┘
                                 │        │
                    ┌────────────▼──┐  ┌──▼──────────────┐
                    │ Relational DB │  │ Object Storage  │
                    │ Content/Auth  │  │ Images/PDF/Media │
                    └───────────────┘  └─────────────────┘
                                 │
                         ┌───────▼────────┐
                         │ ADMIN / CMS UI  │
                         │ RBAC + Workflow │
                         └─────────────────┘

4.1 Recommended Stack
Layer	Recommendation
Frontend	Next.js + React + TypeScript
Backend	Node.js + NestJS (or equivalent modular Node API)
Database	MySQL
ORM	Prisma/Drizzle/TypeORM or approved equivalent
Media	S3-compatible object storage + CDN
Admin	React/Next.js authenticated CMS
Validation	Zod/class-validator or equivalent
Auth	Secure server-side session/cookie strategy; MFA-ready
Email	Transactional email provider
Deployment	Managed VPS/cloud/container deployment with staging + production

The exact stack can be changed by the project lead, but architectural boundaries must remain: presentation, API/business logic, persistence and media storage are separate concerns.
5. Core Data Model
Entity	Purpose	Key fields
User	CMS account	id, name, email, password_hash, role, status, last_login
Role	Permission group	id, name, permissions
MediaAsset	Central media metadata	id, url, type, alt_text, caption, size, dimensions, folder
Page	CMS-managed page	slug, title, body/blocks, status, SEO
Project	Program/project	title, slug, summary, body, category, dates, status, cover_media
Event	Upcoming/past event	title, slug, start_at, end_at, timezone, venue, registration_url, featured
GalleryAlbum	Photo collection	title, slug, description, cover_media, status
GalleryItem	Album media	album_id, media_id, caption, sort_order
Article	Insight/blog	title, slug, excerpt, body, author, cover_media, status, published_at
Story	Impact/testimonial	title, body, quote, person_label, media, consent_status, status
TeamMember	Staff/leadership	name, role, bio, photo, social_links, sort_order
Resource	Downloadable resource	title, category, file, description, published_at
Enquiry	Contact/support message	name, email, type, message, status, assigned_to
Subscriber	Newsletter	email, consent_at, status
SiteSetting	Global config	key, value, type, updated_by
AuditLog	Security/publishing trace	actor, action, entity, entity_id, timestamp, metadata

6. CMS Requirements
Module	Required capability
Dashboard	Content status, drafts, upcoming event, recent enquiries and quick actions
Pages	Create/edit, SEO, slug, status, reusable blocks
Projects	Create, edit, publish, archive, attach gallery/media, category and CTA
Events	Date/time/timezone, venue, registration, featured flag, countdown and archive
Gallery	Albums, bulk upload, captions, alt text, cover image, ordering
Articles	Rich text, cover image, author, categories/tags, SEO, scheduling
Stories	Story content, media, consent status, review and publication
Team	Profile, role, bio, photo, social links and ordering
Resources	PDF/file upload, category, version and visibility
Homepage	Select featured content and control approved section visibility/order
Navigation/Footer	Manage links, contact data, social channels and legal links
Media Library	Search, folders/tags, preview, metadata and safe deletion
Enquiries	Inbox, category, assignment, status and internal notes
Settings	Brand assets, organization details, support channels and social accounts
Audit Log	Record login, publish, delete, role and sensitive-setting actions

7. Publishing Workflow
DRAFT → IN REVIEW → APPROVED → SCHEDULED → PUBLISHED → ARCHIVED
              │
              └────────────→ REJECTED → DRAFT

MEDIA:
UPLOAD → VALIDATE → OPTIMIZE → ALT TEXT / METADATA → AVAILABLE

SENSITIVE STORY:
DRAFT → CONSENT VERIFIED → REVIEW → APPROVED → PUBLISHED

Direct publication from unreviewed content must be disabled for roles that do not have publishing authority.
8. CMS Roles & Permissions
Role	Responsibilities	Restrictions
Super Admin	Full system administration	Trusted personnel only
Content Manager	Create/edit/publish general content	No security/user administration
Media Manager	Media and gallery management	No system configuration
Editor/Reviewer	Review and approve content	No user/security administration
Events Manager	Events, registrations and countdown	Event domain only
Support Officer	Enquiries/support workflows	No unrelated CMS access
Read Only	View content/status/reporting	No publishing or destructive actions

9. UI/UX Design System
The approved visual direction should be calm and premium rather than generic NGO-template styling. Use the supplied flyer as the brand source and the approved mockup as the interaction/layout reference.
System	Standard
Color	Deep navy foundation + SMHI green accent + warm white/off-white surfaces
Typography	Highly readable modern sans-serif; maximum two font families
Grid	12-column desktop grid; constrained content width
Spacing	8px base spacing/token system
Radius	Moderate consistent radius; avoid excessive pills
Elevation	Very subtle shadows and borders
Buttons	Primary, secondary, ghost/text; consistent focus/hover/disabled states
Icons	One coherent icon family
Images	Real SMHI photography prioritized; consistent crop ratios
Motion	Subtle transitions; reduced-motion support
Tone	Calm, trustworthy, human, sophisticated

9.1 Homepage Sections
•	Header/navigation with prominent Support/Donate action.
•	Hero: organizational message + concise explanation + primary actions.
•	Upcoming event countdown card, displayed only when CMS has a qualifying featured event.
•	About/Who We Are with mission, vision and values preview.
•	What We Do / Services.
•	Projects section with editorial project cards and optional carousel.
•	Impact/milestones section that supports limited early-stage data without fake numbers.
•	Gallery preview from CMS albums.
•	You Are Not Alone / Get Help section.
•	Latest insights/resources.
•	Newsletter/updates subscription where operationally supported.
•	Footer with contact, social, navigation and support action.
•	Persistent support-chat launcher and carefully designed back-to-top control.
10. Event Countdown Specification
•	Event data is stored in the database; no hardcoded countdown date.
•	CMS user selects the homepage featured event.
•	Store event timezone explicitly.
•	Countdown uses an authoritative server time.
•	Display date/time as well as the countdown; countdown is never the only event information.
•	When event begins, show 'Event is Live' or configured state.
•	When event ends, remove it from active countdown and keep it in the past-events archive.
•	If no event is configured, hero remains visually complete without an empty card.
•	Mobile layout must not overflow horizontally.
11. Support Chat & Help Widget
•	Collapsed launcher: discreet, branded 'Need Support?' control.
•	Expanded panel: greeting, availability, approved channels and clear next steps.
•	Possible actions: Talk to Someone, Find Professional Help, WhatsApp/Phone/Email, Mental Health Resources.
•	Support contact information is CMS-configurable.
•	Do not represent an automated bot as a clinician or diagnostic service.
•	Do not diagnose or provide individualized clinical treatment through the website.
•	Emergency/crisis messaging must be approved by SMHI and clearly separated from ordinary enquiries.
•	Widget must not cover navigation, forms or important content on mobile.
12. Public Page Requirements
Page	Minimum content
Home	Hero, event, about, services, projects, impact, gallery, help CTA, insights, footer
About	Story, mission, vision, values, leadership and organizational facts
What We Do	Service categories with detail pages where needed
Projects	Filterable/project catalogue, project detail pages, media
Events	Upcoming/past events, detail pages, registration links
Gallery	Albums, responsive media grid/lightbox, captions
Insights	Articles, categories, search/filter, detail pages
Stories	Approved stories/testimonials with consent-controlled media
Resources	Mental-health educational resources/downloads
Get Help	Support/referral routes, approved resources and contact paths
Get Involved	Volunteer, partner, support opportunities
Contact	Form, contact details, location, social channels

13. Accessibility
•	Target WCAG 2.2 AA practices.
•	Keyboard access for every interactive element.
•	Visible focus states.
•	Semantic heading hierarchy.
•	Meaningful alt text for informative images.
•	Labels and accessible errors for all forms.
•	Do not use color alone for status.
•	Accessible dialogs, menus, carousels and accordions.
•	Reduced-motion support.
•	Countdown has an accessible static date/time equivalent.
14. Security
•	HTTPS in every production environment.
•	Modern password hashing; never store plaintext passwords.
•	Secure session/cookie handling.
•	Server-side RBAC enforcement.
•	Rate limits for login, password reset and public forms.
•	Input validation on every API boundary.
•	Rich-text sanitization to prevent XSS.
•	Strict upload validation: type, extension, size and storage policy.
•	Secrets only in environment/secrets management; never source control.
•	Audit logs for authentication, role changes, publishing, deletion and sensitive settings.
•	Regular database backups with restoration tests.
•	Admin pages protected from search indexing.
15. Mental-Health Content Governance
•	Educational content must be distinguished from individualized medical/clinical advice.
•	Professional referral information must be reviewed and kept current.
•	Sensitive stories require documented consent before publication.
•	Do not expose unnecessary identifying information about vulnerable people.
•	Public submissions that mention crises or severe distress require a defined moderation/escalation workflow.
•	Authorized reviewers must be able to unpublish sensitive content quickly.
•	Support responses must use approved guidance and escalation rules.
16. Media Management
•	Central media library with search and folders/tags.
•	Bulk image upload for the media team.
•	Store alt text, caption, photographer/source and optional copyright/license metadata.
•	Generate responsive derivatives for hero, card, gallery and mobile use.
•	Use WebP/AVIF where appropriate.
•	Lazy-load below-the-fold media.
•	Never serve huge original camera files to small cards.
•	Safe replacement/deletion rules so removing a file does not silently break published pages.
17. API Conventions
GET    /api/v1/projects
GET    /api/v1/projects/:slug
POST   /api/v1/admin/projects
PATCH  /api/v1/admin/projects/:id
DELETE /api/v1/admin/projects/:id

GET    /api/v1/events
GET    /api/v1/events/:slug
POST   /api/v1/admin/events

GET    /api/v1/gallery/albums
GET    /api/v1/gallery/albums/:slug

GET    /api/v1/articles
GET    /api/v1/articles/:slug

POST   /api/v1/enquiries
POST   /api/v1/newsletter/subscribe

POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

•	Use API versioning from first production release.
•	Use consistent success/error response shapes.
•	Paginate list endpoints.
•	Use unique constraints for slugs.
•	Keep controllers thin; business logic belongs in services/domain modules.
•	Never trust client-supplied role/permission values.
•	Never expose raw database errors.
18. Performance & SEO
•	Optimize for realistic mobile/Nigerian network conditions.
•	Use server rendering/caching where appropriate.
•	Minimize client-side JavaScript.
•	Index common DB filters: slug, status, published_at and foreign keys.
•	Optimize fonts and image delivery.
•	Unique title/meta per public page.
•	Canonical URLs, Open Graph metadata and sitemap.
•	Structured data for Organization, Event, Article and BreadcrumbList where appropriate.
•	404/500 pages must provide useful recovery navigation.
19. Analytics
•	Track page views and major landing pages.
•	Project/program engagement.
•	Event views and registration clicks.
•	Get Help/support interactions.
•	Resource downloads.
•	Newsletter subscriptions.
•	Support/donation CTA clicks.
•	Do not collect unnecessary sensitive mental-health information in analytics.
20. QA & Testing
Layer	Minimum requirement
Unit	Validation, permission checks, core services/utilities
Integration	Authentication, CRUD, publishing, uploads, enquiry submission
E2E	CMS publish flow, public navigation, event countdown, contact/support flows
Accessibility	Keyboard, focus, labels, contrast, responsive behavior
Security	Authorization bypass, XSS, upload abuse, rate limits
Performance	Representative mobile/network and production-like content volume
Content QA	Broken links, empty states, missing images, incorrect dates and copy

21. Engineering Standards for Junior Developers
•	Do not hardcode CMS-managed content.
•	Do not duplicate an existing component; extend/reuse it.
•	Do not change global styles to fix a local component.
•	Do not introduce dependencies without project-lead approval.
•	Frontend validation does not replace backend validation.
•	Do not put database queries in React components or route handlers.
•	Use the established service/repository/domain boundaries.
•	Every DB change requires a migration.
•	Every new public content type must consider SEO, status, media and empty states.
•	Every destructive action needs authorization and confirmation.
•	Never commit secrets or production credentials.
•	Before PR: format, lint, test and build.
•	UI changes must include screenshots or Figma reference in the PR.
22. Git & Pull Request Workflow
main        → production
staging     → QA/release candidate
feature/*   → feature work
fix/*       → bug fixes
hotfix/*    → urgent production fixes

PR must include:
• Requirement/issue reference
• Summary of change
• Screenshots for UI changes
• Tests executed
• Migration notes
• Deployment/config notes
• Known limitations

23. Delivery Roadmap
Phase	Deliverables
0 — Discovery	Confirm content model, stakeholders, Figma tokens, hosting, legal/privacy requirements
1 — Foundation	Repo, environments, DB, auth, design system, layout shell, API conventions
2 — CMS	RBAC, dashboard, pages, media, projects, events, gallery, articles
3 — Public site	Home, About, Services, Projects, Events, Gallery, Insights, Get Help, Contact
4 — Engagement	Support widget, newsletter, registration/donation integrations if approved
5 — Hardening	Accessibility, security, performance, SEO, analytics, backup/restore
6 — Launch	Content migration, UAT, training, deployment, monitoring and handover

24. Definition of Done
•	Requirement implemented and traceable to a task/user story.
•	Approved Figma design matched on desktop and mobile.
•	CMS-driven content works without source-code changes.
•	Loading, empty, error and success states implemented.
•	Frontend and backend validation implemented where relevant.
•	Authorization tested.
•	No normal-flow console errors.
•	Automated tests pass.
•	Production build passes.
•	SEO metadata exists for indexable content.
•	Images have appropriate alt text.
•	Documentation updated.
•	PR reviewed and approved.
25. Production Launch Checklist
•	Domain/DNS and HTTPS verified.
•	Production database migrated.
•	Backups and restore tested.
•	Object storage/CDN configured.
•	Least-privilege admin accounts created.
•	SMTP/email tested.
•	Contact/support flows tested.
•	Event timezone and countdown verified.
•	Support channels verified.
•	Privacy/legal pages published.
•	Sitemap/robots verified.
•	Analytics/error monitoring configured.
•	Mobile and desktop QA complete.
•	Content owner trained on CMS.
•	Rollback plan documented.
26. Senior Project Lead Guidance
The correct architectural choice for SMHI at this stage is a modular monolith with clean boundaries, not a distributed microservice system. The organization is growing, but the current product does not need the operational overhead of many independent services. Keep the codebase easy for junior developers to understand while making content, media, events and permissions strongly structured.
The most important product decision is to make the CMS as intentional as the public website. The media team should be able to publish a new project, upload a gallery, schedule an article, create an event and activate a homepage countdown without waiting for engineering. At the same time, sensitive content, permissions and publishing authority must remain controlled.
Do not build visual complexity for its own sake. The desired character is classic, sleek, calm and premium: strong grid, excellent typography, real photography, restrained motion, meaningful whitespace and excellent interaction states.
Appendix A — Initial Content Types
Content type	Minimum publishable fields
Project	Title, summary, body, category, cover image, status, related gallery, CTA
Event	Title, date/time/timezone, venue, description, image, registration, status
Gallery Album	Title, description, cover image, items, status
Article	Title, excerpt, body, author, cover image, category, SEO, publish date
Story	Title, story, person label, media, consent, status
Team Member	Name, role, biography, photo, status
Resource	Title, description, category, file, status

Appendix B — Content Status Model
Status	Public?	Meaning
Draft	No	Work in progress
In Review	No	Awaiting editorial review
Approved	No	Approved but not published
Scheduled	Future	Automatic publication at configured time
Published	Yes	Live
Archived	No/optional	Historical content retained
Rejected	No	Returned for correction


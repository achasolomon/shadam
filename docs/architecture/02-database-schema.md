# SMHI Platform — Database Schema Design

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Approved

---

## 1. Schema Design Principles

1. **Referential Integrity** — Foreign keys enforced at DB level
2. **Soft Deletes** — Use `deletedAt` instead of hard deletes for audit trail
3. **Timestamps** — Every table has `createdAt` and `updatedAt`
4. **Slugs** — Unique slugs for all public-facing content
5. **Status Fields** — Consistent status enum across content types
6. **Audit Trail** — Sensitive actions logged to `audit_logs`

## 2. Core Tables

### 2.1 Users & Authentication

```sql
-- Users table
CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY,  -- UUID
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id       CHAR(36) NOT NULL,
  status        ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  avatar_url    VARCHAR(500),
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Roles table
CREATE TABLE roles (
  id          CHAR(36) PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON NOT NULL,  -- Structured permissions object
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.2 Pages (CMS)

```sql
CREATE TABLE pages (
  id           CHAR(36) PRIMARY KEY,
  slug         VARCHAR(255) UNIQUE NOT NULL,
  title        VARCHAR(255) NOT NULL,
  body         JSON NOT NULL,  -- Block editor content
  status       ENUM('draft', 'in_review', 'approved', 'scheduled', 'published', 'archived') DEFAULT 'draft',
  seo_title    VARCHAR(255),
  seo_description TEXT,
  seo_image    VARCHAR(500),
  author_id    CHAR(36) NOT NULL,
  published_at TIMESTAMP NULL,
  scheduled_at TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMP NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 2.3 Projects

```sql
CREATE TABLE projects (
  id            CHAR(36) PRIMARY KEY,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  title         VARCHAR(255) NOT NULL,
  summary       TEXT,
  body          JSON NOT NULL,
  category      VARCHAR(100),
  cover_media_id CHAR(36),
  status        ENUM('draft', 'in_review', 'approved', 'published', 'archived') DEFAULT 'draft',
  start_date    DATE,
  end_date      DATE,
  cta_label     VARCHAR(100),
  cta_url       VARCHAR(500),
  author_id     CHAR(36) NOT NULL,
  published_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (cover_media_id) REFERENCES media_assets(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 2.4 Events

```sql
CREATE TABLE events (
  id               CHAR(36) PRIMARY KEY,
  slug             VARCHAR(255) UNIQUE NOT NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  body             JSON,
  start_at         TIMESTAMP NOT NULL,
  end_at           TIMESTAMP,
  timezone         VARCHAR(50) DEFAULT 'Africa/Lagos',
  venue            VARCHAR(255),
  venue_address    TEXT,
  cover_media_id   CHAR(36),
  registration_url VARCHAR(500),
  is_featured      BOOLEAN DEFAULT FALSE,
  status           ENUM('draft', 'in_review', 'approved', 'published', 'archived') DEFAULT 'draft',
  author_id        CHAR(36) NOT NULL,
  published_at     TIMESTAMP NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMP NULL,
  FOREIGN KEY (cover_media_id) REFERENCES media_assets(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 2.5 Gallery

```sql
CREATE TABLE gallery_albums (
  id            CHAR(36) PRIMARY KEY,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  cover_media_id CHAR(36),
  status        ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  author_id     CHAR(36) NOT NULL,
  published_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (cover_media_id) REFERENCES media_assets(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE gallery_items (
  id         CHAR(36) PRIMARY KEY,
  album_id   CHAR(36) NOT NULL,
  media_id   CHAR(36) NOT NULL,
  caption    VARCHAR(500),
  alt_text   VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media_assets(id)
);
```

### 2.6 Articles

```sql
CREATE TABLE articles (
  id            CHAR(36) PRIMARY KEY,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  title         VARCHAR(255) NOT NULL,
  excerpt       TEXT,
  body          JSON NOT NULL,
  cover_media_id CHAR(36),
  category      VARCHAR(100),
  author_id     CHAR(36) NOT NULL,
  status        ENUM('draft', 'in_review', 'approved', 'scheduled', 'published', 'archived') DEFAULT 'draft',
  seo_title     VARCHAR(255),
  seo_description TEXT,
  published_at  TIMESTAMP NULL,
  scheduled_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (cover_media_id) REFERENCES media_assets(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE article_tags (
  article_id CHAR(36) NOT NULL,
  tag        VARCHAR(100) NOT NULL,
  PRIMARY KEY (article_id, tag),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
```

### 2.7 Stories (Testimonials)

```sql
CREATE TABLE stories (
  id              CHAR(36) PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  body            TEXT NOT NULL,
  quote           TEXT,
  person_label    VARCHAR(255),
  media_id        CHAR(36),
  consent_status  ENUM('pending', 'verified', 'denied') DEFAULT 'pending',
  consent_date    TIMESTAMP NULL,
  consent_notes   TEXT,
  author_id       CHAR(36) NOT NULL,
  status          ENUM('draft', 'in_review', 'approved', 'published', 'archived') DEFAULT 'draft',
  published_at    TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  FOREIGN KEY (media_id) REFERENCES media_assets(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 2.8 Team Members

```sql
CREATE TABLE team_members (
  id         CHAR(36) PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  role       VARCHAR(255) NOT NULL,
  bio        TEXT,
  photo_url  VARCHAR(500),
  email      VARCHAR(255),
  phone      VARCHAR(50),
  social_links JSON,  -- { linkedin, twitter, etc }
  sort_order INT DEFAULT 0,
  status     ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### 2.9 Resources

```sql
CREATE TABLE resources (
  id            CHAR(36) PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  category      VARCHAR(100),
  file_url      VARCHAR(500) NOT NULL,
  file_size     INT,
  file_type     VARCHAR(50),
  version       VARCHAR(50),
  download_count INT DEFAULT 0,
  status        ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  author_id     CHAR(36) NOT NULL,
  published_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 2.10 Media Assets

```sql
CREATE TABLE media_assets (
  id           CHAR(36) PRIMARY KEY,
  url          VARCHAR(500) NOT NULL,
  original_url VARCHAR(500),
  type         ENUM('image', 'video', 'document', 'audio') NOT NULL,
  mime_type    VARCHAR(100),
  file_name    VARCHAR(255) NOT NULL,
  file_size    INT,
  width        INT,
  height       INT,
  alt_text     VARCHAR(255),
  caption      VARCHAR(500),
  photographer VARCHAR(255),
  source       VARCHAR(255),
  folder       VARCHAR(255),
  tags         JSON,
  uploaded_by  CHAR(36) NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMP NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

### 2.11 Enquiries

```sql
CREATE TABLE enquiries (
  id          CHAR(36) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  type        ENUM('general', 'support', 'partnership', 'volunteer', 'media', 'other') DEFAULT 'general',
  subject     VARCHAR(255),
  message     TEXT NOT NULL,
  status      ENUM('new', 'in_progress', 'resolved', 'escalated', 'closed') DEFAULT 'new',
  assigned_to CHAR(36),
  notes       JSON,  -- Internal notes array
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### 2.12 Subscribers

```sql
CREATE TABLE subscribers (
  id         CHAR(36) PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  status     ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
  consent_at TIMESTAMP NOT NULL,
  source     VARCHAR(100),  -- 'website', 'event', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.13 Site Settings

```sql
CREATE TABLE site_settings (
  id         CHAR(36) PRIMARY KEY,
  `key`      VARCHAR(255) UNIQUE NOT NULL,
  value      TEXT,
  type       ENUM('text', 'textarea', 'image', 'json', 'boolean', 'number') DEFAULT 'text',
  group_name VARCHAR(100),
  updated_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### 2.14 Navigation

```sql
CREATE TABLE navigation_items (
  id         CHAR(36) PRIMARY KEY,
  label      VARCHAR(255) NOT NULL,
  url        VARCHAR(500),
  page_id    CHAR(36),
  parent_id  CHAR(36),
  sort_order INT DEFAULT 0,
  location   ENUM('header', 'footer', 'both') DEFAULT 'header',
  is_external BOOLEAN DEFAULT FALSE,
  status     ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id),
  FOREIGN KEY (parent_id) REFERENCES navigation_items(id)
);
```

### 2.15 Homepage Sections

```sql
CREATE TABLE homepage_sections (
  id          CHAR(36) PRIMARY KEY,
  section_type VARCHAR(100) NOT NULL,
  title       VARCHAR(255),
  config      JSON NOT NULL,  -- Section-specific configuration
  sort_order  INT DEFAULT 0,
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.16 Audit Log

```sql
CREATE TABLE audit_logs (
  id         CHAR(36) PRIMARY KEY,
  actor_id   CHAR(36),
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(100) NOT NULL,
  entity_id  CHAR(36),
  metadata   JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id)
);
```

## 3. Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX idx_media_assets_type ON media_assets(type);
CREATE INDEX idx_media_assets_folder ON media_assets(folder);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_type ON enquiries(type);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_site_settings_key ON site_settings(`key`);
```

## 4. Seed Data

### 4.1 Default Roles

```sql
INSERT INTO roles (id, name, description, permissions) VALUES
('r1', 'Super Admin', 'Full system administration', '{"*": "*"}'),
('r2', 'Content Manager', 'Create/edit/publish content', '{"pages": "*", "projects": "*", "articles": "*", "stories": "*"}'),
('r3', 'Media Manager', 'Media and gallery management', '{"media": "*", "gallery": "*"}'),
('r4', 'Editor', 'Review and approve content', '{"review": "*", "publish": "*"}'),
('r5', 'Events Manager', 'Events management', '{"events": "*"}'),
('r6', 'Support Officer', 'Enquiries management', '{"enquiries": "*"}'),
('r7', 'Read Only', 'View content', '{"read": "*"}');
```

### 4.2 Default Site Settings

```sql
INSERT INTO site_settings (`key`, value, type, group_name) VALUES
('site_name', 'SHEDAM Mental Health Initiative', 'text', 'general'),
('site_tagline', 'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.', 'textarea', 'general'),
('contact_email', 'info@shedam.org', 'text', 'contact'),
('contact_phone', '+234 XXX XXX XXXX', 'text', 'contact'),
('contact_address', '', 'textarea', 'contact'),
('support_whatsapp', '', 'text', 'support'),
('support_phone', '', 'text', 'support'),
('support_email', 'support@shedam.org', 'text', 'support'),
('facebook_url', '', 'text', 'social'),
('twitter_url', '', 'text', 'social'),
('instagram_url', '', 'text', 'social'),
('linkedin_url', '', 'text', 'social'),
('youtube_url', '', 'text', 'social');
```

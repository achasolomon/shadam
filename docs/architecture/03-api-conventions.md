# SMHI Platform — API Conventions

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Approved

---

## 1. Base URL

```
Development: http://localhost:3002/api/v1
Production:  https://api.shedam.org/api/v1
```

## 2. Response Format

### 2.1 Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2.2 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### 2.3 Single Item Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "slug": "...",
    ...
  }
}
```

## 3. HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Read resources | `GET /api/v1/projects` |
| `POST` | Create resources | `POST /api/v1/admin/projects` |
| `PATCH` | Update resources | `PATCH /api/v1/admin/projects/:id` |
| `DELETE` | Soft-delete resources | `DELETE /api/v1/admin/projects/:id` |

## 4. Authentication

### 4.1 Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@shedam.org",
  "password": "securepassword"
}
```

Response sets HTTP-only cookie with JWT token.

### 4.2 Authenticated Requests

```http
GET /api/v1/admin/projects
Cookie: smhi_session=<jwt_token>
```

### 4.3 Get Current User

```http
GET /api/v1/auth/me
Cookie: smhi_session=<jwt_token>
```

### 4.4 Logout

```http
POST /api/v1/auth/logout
```

## 5. Public Endpoints (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/projects` | GET | List published projects |
| `/api/v1/projects/:slug` | GET | Get project by slug |
| `/api/v1/events` | GET | List published events |
| `/api/v1/events/:slug` | GET | Get event by slug |
| `/api/v1/gallery/albums` | GET | List published albums |
| `/api/v1/gallery/albums/:slug` | GET | Get album by slug |
| `/api/v1/articles` | GET | List published articles |
| `/api/v1/articles/:slug` | GET | Get article by slug |
| `/api/v1/stories` | GET | List published stories |
| `/api/v1/team` | GET | List active team members |
| `/api/v1/resources` | GET | List published resources |
| `/api/v1/pages/:slug` | GET | Get page by slug |
| `/api/v1/enquiries` | POST | Submit enquiry |
| `/api/v1/newsletter/subscribe` | POST | Subscribe to newsletter |
| `/api/v1/homepage` | GET | Get homepage configuration |

## 6. Admin Endpoints (Auth Required)

### 6.1 Projects

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/projects` | GET | List all projects (incl. drafts) |
| `/api/v1/admin/projects` | POST | Create project |
| `/api/v1/admin/projects/:id` | GET | Get project by ID |
| `/api/v1/admin/projects/:id` | PATCH | Update project |
| `/api/v1/admin/projects/:id` | DELETE | Soft-delete project |
| `/api/v1/admin/projects/:id/publish` | POST | Publish project |
| `/api/v1/admin/projects/:id/archive` | POST | Archive project |

### 6.2 Events

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/events` | GET | List all events |
| `/api/v1/admin/events` | POST | Create event |
| `/api/v1/admin/events/:id` | GET | Get event by ID |
| `/api/v1/admin/events/:id` | PATCH | Update event |
| `/api/v1/admin/events/:id` | DELETE | Soft-delete event |
| `/api/v1/admin/events/featured` | GET | Get featured event |

### 6.3 Media

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/media` | GET | List media assets |
| `/api/v1/admin/media/upload` | POST | Upload media file |
| `/api/v1/admin/media/:id` | GET | Get media asset |
| `/api/v1/admin/media/:id` | PATCH | Update metadata |
| `/api/v1/admin/media/:id` | DELETE | Soft-delete media |

### 6.4 Pages

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/pages` | GET | List all pages |
| `/api/v1/admin/pages` | POST | Create page |
| `/api/v1/admin/pages/:id` | GET | Get page by ID |
| `/api/v1/admin/pages/:id` | PATCH | Update page |
| `/api/v1/admin/pages/:id` | DELETE | Soft-delete page |

### 6.5 Users (Super Admin Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/users` | GET | List all users |
| `/api/v1/admin/users` | POST | Create user |
| `/api/v1/admin/users/:id` | GET | Get user by ID |
| `/api/v1/admin/users/:id` | PATCH | Update user |
| `/api/v1/admin/users/:id` | DELETE | Deactivate user |

## 7. Filtering & Pagination

### 7.1 Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `sort` | string | `created_at` | Sort field |
| `order` | string | `desc` | Sort direction (`asc`/`desc`) |
| `search` | string | - | Search term |
| `status` | string | `published` | Content status |
| `category` | string | - | Filter by category |

### 7.2 Example

```http
GET /api/v1/articles?page=1&limit=20&category=mental-health&sort=published_at&order=desc
```

### 7.3 Response with Pagination

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

## 8. Content Status Workflow

```
DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → ARCHIVED
              │
              └──→ REJECTED → DRAFT
```

### 8.1 Status Transition Endpoints

```http
POST /api/v1/admin/projects/:id/submit-review    # DRAFT → IN_REVIEW
POST /api/v1/admin/projects/:id/approve          # IN_REVIEW → APPROVED
POST /api/v1/admin/projects/:id/reject           # IN_REVIEW → REJECTED
POST /api/v1/admin/projects/:id/schedule         # APPROVED → SCHEDULED
POST /api/v1/admin/projects/:id/publish          # APPROVED/SCHEDULED → PUBLISHED
POST /api/v1/admin/projects/:id/archive          # PUBLISHED → ARCHIVED
```

## 9. File Upload

### 9.1 Upload Endpoint

```http
POST /api/v1/admin/media/upload
Content-Type: multipart/form-data

file: <binary>
alt_text: "Description of image"
caption: "Optional caption"
folder: "projects"
```

### 9.2 Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "/uploads/media/uuid-filename.webp",
    "thumbnailUrl": "/uploads/media/uuid-filename-thumb.webp",
    "type": "image",
    "mimeType": "image/webp",
    "width": 1200,
    "height": 800,
    "fileSize": 125000
  }
}
```

### 9.3 Upload Constraints

| Constraint | Value |
|-----------|-------|
| Max file size | 10MB (images), 50MB (video) |
| Allowed image types | JPG, PNG, GIF, WebP, AVIF |
| Allowed doc types | PDF, DOC, DOCX |
| Allowed video types | MP4, WebM |
| Thumbnail sizes | 150x150, 300x300, 600x400 |

## 10. Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Login | 5 attempts per 15 minutes |
| Password Reset | 3 attempts per hour |
| Public Forms | 10 submissions per hour |
| File Upload | 20 uploads per hour |
| General API | 100 requests per minute |

## 11. CORS

```typescript
{
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

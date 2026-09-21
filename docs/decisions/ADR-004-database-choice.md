# ADR-004: Database Choice

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer

---

## Context

We need a relational database for:
- CMS content storage
- User authentication
- Event and project management
- Media asset tracking
- Audit logging

The database must be reliable, well-supported, and suitable for the Namecheap hosting environment.

## Decision

**Use MySQL 8.x as the primary database with Prisma as the ORM.**

## Rationale

### Options Considered

1. **MySQL 8.x** ✅
   - Widely supported
   - Good hosting compatibility
   - Strong community
   - Good performance
   - JSON support for flexible data

2. **PostgreSQL**
   - More features
   - Better JSON support
   - ❌ Less hosting support on Namecheap
   - ❌ Overkill for our needs

3. **SQLite**
   - Simple setup
   - ❌ Not suitable for production
   - ❌ Limited concurrency

4. **MongoDB**
   - Flexible schema
   - ❌ We need relational data
   - ❌ Less ACID compliance

### Why MySQL?

- **Hosting**: Namecheap has good MySQL support
- **Simplicity**: Easier for junior developers
- **Performance**: Good for CMS workloads
- **JSON Support**: MySQL 8.x has JSON columns
- **Community**: Large ecosystem

### Why Prisma?

- **Type Safety**: End-to-end TypeScript types
- **Migrations**: Automatic migration generation
- **Relations**: Easy relationship handling
- **DX**: Great developer experience
- **Documentation**: Excellent docs

## Consequences

### Positive
- Reliable and battle-tested
- Good Namecheap compatibility
- Type-safe queries with Prisma
- Easy migration management
- Good performance for CMS

### Negative
- Less feature-rich than PostgreSQL
- JSON queries less powerful
- No full-text search (use application-level search)

### Mitigations
- Use MySQL JSON columns for flexible data
- Add search functionality at application level
- Index frequently queried columns

## Prisma Schema Pattern

```typescript
// Example entity
model Project {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  summary     String?  @db.Text
  body        Json
  category    String?
  status      Status   @default(DRAFT)
  coverMedia  Media?   @relation(fields: [coverMediaId], references: [id])
  coverMediaId String?
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([slug])
  @@index([status])
  @@index([category])
}
```

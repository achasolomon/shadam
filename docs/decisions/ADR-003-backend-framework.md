# ADR-003: Backend Framework Choice

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer

---

## Context

We need a backend API that:
- Handles CMS operations with RBAC
- Manages content CRUD
- Handles file uploads
- Is maintainable by junior developers
- Follows the "modular monolith" architecture guidance

## Decision

**Use NestJS with TypeScript for the backend API.**

## Rationale

### Options Considered

1. **NestJS** ✅
   - Modular architecture
   - Strong TypeScript support
   - Built-in RBAC support
   - Good validation (class-validator)
   - Enterprise-grade patterns
   - Good for teams

2. **Express.js**
   - Simple and flexible
   - ❌ No built-in structure
   - ❌ Manual RBAC implementation
   - ❌ Less maintainable at scale

3. **Fastify**
   - Very fast
   - ❌ Smaller ecosystem
   - ❌ Less enterprise patterns

4. **Next.js API Routes**
   - Simplifies deployment
   - ❌ Not suitable for complex APIs
   - ❌ Limited middleware support
   - ❌ Not modular enough

5. **AdonisJS**
   - Full-stack framework
   - ❌ Smaller community
   - ❌ Less familiar to team

### Why NestJS?

- **Modular**: Matches PM's "modular monolith" guidance
- **TypeScript**: End-to-end type safety
- **RBAC**: Built-in guards and decorators
- **Validation**: class-validator integration
- **Maintainable**: Clear structure for junior developers
- **Scalable**: Can extract modules to services later

## Consequences

### Positive
- Clear module boundaries
- Built-in dependency injection
- Strong TypeScript integration
- Good for RBAC implementation
- Enterprise patterns

### Negative
- More verbose than Express
- Learning curve for decorators
- More boilerplate code

### Mitigations
- Create module templates
- Document common patterns
- Code review for junior developers

## Module Structure

```typescript
// Example module structure
@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
```

## NestJS Configuration

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(','),
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.setGlobalPrefix('api/v1');
  
  await app.listen(3002);
}
bootstrap();
```

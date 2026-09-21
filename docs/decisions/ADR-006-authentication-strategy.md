# ADR-006: Authentication Strategy

**Date:** September 2026  
**Status:** Accepted  
**Deciders:** Lead Software Engineer

---

## Context

We need authentication for:
- Admin CMS users
- Content editors
- Support officers
- Super administrators

The system must support RBAC with 7 defined roles.

## Decision

**Use server-side sessions with HTTP-only cookies and JWT tokens, with bcrypt for password hashing.**

## Rationale

### Options Considered

1. **Server-side Sessions + HTTP-only Cookies** ✅
   - Secure by default
   - No token storage in browser
   - Easy to revoke
   - Good for CMS

2. **JWT in localStorage**
   - Stateless
   - ❌ XSS vulnerability
   - ❌ Harder to revoke
   - ❌ Not recommended for CMS

3. **Third-party Auth (Auth0, Firebase)**
   - Quick setup
   - ❌ Vendor lock-in
   - ❌ Cost at scale
   - ❌ Less control

4. **NextAuth.js**
   - Good for Next.js
   - ❌ More complexity than needed
   - ❌ Less control over sessions

### Why Server-side Sessions?

- **Security**: HTTP-only cookies prevent XSS
- **Revocable**: Can invalidate sessions
- **Simple**: Easy to implement
- **Control**: Full control over session data

### Why bcrypt?

- **Industry Standard**: Well-tested
- **Slow by Design**: Prevents brute force
- **Salted**: Each hash unique

## RBAC Implementation

```typescript
// Role-based guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );
    
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Usage in controller
@UseGuards(AuthGuard, RolesGuard)
@Roles('super_admin', 'content_manager')
@Get('admin/projects')
findAll() {
  return this.projectsService.findAll();
}
```

## Session Configuration

```typescript
// Session settings
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
}
```

## Consequences

### Positive
- Secure by default (HTTP-only)
- Easy to revoke sessions
- Full control over session data
- Good for RBAC

### Negative
- Server-side storage required
- Need session management
- Scaling considerations

### Mitigations
- Use database for sessions (scalable)
- Implement session cleanup
- Monitor session usage

## Security Measures

1. **Password Hashing**: bcrypt with 12 rounds
2. **Session Security**: HTTP-only, secure, sameSite
3. **Rate Limiting**: 5 attempts per 15 minutes
4. **Account Lockout**: After 10 failed attempts
5. **Audit Logging**: All auth events logged

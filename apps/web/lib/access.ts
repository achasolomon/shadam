export const ROLE_NAMES = {
  SUPER_ADMIN: 'Super Admin',
  CONTENT_MANAGER: 'Content Manager',
  MEDIA_MANAGER: 'Media Manager',
  EDITOR: 'Editor',
  EVENTS_MANAGER: 'Events Manager',
  SUPPORT_OFFICER: 'Support Officer',
  READ_ONLY: 'Read Only',
} as const;

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

export interface AuthUserLike {
  role?: {
    name?: string;
    permissions?: Record<string, unknown>;
  } | null;
}

export function isSuperAdmin(user: AuthUserLike | null | undefined): boolean {
  if (!user?.role) return false;
  if (user.role.name === ROLE_NAMES.SUPER_ADMIN) return true;
  const perms = user.role.permissions;
  return !!perms && (perms['*'] === '*' || perms['*'] === true);
}

export function hasRole(user: AuthUserLike | null | undefined, ...roles: string[]): boolean {
  if (!user?.role?.name) return false;
  return roles.includes(user.role.name);
}

export function hasPermission(user: AuthUserLike | null | undefined, required: string): boolean {
  const perms = user?.role?.permissions;
  if (!perms || typeof perms !== 'object') return false;
  if (perms['*'] === '*' || perms['*'] === true) return true;

  const [resource, action] = required.includes(':') ? required.split(':') : [required, undefined];
  const value = (perms as Record<string, unknown>)[resource];
  if (value === undefined) return false;
  if (value === '*' || value === true) return true;
  if (action && typeof value === 'object' && value !== null) {
    const nested = value as Record<string, unknown>;
    if (nested[action] === true || nested[action] === '*' || nested['*'] === true || nested['*'] === '*') {
      return true;
    }
  }
  if (Array.isArray(value) && value.includes(action || required)) return true;
  return false;
}

export function canAccess(
  user: AuthUserLike | null | undefined,
  opts: { roles?: string[]; permissions?: string[] },
): boolean {
  if (isSuperAdmin(user)) return true;
  if (opts.roles?.length && hasRole(user, ...opts.roles)) return true;
  if (opts.permissions?.length && opts.permissions.some((p) => hasPermission(user, p))) return true;
  if (!opts.roles?.length && !opts.permissions?.length) return true;
  return false;
}

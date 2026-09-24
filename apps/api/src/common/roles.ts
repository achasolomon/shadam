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

export function isSuperAdminRole(role?: { name?: string; permissions?: Record<string, unknown> } | null): boolean {
  if (!role) return false;
  if (role.name === ROLE_NAMES.SUPER_ADMIN) return true;
  const perms = role.permissions;
  return !!perms && (perms['*'] === '*' || perms['*'] === true);
}

export function hasRole(user: { role?: { name?: string } } | null | undefined, ...roles: string[]): boolean {
  if (!user?.role?.name) return false;
  return roles.includes(user.role.name);
}

export function hasPermission(
  role: { permissions?: Record<string, unknown> } | null | undefined,
  required: string,
): boolean {
  const perms = role?.permissions;
  if (!perms || typeof perms !== 'object') return false;

  if (perms['*'] === '*' || perms['*'] === true) return true;

  const [resource, action] = required.includes(':') ? required.split(':') : [required, undefined];
  const value = perms[resource];

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

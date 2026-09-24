'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, UserCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/components/admin/auth-provider';
import { adminNav, filterNavForUser } from '@/lib/admin-nav';
import { resolveMediaUrl } from '@/lib/api';

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
  if (href === '/admin/settings') return pathname === '/admin/settings' || pathname.startsWith('/admin/settings/');
  return pathname === href || pathname.startsWith(href + '/');
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const sections = adminNav
    .map((section) => ({ ...section, items: filterNavForUser(section.items, user) }))
    .filter((section) => section.items.length > 0);

  return (
    <nav className="flex-1 overflow-y-auto p-3">
      {sections.map((section, si) => (
        <div key={si} className={si > 0 ? 'mt-5' : ''}>
          {section.title && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {section.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (pathname === '/admin/login' || pathname === '/admin/invite') return <>{children}</>;

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">SHEDAM</p>
            <p className="text-[10px] text-gray-500">Admin Panel</p>
          </div>
        </div>
        <NavList />
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/admin/profile"
            className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
            title="My Profile"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.avatarUrl ? (
                <img
                  src={resolveMediaUrl(user.avatarUrl)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0) || 'A'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
              <p className="truncate text-[10px] text-gray-500">{user.role?.name}</p>
            </div>
            <UserCircle className="h-4 w-4 shrink-0 text-gray-400" />
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
              <span className="text-sm font-semibold text-gray-900">SHEDAM Admin</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-gray-200 p-4">
              <Link
                href="/admin/profile"
                onClick={() => setMobileOpen(false)}
                className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <UserCircle className="h-5 w-5" />
                My Profile
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-gray-500 hover:text-primary sm:inline"
            >
              View Site
            </Link>
            <Link
              href="/admin/profile"
              title="My Profile"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary"
            >
              {user.avatarUrl ? (
                <img
                  src={resolveMediaUrl(user.avatarUrl)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0) || 'A'
              )}
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

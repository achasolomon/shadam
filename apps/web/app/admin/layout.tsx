'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, Image, Newspaper, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react';

const nav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FileText },
  { label: 'Events', href: '/admin/dashboard/events', icon: Calendar },
  { label: 'Media', href: '/admin/dashboard/media', icon: Image },
  { label: 'Articles', href: '/admin/dashboard/articles', icon: Newspaper },
  { label: 'Enquiries', href: '/admin/dashboard/enquiries', icon: MessageSquare },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 border-r border-border bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">SHEDAM</p>
            <p className="text-[10px] text-text-secondary">Admin Panel</p>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-alt hover:text-dark'}`}>
                    <item.icon className="h-5 w-5" /> {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 border-t border-border p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt hover:text-dark">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <span className="text-sm font-semibold text-dark">SHEDAM Admin</span>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-alt'}`}>
                      <item.icon className="h-5 w-5" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-text-secondary hover:bg-surface-alt lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <p className="text-sm font-medium text-dark">Admin</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

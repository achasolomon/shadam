'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ChevronRight, Command } from 'lucide-react';
import { settingsGroups, settingsGroupBySlug } from '@/lib/admin-nav';
import { labelFor } from '@/components/admin/settings/settings-config';
import {
  SettingsProvider,
  useSettingsStore,
  type Setting,
} from '@/components/admin/settings/settings-provider';

function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, dirtyByGroup } = useSettingsStore();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const currentSlug = pathname.split('/')[3] || 'general';

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    return settings
      .filter((s) => {
        const hay = `${s.key} ${labelFor(s.key)} ${s.groupName || ''}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 20);
  }, [debounced, settings]);

  const groupedResults = useMemo(() => {
    const map = new Map<string, Setting[]>();
    for (const r of results) {
      const g = r.groupName || 'general';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    }
    return [...map.entries()];
  }, [results]);

  const flatResults = useMemo(() => results, [results]);

  const goResult = (s: Setting) => {
    const g = s.groupName || 'general';
    setQuery('');
    setCmdOpen(false);
    setActiveIdx(0);
    router.push(`/admin/settings/${g}?focus=${encodeURIComponent(s.key)}`);
  };

  // Cmd/Ctrl+K palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
      // "/" focuses sidebar search when not typing
      if (
        e.key === '/' &&
        !cmdOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdOpen]);

  useEffect(() => {
    if (cmdOpen) cmdInputRef.current?.focus();
  }, [cmdOpen]);

  // Keyboard nav in results
  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!flatResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      goResult(flatResults[activeIdx] || flatResults[0]);
    }
  };

  const totalDirty = Object.values(dirtyByGroup).reduce((n, a) => n + a.length, 0);

  return (
    <div className="-m-6 min-h-[calc(100vh-4rem)] bg-gray-50 lg:-m-8">
      <div className="p-6 lg:p-8">
        {/* Breadcrumbs + header */}
        <nav className="mb-1 flex items-center gap-1.5 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/admin/settings" className="hover:text-primary">
            Settings
          </Link>
          {currentSlug !== 'general' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-600">{settingsGroupBySlug(currentSlug)?.title || currentSlug}</span>
            </>
          )}
        </nav>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Site configuration grouped by page — pick a section on the left.
              {totalDirty > 0 && (
                <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600">
                  {totalDirty} unsaved
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <Search className="h-4 w-4" />
            Search…
            <kbd className="ml-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              <Command className="mr-0.5 inline h-3 w-3" />K
            </kbd>
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left nav */}
          <aside className="w-full shrink-0 lg:w-60">
            {/* Mobile: horizontal chips */}
            <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
              {settingsGroups.map((g) => {
                const active = currentSlug === g.slug;
                const dirty = (dirtyByGroup[g.slug] || []).length > 0;
                return (
                  <Link
                    key={g.slug}
                    href={`/admin/settings/${g.slug}`}
                    className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                      active
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    {g.title}
                    {dirty && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                  </Link>
                );
              })}
            </div>

            {/* Desktop search */}
            <div className="relative mb-3 hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search settings…  /"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {query.trim() && (
              <div className="mb-3 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {groupedResults.length === 0 ? (
                  <p className="px-2 py-3 text-xs text-gray-400">No matches.</p>
                ) : (
                  groupedResults.map(([g, items]) => {
                    const meta = settingsGroupBySlug(g);
                    return (
                      <div key={g} className="mb-1">
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          {meta?.title || g}
                        </p>
                        {items.map((s) => {
                          const flatIdx = flatResults.indexOf(s);
                          return (
                            <button
                              key={s.key}
                              onClick={() => goResult(s)}
                              onMouseEnter={() => setActiveIdx(flatIdx)}
                              className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs ${
                                flatIdx === activeIdx
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span className="font-medium">{labelFor(s.key)}</span>
                              <span className="ml-1.5 font-mono text-[10px] text-gray-400">{s.key}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Desktop vertical nav */}
            <nav className="hidden rounded-xl border border-gray-200 bg-white p-2 lg:block">
              {settingsGroups.map((g) => {
                const active = currentSlug === g.slug;
                const Icon = g.icon;
                const dirtyCount = (dirtyByGroup[g.slug] || []).length;
                return (
                  <Link
                    key={g.slug}
                    href={`/admin/settings/${g.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{g.title}</span>
                    {dirtyCount > 0 && (
                      <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-amber-400" title={`${dirtyCount} unsaved`} />
                    )}
                    {active && dirtyCount === 0 && <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0" />}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Panel */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>

      {/* Cmd+K palette */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCmdOpen(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                ref={cmdInputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search all settings…"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {!query.trim() ? (
                <p className="px-3 py-4 text-center text-xs text-gray-400">
                  Type to search across all {settings.length} settings…
                </p>
              ) : groupedResults.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-gray-400">No matches.</p>
              ) : (
                groupedResults.map(([g, items]) => {
                  const meta = settingsGroupBySlug(g);
                  return (
                    <div key={g} className="mb-1">
                      <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        {meta?.title || g}
                      </p>
                      {items.map((s) => {
                        const flatIdx = flatResults.indexOf(s);
                        return (
                          <button
                            key={s.key}
                            onClick={() => goResult(s)}
                            onMouseEnter={() => setActiveIdx(flatIdx)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                              flatIdx === activeIdx ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {labelFor(s.key)}
                            <span className="ml-2 font-mono text-[10px] text-gray-400">{s.key}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <SettingsShell>{children}</SettingsShell>
    </SettingsProvider>
  );
}

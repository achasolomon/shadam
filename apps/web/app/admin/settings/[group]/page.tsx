'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, Check, AlertCircle, X, Save, Search } from 'lucide-react';
import { settingsGroupBySlug } from '@/lib/admin-nav';
import { SettingField } from '@/components/admin/settings/setting-field';
import { useSettingsStore } from '@/components/admin/settings/settings-provider';
import { labelFor, tryParseJson } from '@/components/admin/settings/settings-config';
import { groupSettingsBySection } from '@/lib/settings-sections';

export default function SettingsGroupPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.group as string) || 'general';
  const focusKey = searchParams.get('focus') || '';
  const groupMeta = settingsGroupBySlug(slug);

  const {
    settings,
    loading,
    error,
    jsonErrors,
    dirtyKeys,
    getValue,
    isDirty,
    setValue,
    setJsonError,
    discardAll,
    saveAll,
    saving,
  } = useSettingsStore();

  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');

  const groupSettings = useMemo(
    () => settings.filter((s) => (s.groupName || 'general') === slug),
    [settings, slug]
  );

  const filteredSettings = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return groupSettings;
    return groupSettings.filter((s) => {
      const hay = `${s.key} ${labelFor(s.key)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [groupSettings, filter]);

  const sections = useMemo(
    () => groupSettingsBySection(slug, filteredSettings),
    [slug, filteredSettings]
  );

  const groupDirtyKeys = useMemo(
    () => dirtyKeys.filter((k) => groupSettings.some((s) => s.key === k)),
    [dirtyKeys, groupSettings]
  );

  // Focus + scroll to field
  useEffect(() => {
    if (!focusKey || loading) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Wait a tick for render
    const t = setTimeout(() => {
      const el = document.getElementById(`setting-${focusKey}`);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    }, 100);
    return () => clearTimeout(t);
  }, [focusKey, loading, sections]);

  // Scroll spy for section jump nav
  useEffect(() => {
    if (sections.length <= 1) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace('sec-', ''));
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    for (const s of sections) {
      const el = document.getElementById(`sec-${s.section.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  // Cmd/Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (groupDirtyKeys.length > 0 && !saving) void handleSaveAll();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupDirtyKeys, saving]);

  // beforeunload guard
  useEffect(() => {
    if (groupDirtyKeys.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [groupDirtyKeys]);

  const handleFormat = (key: string) => {
    const value = getValue(key);
    const res = tryParseJson(value);
    if (res.ok && res.pretty !== undefined) {
      setValue(key, res.pretty);
      setJsonError(key, null);
    } else {
      setJsonError(key, res.error || 'Invalid JSON');
    }
  };

  const handleSaveAll = async () => {
    setSuccess('');
    const ok = await saveAll();
    if (ok > 0) {
      setSuccess(`Saved ${ok} setting${ok !== 1 ? 's' : ''}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const jumpTo = (id: string) => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.getElementById(`sec-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!groupMeta) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">Unknown settings section “{slug}”.</p>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Group header */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <groupMeta.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl text-gray-900">{groupMeta.title}</h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {groupSettings.length} setting{groupSettings.length !== 1 ? 's' : ''}
              </span>
              {groupDirtyKeys.length > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                  {groupDirtyKeys.length} modified
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{groupMeta.description}</p>
          </div>
        </div>

        {/* In-page filter */}
        {groupSettings.length > 6 && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Filter ${groupMeta.title.toLowerCase()}…`}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {filter && (
              <button
                onClick={() => setFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Section jump nav */}
        {sections.length > 1 && (
          <nav className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3" aria-label="Sections">
            {sections.map(({ section, keys }) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {section.title}
                <span className="ml-1 text-[10px] opacity-60">{keys.length}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Toasts */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <Check className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </span>
          <button onClick={() => {}} className="text-red-400 hover:text-red-600" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sections */}
      {filteredSettings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">
            {filter ? 'No settings match your filter.' : 'No settings in this section yet.'}
          </p>
          {filter && (
            <button onClick={() => setFilter('')} className="mt-2 text-sm font-medium text-primary hover:underline">
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(({ section, keys }) => (
            <section key={section.id} id={`sec-${section.id}`} className="scroll-mt-24">
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {section.title}
                </h3>
                <span className="text-[11px] text-gray-400">{keys.length}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {keys.map((k) => {
                  const s = groupSettings.find((x) => x.key === k);
                  if (!s) return null;
                  return (
                    <SettingField
                      key={s.key}
                      setting={s}
                      value={getValue(s.key)}
                      dirty={isDirty(s.key)}
                      jsonError={jsonErrors[s.key]}
                      focused={focusKey === s.key}
                      onChange={(val) => setValue(s.key, val)}
                      onFormat={() => handleFormat(s.key)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Sticky save bar */}
      {groupDirtyKeys.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur sm:px-6 lg:left-64 xl:left-[calc(16rem+15rem)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{groupDirtyKeys.length}</span> unsaved change
              {groupDirtyKeys.length !== 1 ? 's' : ''} in {groupMeta.title}
            </p>
            <div className="flex items-center gap-2">
              <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400 sm:inline">
                ⌘S
              </kbd>
              <button
                onClick={discardAll}
                disabled={saving}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

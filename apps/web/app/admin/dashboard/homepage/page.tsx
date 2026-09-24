'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Loader2,
  Check,
  Eye,
  EyeOff,
  GripVertical,
  Layout,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface HomepageSection {
  id: string;
  sectionType: string;
  title?: string;
  sortOrder: number;
  isVisible: boolean;
}

const SECTION_ICONS: Record<string, string> = {
  hero: '🖼',
  torn_edge: '〰',
  floating_banner: '💛',
  stats: '📊',
  about_preview: 'ℹ',
  services: '🛠',
  features: '✨',
  projects: '📁',
  spotlight: '🎤',
  masonry_gallery: '📷',
  video: '🎬',
  events_list: '📅',
  partners: '🤝',
  impact_gallery_help: '💚',
  blog_preview: '📰',
  newsletter: '✉',
};

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getHomepageAdmin();
      if (res.success) {
        const list = (res.data || []) as HomepageSection[];
        setSections([...list].sort((a, b) => a.sortOrder - b.sortOrder));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load homepage sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const a = next[index];
    const b = next[target];
    // swap sortOrder values
    const aOrder = a.sortOrder;
    const bOrder = b.sortOrder;
    next[index] = { ...a, sortOrder: bOrder };
    next[target] = { ...b, sortOrder: aOrder };
    const sorted = [...next].sort((x, y) => x.sortOrder - y.sortOrder);
    setSections(sorted);

    setSavingId(a.id);
    setError('');
    try {
      await Promise.all([
        adminApi.updateHomepageSection(a.id, { sortOrder: bOrder }),
        adminApi.updateHomepageSection(b.id, { sortOrder: aOrder }),
      ]);
      flash(`Moved “${a.title || a.sectionType}” ${direction === -1 ? 'up' : 'down'}`);
    } catch (err: any) {
      setError(err.message || 'Reorder failed');
      load();
    } finally {
      setSavingId(null);
    }
  };

  const toggleVisibility = async (section: HomepageSection) => {
    setSavingId(section.id);
    setError('');
    try {
      const nextVisible = !section.isVisible;
      await adminApi.updateHomepageSection(section.id, { isVisible: nextVisible });
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, isVisible: nextVisible } : s)));
      flash(`“${section.title || section.sectionType}” ${nextVisible ? 'shown' : 'hidden'}`);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const rename = async (section: HomepageSection, title: string) => {
    setSavingId(section.id);
    try {
      await adminApi.updateHomepageSection(section.id, { title });
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, title } : s)));
      flash('Title saved');
    } catch (err: any) {
      setError(err.message || 'Rename failed');
    } finally {
      setSavingId(null);
    }
  };

  const visibleCount = sections.filter((s) => s.isVisible).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-gray-900">Homepage Sections</h1>
        <p className="mt-1 text-sm text-gray-500">
          Reorder or hide sections on the public homepage. {visibleCount} of {sections.length} visible.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-600">
          <Check className="h-4 w-4" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Layout className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            No homepage sections found. Re-run the database seed to create them.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 last:border-b-0 ${
                !section.isVisible ? 'bg-gray-50/80 opacity-60' : ''
              } ${savingId === section.id ? 'animate-pulse' : ''}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-gray-300" />
              <span className="w-6 shrink-0 text-center text-xs font-medium text-gray-400">
                {index + 1}
              </span>
              <span className="text-lg" aria-hidden>
                {SECTION_ICONS[section.sectionType] || '•'}
              </span>
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  defaultValue={section.title || section.sectionType}
                  key={`${section.id}-${section.title}`}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== section.title) rename(section, v);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  className="w-full max-w-xs rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium text-gray-800 hover:border-gray-200 focus:border-primary focus:bg-white focus:outline-none"
                />
                <p className="px-1.5 font-mono text-[11px] text-gray-400">{section.sectionType}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || savingId === section.id}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === sections.length - 1 || savingId === section.id}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleVisibility(section)}
                  disabled={savingId === section.id}
                  className={`ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-50 ${
                    section.isVisible
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={section.isVisible ? 'Hide from homepage' : 'Show on homepage'}
                >
                  {savingId === section.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : section.isVisible ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Changes apply immediately on the next page load of the public homepage. Content for each section is
        edited under Settings, Gallery, Stories, Projects, Events, and Articles.
      </p>
    </div>
  );
}

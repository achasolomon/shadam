'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Search,
  Edit3,
  Quote,
  Send,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface Story {
  id: string;
  title: string;
  quote?: string;
  personLabel?: string;
  body?: string;
  status: string;
  media?: { id: string; url: string; fileName?: string } | null;
  publishedAt?: string;
  createdAt?: string;
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getStories({ limit: '100' });
      if (res.success) setStories(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    setActionId(id);
    try {
      await adminApi.deleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setActionId(id);
    try {
      await adminApi.publishStory(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = stories.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.personLabel?.toLowerCase().includes(search.toLowerCase()) ||
      s.quote?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Stories</h1>
          <p className="mt-1 text-sm text-gray-500">{stories.length} stories — powers the Spotlight section</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            href="/admin/dashboard/stories/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> New Story
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Quote className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No stories yet</p>
          <Link
            href="/admin/dashboard/stories/new"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Create your first story
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((story) => (
            <div
              key={story.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {story.media?.url ? (
                  <img src={resolveMediaUrl(story.media.url)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <Quote className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-base text-gray-900">{story.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      story.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {story.status}
                  </span>
                </div>
                {story.personLabel && <p className="text-xs font-medium text-primary">{story.personLabel}</p>}
                {story.quote && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">“{story.quote}”</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {story.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublish(story.id)}
                    disabled={actionId === story.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" /> Publish
                  </button>
                )}
                <Link
                  href={`/admin/dashboard/stories/${story.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(story.id)}
                  disabled={actionId === story.id}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

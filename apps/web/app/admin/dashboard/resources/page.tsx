'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Search, Edit3, BookOpen, Send, Download } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface Resource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  resourceType?: string;
  coverImage?: string;
  fileUrl?: string;
  fileType?: string;
  version?: string;
  status: string;
  downloadCount?: number;
  publishedAt?: string;
  createdAt?: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getResources();
      if (res.success) setResources(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setActionId(id);
    try {
      await adminApi.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setActionId(id);
    try {
      await adminApi.publishResource(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = resources.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Resources</h1>
          <p className="mt-1 text-sm text-gray-500">
            {resources.length} resources — powers the /resources page and Get Help section
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            href="/admin/dashboard/resources/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> New Resource
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No resources yet</p>
          <Link
            href="/admin/dashboard/resources/new"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Create your first resource
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              {resource.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(resource.coverImage)}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-base text-gray-900">{resource.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      resource.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {resource.status}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {resource.resourceType === 'ARTICLE' ? 'Article' : 'Document'}
                  </span>
                  {resource.category && (
                    <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {resource.category}
                    </span>
                  )}
                </div>
                {resource.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{resource.description}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Download className="h-3 w-3" /> {resource.downloadCount ?? 0} downloads
                  </span>
                  {resource.fileUrl && <span className="truncate max-w-[240px]">{resource.fileUrl}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {resource.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublish(resource.id)}
                    disabled={actionId === resource.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" /> Publish
                  </button>
                )}
                <Link
                  href={`/admin/dashboard/resources/${resource.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(resource.id)}
                  disabled={actionId === resource.id}
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

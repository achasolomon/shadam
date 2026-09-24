'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Send,
  Newspaper,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  author?: { name: string };
  coverMedia?: { url: string } | null;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getArticles();
      if (res.success) setArticles(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminApi.publishArticle(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (s: string) => {
    const styles: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-600',
      PUBLISHED: 'bg-green-50 text-green-600',
      ARCHIVED: 'bg-amber-50 text-amber-600',
    };
    return styles[s] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Articles</h1>
          <p className="mt-1 text-sm text-gray-500">{articles.length} total articles</p>
        </div>
        <Link
          href="/admin/dashboard/articles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6BCF6B]"
        >
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Newspaper className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No articles found</p>
          <Link
            href="/admin/dashboard/articles/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> Write First Article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                {article.coverMedia?.url ? (
                  <img src={resolveMediaUrl(article.coverMedia.url)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Newspaper className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{article.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(article.status)}`}>
                    {article.status}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                  {article.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                  )}
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  {article.author && <span>by {article.author.name}</span>}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  href={`/insights/${article.slug}`}
                  target="_blank"
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/dashboard/articles/${article.id}`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                {article.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePublish(article.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={deleting === article.id}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Archive,
  Send,
  Filter,
  MoreHorizontal,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  category?: string;
  status: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  coverMedia?: { url: string } | null;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await adminApi.getProjects(params);
      if (res.success) setProjects(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminApi.publishProject(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await adminApi.archiveProject(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Archive failed');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6BCF6B]"
        >
          <Plus className="h-4 w-4" /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
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
            <Plus className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No projects found</p>
          <Link
            href="/admin/dashboard/projects/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> Create First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              {/* Thumbnail */}
              <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                {project.coverMedia?.url ? (
                  <img src={resolveMediaUrl(project.coverMedia.url)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{project.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {project.category && `${project.category} · `}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title="View"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/dashboard/projects/${project.id}`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                {project.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePublish(project.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                    title="Publish"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
                {project.status === 'PUBLISHED' && (
                  <button
                    onClick={() => handleArchive(project.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                    title="Archive"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Delete"
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

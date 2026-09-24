'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Search,
  Loader2,
  Edit3,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface AlbumItem {
  id: string;
  mediaId: string;
  media?: { id: string; url: string; fileName?: string };
}

interface Album {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  status: string;
  coverMedia?: { id: string; url: string } | null;
  items?: AlbumItem[];
  createdAt?: string;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAlbums();
      if (res.success) setAlbums(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this album?')) return;
    setActionId(id);
    try {
      await adminApi.deleteAlbum(id);
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setActionId(id);
    try {
      await adminApi.publishAlbum(id);
      load();
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = albums.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Gallery Albums</h1>
          <p className="mt-1 text-sm text-gray-500">{albums.length} albums — powers the homepage gallery</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search albums…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            href="/admin/dashboard/gallery/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> New Album
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No albums yet</p>
          <Link
            href="/admin/dashboard/gallery/new"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Create your first album
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((album) => {
            const items = album.items || [];
            return (
              <div key={album.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-20 overflow-hidden rounded-lg bg-gray-100">
                      {album.coverMedia?.url ? (
                        <img src={resolveMediaUrl(album.coverMedia.url)} alt="" className="h-full w-full object-cover" />
                      ) : items[0]?.media?.url ? (
                        <img src={resolveMediaUrl(items[0].media.url)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading text-base text-gray-900">{album.title}</h2>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            album.status === 'PUBLISHED'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {album.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {items.length} image{items.length !== 1 ? 's' : ''}
                        {album.slug ? ` · /${album.slug}` : ''}
                      </p>
                      {album.description && (
                        <p className="mt-0.5 max-w-xl text-xs text-gray-500 line-clamp-1">{album.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {album.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublish(album.id)}
                        disabled={actionId === album.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> Publish
                      </button>
                    )}
                    <Link
                      href={`/admin/dashboard/gallery/${album.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(album.id)}
                      disabled={actionId === album.id}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {items.slice(0, 8).map((item) => (
                      <div key={item.id} className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                        {item.media?.url ? (
                           <img src={resolveMediaUrl(item.media.url)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length > 8 && (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50 text-xs text-gray-400">
                        +{items.length - 8}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Image,
  Upload,
  Trash2,
  Search,
  Grid,
  List,
  FolderOpen,
  File,
  Film,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  type: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  folder?: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMedia();
      if (res.success) setMedia(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await adminApi.uploadMedia(file);
      }
      load();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (bytes?: number | null) => {
    if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <Image className="h-5 w-5 text-blue-500" />;
      case 'VIDEO': return <Film className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const filtered = media.filter(
    (m) =>
      m.fileName.toLowerCase().includes(search.toLowerCase()) ||
      m.altText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">{media.length} files</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6BCF6B] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload Files
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4' : 'space-y-3'}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={viewMode === 'grid' ? 'aspect-square animate-pulse rounded-xl bg-gray-100' : 'h-16 animate-pulse rounded-xl bg-gray-100'} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Image className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No media files yet</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Upload className="h-4 w-4" /> Upload First File
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="aspect-square bg-gray-50">
                {item.type === 'IMAGE' ? (
                  <img src={resolveMediaUrl(item.url)} alt={item.altText || item.fileName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {typeIcon(item.type)}
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-gray-900">{item.fileName}</p>
                <p className="text-[10px] text-gray-400">{formatSize(item.fileSize)}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-primary/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                {item.type === 'IMAGE' ? (
                  <img src={resolveMediaUrl(item.url)} alt="" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  typeIcon(item.type)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{item.fileName}</p>
                <p className="text-xs text-gray-500">
                  {formatSize(item.fileSize)} · {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

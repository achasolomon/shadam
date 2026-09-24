'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';
import { MediaField, MediaPicker, type PickedMedia } from '@/components/admin/media-picker';
import { FormTabs } from '@/components/admin/form-tabs';

interface AlbumItem {
  id: string;
  mediaId: string;
  sortOrder: number;
  media?: { id: string; url: string; fileName?: string; type?: string };
}

interface Album {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  status: string;
  coverMediaId?: string | null;
  coverMedia?: { id: string; url: string } | null;
  items?: AlbumItem[];
}

export default function AlbumEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [album, setAlbum] = useState<Album | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    coverMediaId: '',
    coverUrl: '',
  });
  const [pickerTarget, setPickerTarget] = useState<'cover' | 'item' | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAlbum(id);
      const a = res.data;
      if (a) {
        setAlbum(a);
        setForm({
          title: a.title || '',
          description: a.description || '',
          status: a.status || 'DRAFT',
          coverMediaId: a.coverMediaId || '',
          coverUrl: a.coverMedia?.url || '',
        });
      } else {
        setError('Album not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load album');
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        status: form.status,
      };
      if (form.coverMediaId) payload.coverMediaId = form.coverMediaId;

      if (isNew) {
        const res: any = await adminApi.createAlbum(payload);
        const newId = res?.data?.id;
        router.push(newId ? `/admin/dashboard/gallery/${newId}` : '/admin/dashboard/gallery');
      } else {
        await adminApi.updateAlbum(id, payload);
        await load();
        setSaving(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setActionId('publish');
    try {
      await adminApi.publishAlbum(id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Publish failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this album?')) return;
    setActionId('delete');
    try {
      await adminApi.deleteAlbum(id);
      router.push('/admin/dashboard/gallery');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
      setActionId(null);
    }
  };

  const addItem = async (media: PickedMedia) => {
    try {
      await adminApi.addAlbumItem(id, media.id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to add image');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Remove this image from the album?')) return;
    try {
      await adminApi.removeAlbumItem(itemId);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const items = album?.items || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/dashboard/gallery"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Gallery
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">
            {isNew ? 'New Album' : 'Edit Album'}
          </h1>
          {album && (
            <p className="mt-1 text-sm text-gray-500">
              {items.length} image{items.length !== 1 ? 's' : ''}
              {album.slug ? ` · /${album.slug}` : ''}
            </p>
          )}
        </div>
        {!isNew && album && (
          <div className="flex items-center gap-2">
            {album.status !== 'PUBLISHED' && (
              <button
                onClick={handlePublish}
                disabled={actionId === 'publish'}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Publish
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={actionId === 'delete'}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Details' },
          { id: 'media', label: isNew ? 'Cover' : 'Images' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 'content' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Cover Image</h2>
            <MediaField
              value={form.coverUrl}
              valueId={form.coverMediaId || undefined}
              accept="IMAGE"
              onChange={(url, mid) => setForm((f) => ({ ...f, coverUrl: url, coverMediaId: mid || '' }))}
            />

            {!isNew && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-heading text-base text-gray-900">
                    Album Images ({items.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setPickerTarget('item')}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Image
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400">No images yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="group relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                        {item.media?.url ? (
                           <img src={resolveMediaUrl(item.media.url)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                          title="Remove"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/gallery"
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {isNew ? 'Create Album' : 'Save Changes'}
          </button>
        </div>
      </form>

      <MediaPicker
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        accept="IMAGE"
        title={pickerTarget === 'item' ? 'Add Image to Album' : 'Select Cover Image'}
        onSelect={(media) => {
          if (pickerTarget === 'item') {
            addItem(media);
          }
        }}
      />
    </div>
  );
}

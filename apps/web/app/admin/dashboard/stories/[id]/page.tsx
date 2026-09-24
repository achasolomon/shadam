'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, Check } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { MediaField } from '@/components/admin/media-picker';
import { FormTabs } from '@/components/admin/form-tabs';

interface Story {
  id: string;
  title: string;
  quote?: string;
  personLabel?: string;
  body?: string;
  status: string;
  mediaId?: string | null;
  media?: { id: string; url: string; fileName?: string } | null;
}

export default function StoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [story, setStory] = useState<Story | null>(null);
  const [form, setForm] = useState({
    title: '',
    quote: '',
    personLabel: '',
    body: '',
    status: 'DRAFT',
    mediaId: '',
    mediaUrl: '',
  });

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getStories({ id });
      const s = res.data?.find((x: any) => x.id === id) || res.data?.[0];
      if (s) {
        setStory(s);
        setForm({
          title: s.title || '',
          quote: s.quote || '',
          personLabel: s.personLabel || '',
          body: s.body || '',
          status: s.status || 'DRAFT',
          mediaId: s.mediaId || '',
          mediaUrl: s.media?.url || '',
        });
      } else {
        setError('Story not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load story');
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
        quote: form.quote,
        personLabel: form.personLabel,
        body: form.body,
        status: form.status,
      };
      if (form.mediaId) payload.mediaId = form.mediaId;

      if (isNew) {
        const res: any = await adminApi.createStory(payload);
        const newId = res?.data?.id;
        router.push(newId ? `/admin/dashboard/stories/${newId}` : '/admin/dashboard/stories');
      } else {
        await adminApi.updateStory(id, payload);
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

  const handleDelete = async () => {
    if (!confirm('Delete this story?')) return;
    try {
      await adminApi.deleteStory(id);
      router.push('/admin/dashboard/stories');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handlePublish = async () => {
    try {
      await adminApi.publishStory(id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Publish failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/dashboard/stories" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Stories
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">{isNew ? 'New Story' : 'Edit Story'}</h1>
          {story && (
            <p className="mt-1 text-sm text-gray-500">
              {story.status === 'PUBLISHED' ? 'Published' : 'Draft'}
            </p>
          )}
        </div>
        {!isNew && story && (
          <div className="flex items-center gap-2">
            {story.status !== 'PUBLISHED' && (
              <button
                onClick={handlePublish}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Publish
              </button>
            )}
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'media', label: 'Media' },
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
                  placeholder="e.g. Breaking the Stigma in Our Community"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Person / Attribution</label>
                <input
                  type="text"
                  value={form.personLabel}
                  onChange={(e) => setForm({ ...form, personLabel: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Dr. Amina Bello"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Quote *</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  placeholder="The quote shown in the Spotlight carousel…"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Body (optional)</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Image</h2>
            <MediaField
              value={form.mediaUrl}
              valueId={form.mediaId || undefined}
              accept="IMAGE"
              onChange={(url, mid) => setForm((f) => ({ ...f, mediaUrl: url, mediaId: mid || '' }))}
              hint="Shown in the Spotlight carousel on the homepage"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/stories"
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
            {isNew ? 'Create Story' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

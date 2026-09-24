'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, Check } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { FormTabs } from '@/components/admin/form-tabs';
import { MediaField } from '@/components/admin/media-picker';

interface Resource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  resourceType?: string;
  coverImage?: string;
  body?: string;
  fileUrl?: string;
  fileType?: string;
  version?: string;
  status: string;
}

export default function ResourceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [resource, setResource] = useState<Resource | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    resourceType: 'DOCUMENT',
    coverImage: '',
    body: '',
    fileUrl: '',
    fileType: 'application/pdf',
    version: '1.0',
    status: 'DRAFT',
  });

  const isArticle = form.resourceType === 'ARTICLE';

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getResource(id);
      const r: any = res.data;
      if (r) {
        setResource(r);
        setForm({
          title: r.title || '',
          description: r.description || '',
          category: r.category || '',
          resourceType: r.resourceType || 'DOCUMENT',
          coverImage: r.coverImage || '',
          body: r.body || '',
          fileUrl: r.fileUrl || '',
          fileType: r.fileType || 'application/pdf',
          version: r.version || '1.0',
          status: r.status || 'DRAFT',
        });
      } else {
        setError('Resource not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isArticle && !form.body.trim()) {
      setError('Article body is required for article resources');
      setTab('content');
      return;
    }
    if (!isArticle && !form.fileUrl.trim()) {
      setError('File URL is required for document resources');
      setTab('file');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        resourceType: form.resourceType,
        coverImage: form.coverImage,
        body: form.body,
        fileUrl: isArticle ? form.fileUrl || null : form.fileUrl,
        fileType: isArticle ? form.fileType || null : form.fileType,
        version: form.version,
        status: form.status,
      };
      if (isNew) {
        const res: any = await adminApi.createResource(payload);
        const newId = res?.data?.id;
        router.push(newId ? `/admin/dashboard/resources/${newId}` : '/admin/dashboard/resources');
      } else {
        await adminApi.updateResource(id, payload);
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
    if (!confirm('Delete this resource?')) return;
    try {
      await adminApi.deleteResource(id);
      router.push('/admin/dashboard/resources');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handlePublish = async () => {
    try {
      await adminApi.publishResource(id);
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
        <Link
          href="/admin/dashboard/resources"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">
            {isNew ? 'New Resource' : 'Edit Resource'}
          </h1>
          {resource && (
            <p className="mt-1 text-sm text-gray-500">
              {resource.status === 'PUBLISHED' ? 'Published' : 'Draft'}
              {resource.resourceType === 'ARTICLE' ? ' · Article' : ' · Document'}
            </p>
          )}
        </div>
        {!isNew && resource && (
          <div className="flex items-center gap-2">
            {resource.status !== 'PUBLISHED' && (
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
          { id: 'file', label: isArticle ? 'Media' : 'File' },
          { id: 'settings', label: 'Settings' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 'content' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  placeholder="e.g. Understanding Mental Health"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Type *</label>
                <select
                  value={form.resourceType}
                  onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="DOCUMENT">Document (downloadable file)</option>
                  <option value="ARTICLE">Article (read on site)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Guide, Checklist, Article"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Short summary shown on the resources listing…"
                />
              </div>
              {isArticle ? (
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Article Body *</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    rows={14}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Write the full article. Use blank lines between paragraphs."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Version</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="1.0"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'file' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Cover Image</h2>
            <MediaField
              value={form.coverImage}
              accept="IMAGE"
              onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
              hint="Shown on the resources grid and article header"
            />
            {!isArticle && (
              <>
                <h2 className="mb-4 mt-8 font-heading text-lg text-gray-900">File</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">File URL *</label>
                    <input
                      type="text"
                      value={form.fileUrl}
                      onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                      placeholder="/resources/my-guide.pdf or https://…"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Relative path under /public (e.g. /resources/guide.pdf) or an external URL.
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">File Type</label>
                    <select
                      value={form.fileType}
                      onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="application/pdf">PDF</option>
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="video/mp4">MP4</option>
                      <option value="">Other / Link</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            {isArticle && (
              <p className="mt-6 text-xs text-gray-400">
                Articles are read on-site — no file required. Cover image is optional.
              </p>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
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
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/resources"
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
            {isNew ? 'Create Resource' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

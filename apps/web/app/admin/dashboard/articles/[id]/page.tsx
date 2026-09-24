'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { FormTabs } from '@/components/admin/form-tabs';

export default function ArticleFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      const load = async () => {
        try {
          const res = await adminApi.getArticles({ id });
          const article = res.data?.find((a: any) => a.id === id) || res.data?.[0];
          if (article) {
            setForm({
              title: article.title || '',
              excerpt: article.excerpt || '',
              category: article.category || '',
              tags: article.tags || [],
              seoTitle: article.seoTitle || '',
              seoDescription: article.seoDescription || '',
              status: article.status || 'DRAFT',
            });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load article');
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [isNew, id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: any = { ...form };
      if (!payload.seoTitle) delete payload.seoTitle;
      if (!payload.seoDescription) delete payload.seoDescription;
      if (!payload.excerpt) delete payload.excerpt;

      if (isNew) {
        await adminApi.createArticle(payload);
      } else {
        await adminApi.updateArticle(id, payload);
      }
      router.push('/admin/dashboard/articles');
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
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
        <Link href="/admin/dashboard/articles" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Link>
      </div>

      <h1 className="mb-6 font-heading text-2xl text-gray-900">
        {isNew ? 'New Article' : 'Edit Article'}
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'seo', label: 'SEO' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 'content' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Content</h2>
            <div className="space-y-4">
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Brief summary for listing pages..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select category</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Awareness">Awareness</option>
                    <option value="Education">Education</option>
                    <option value="Community">Community</option>
                    <option value="Research">Research</option>
                    <option value="Events">Events</option>
                    <option value="News">News</option>
                    <option value="Stories">Stories</option>
                  </select>
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
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="h-9 flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Add a tag..."
                  />
                  <button type="button" onClick={addTag} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Override page title for search engines..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Meta description for search engines..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/articles"
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6BCF6B] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? 'Create Article' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { MediaField } from '@/components/admin/media-picker';
import { FormTabs } from '@/components/admin/form-tabs';

export default function ProjectFormPage() {
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
    summary: '',
    category: '',
    startDate: '',
    endDate: '',
    ctaLabel: '',
    ctaUrl: '',
    status: 'DRAFT',
    coverMediaId: '',
    coverUrl: '',
  });

  useEffect(() => {
    if (!isNew) {
      const load = async () => {
        try {
          const res = await adminApi.getProjects({ id });
          const project = res.data?.find((p: any) => p.id === id) || res.data?.[0];
          if (project) {
            setForm({
              title: project.title || '',
              summary: project.summary || '',
              category: project.category || '',
              startDate: project.startDate?.split('T')[0] || '',
              endDate: project.endDate?.split('T')[0] || '',
              ctaLabel: project.ctaLabel || '',
              ctaUrl: project.ctaUrl || '',
              status: project.status || 'DRAFT',
              coverMediaId: project.coverMediaId || '',
              coverUrl: project.coverMedia?.url || '',
            });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load project');
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [isNew, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: any = { ...form };
      delete payload.coverUrl;
      if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
      else delete payload.startDate;
      if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();
      else delete payload.endDate;
      if (!payload.ctaLabel) delete payload.ctaLabel;
      if (!payload.ctaUrl) delete payload.ctaUrl;
      if (!payload.coverMediaId) delete payload.coverMediaId;

      if (isNew) {
        await adminApi.createProject(payload);
      } else {
        await adminApi.updateProject(id, payload);
      }
      router.push('/admin/dashboard/projects');
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
        <Link href="/admin/dashboard/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
      </div>

      <h1 className="mb-6 font-heading text-2xl text-gray-900">
        {isNew ? 'New Project' : 'Edit Project'}
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'media', label: 'Media' },
          { id: 'cta', label: 'Call to Action' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 'content' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Details</h2>
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    <option value="awareness">Awareness</option>
                    <option value="education">Education</option>
                    <option value="referral">Referral</option>
                    <option value="community">Community</option>
                    <option value="vulnerable">Vulnerable Groups</option>
                    <option value="research">Research</option>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
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
              onChange={(url, id) => setForm((f) => ({ ...f, coverUrl: url, coverMediaId: id || '' }))}
              hint="Shown on project cards and the homepage Projects section"
            />
          </div>
        )}

        {tab === 'cta' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Call to Action</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Button Label</label>
                <input
                  type="text"
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Learn More"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Button URL</label>
                <input
                  type="url"
                  value={form.ctaUrl}
                  onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/projects"
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
            {isNew ? 'Create Project' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

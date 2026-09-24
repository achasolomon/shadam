'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2, Check } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { FormTabs } from '@/components/admin/form-tabs';
import { MediaField } from '@/components/admin/media-picker';

interface Partner {
  id: string;
  name: string;
  abbr?: string;
  category?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  sortOrder?: number;
  status: string;
}

export default function PartnerEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [form, setForm] = useState({
    name: '',
    abbr: '',
    category: '',
    website: '',
    description: '',
    logoUrl: '',
    sortOrder: 0,
    status: 'PUBLISHED',
  });

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getPartner(id);
      const p: any = res.data;
      if (p) {
        setPartner(p);
        setForm({
          name: p.name || '',
          abbr: p.abbr || '',
          category: p.category || '',
          website: p.website || '',
          description: p.description || '',
          logoUrl: p.logoUrl || '',
          sortOrder: p.sortOrder ?? 0,
          status: p.status || 'PUBLISHED',
        });
      } else {
        setError('Partner not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load partner');
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
        name: form.name,
        abbr: form.abbr,
        category: form.category,
        website: form.website,
        description: form.description,
        logoUrl: form.logoUrl,
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status,
      };
      if (isNew) {
        const res: any = await adminApi.createPartner(payload);
        const newId = res?.data?.id;
        router.push(newId ? `/admin/dashboard/partners/${newId}` : '/admin/dashboard/partners');
      } else {
        await adminApi.updatePartner(id, payload);
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
    if (!confirm('Delete this partner?')) return;
    try {
      await adminApi.deletePartner(id);
      router.push('/admin/dashboard/partners');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
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
          href="/admin/dashboard/partners"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Partners
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">
            {isNew ? 'New Partner' : 'Edit Partner'}
          </h1>
          {partner && (
            <p className="mt-1 text-sm text-gray-500">
              {partner.status === 'PUBLISHED' ? 'Published' : 'Draft'}
            </p>
          )}
        </div>
        {!isNew && partner && (
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'branding', label: 'Branding' },
          { id: 'settings', label: 'Settings' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 'content' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  placeholder="e.g. World Health Organization"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Abbreviation</label>
                <input
                  type="text"
                  value={form.abbr}
                  onChange={(e) => setForm({ ...form, abbr: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. WHO"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. International & Development"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Partners are grouped by category on the /partners page.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://…"
                />
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

        {tab === 'branding' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Logo</h2>
            <MediaField
              value={form.logoUrl}
              accept="IMAGE"
              onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
              hint="Optional — shown when a logo is available; otherwise the abbreviation badge is used"
            />
          </div>
        )}

        {tab === 'settings' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/partners"
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
            {isNew ? 'Create Partner' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

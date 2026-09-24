'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Star } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { MediaField } from '@/components/admin/media-picker';
import { FormTabs } from '@/components/admin/form-tabs';

export default function EventFormPage() {
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
    description: '',
    startAt: '',
    endAt: '',
    venue: '',
    venueAddress: '',
    timezone: 'Africa/Lagos',
    registrationUrl: '',
    isFeatured: false,
    status: 'DRAFT',
    coverMediaId: '',
    coverUrl: '',
  });

  useEffect(() => {
    if (!isNew) {
      const load = async () => {
        try {
          const res = await adminApi.getEvents();
          const event = res.data?.find((e: any) => e.id === id);
          if (event) {
            setForm({
              title: event.title || '',
              description: event.description || '',
              startAt: event.startAt?.slice(0, 16) || '',
              endAt: event.endAt?.slice(0, 16) || '',
              venue: event.venue || '',
              venueAddress: event.venueAddress || '',
              timezone: event.timezone || 'Africa/Lagos',
              registrationUrl: event.registrationUrl || '',
              isFeatured: event.isFeatured || false,
              status: event.status || 'DRAFT',
              coverMediaId: event.coverMediaId || '',
              coverUrl: event.coverMedia?.url || '',
            });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load event');
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
      if (payload.startAt) payload.startAt = new Date(payload.startAt).toISOString();
      if (payload.endAt) payload.endAt = new Date(payload.endAt).toISOString();
      else delete payload.endAt;
      if (!payload.venueAddress) delete payload.venueAddress;
      if (!payload.registrationUrl) delete payload.registrationUrl;
      if (!payload.coverMediaId) delete payload.coverMediaId;

      if (isNew) {
        await adminApi.createEvent(payload);
      } else {
        await adminApi.updateEvent(id, payload);
      }
      router.push('/admin/dashboard/events');
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
        <Link href="/admin/dashboard/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
      </div>

      <h1 className="mb-6 font-heading text-2xl text-gray-900">
        {isNew ? 'New Event' : 'Edit Event'}
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <FormTabs
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'media', label: 'Media' },
          { id: 'settings', label: 'Settings' },
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Venue</label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. SHEDAM Auditorium"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Venue Address</label>
                  <input
                    type="text"
                    value={form.venueAddress}
                    onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Full address"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Registration URL</label>
                <input
                  type="url"
                  value={form.registrationUrl}
                  onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://..."
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
              onChange={(url, id) => setForm((f) => ({ ...f, coverUrl: url, coverMediaId: id || '' }))}
              hint="Shown on event cards, flyers, and the homepage Events section"
            />
          </div>
        )}

        {tab === 'settings' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg text-gray-900">Settings</h2>
            <div className="space-y-4">
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
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Star className="h-4 w-4" /> Featured Event
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/dashboard/events"
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
            {isNew ? 'Create Event' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

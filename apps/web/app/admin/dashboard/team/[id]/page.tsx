'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, Check, Plus, Calendar, MapPin, ImagePlus } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';
import { MediaField, MediaPicker, type PickedMedia } from '@/components/admin/media-picker';
import { FormTabs } from '@/components/admin/form-tabs';
import type { TeamMember, TeamMemberItem } from '@/lib/types/api';

const ITEM_KINDS = [
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'TALK', label: 'Talk' },
  { value: 'CONTRIBUTION', label: 'Contribution' },
  { value: 'PUBLICATION', label: 'Publication' },
  { value: 'AWARD', label: 'Award' },
];

const emptyItem = {
  kind: 'CONTRIBUTION',
  title: '',
  description: '',
  date: '',
  venue: '',
  url: '',
};

const emptyMedia = {
  url: '',
  title: '',
  event: '',
  date: '',
};

export default function TeamMemberEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('content');
  const [member, setMember] = useState<(TeamMember & { items?: TeamMemberItem[] }) | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    headline: '',
    slug: '',
    bio: '',
    photoUrl: '',
    socialLinks: '',
    qualifications: '',
  });
  const [items, setItems] = useState<TeamMemberItem[]>([]);
  const [itemForm, setItemForm] = useState({ ...emptyItem });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [mediaForm, setMediaForm] = useState({ ...emptyMedia });
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);

  const applyMember = useCallback((m: any) => {
    setMember(m);
    setItems(m.items || []);
    const social =
      typeof m.socialLinks === 'string'
        ? m.socialLinks
        : m.socialLinks
          ? JSON.stringify(m.socialLinks, null, 2)
          : '';
    const quals = Array.isArray(m.qualifications)
      ? m.qualifications.join('\n')
      : typeof m.qualifications === 'string'
        ? m.qualifications
        : '';
    setForm({
      name: m.name || '',
      email: m.email || '',
      phone: m.phone || '',
      role: m.role || '',
      headline: m.headline || '',
      slug: m.slug || '',
      bio: m.bio || '',
      photoUrl: m.photoUrl || '',
      socialLinks: social,
      qualifications: quals,
    });
  }, []);

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      setLoading(true);
      setError('');
      try {
        const res = await adminApi.getTeamMemberAdmin(id);
        if (res.data) {
          applyMember(res.data);
          return;
        }
      } catch {
        // fall back to list lookup
      }
      const res = await adminApi.getTeam();
      const m = res.data?.find((x: any) => x.id === id);
      if (m) applyMember(m);
      else setError('Member not found');
    } catch (err: any) {
      setError(err.message || 'Failed to load member');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, applyMember]);

  useEffect(() => {
    load();
  }, [load]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let socialLinks: any = null;
      const rawSocial = form.socialLinks.trim();
      if (rawSocial) {
        try {
          socialLinks = JSON.parse(rawSocial);
        } catch {
          socialLinks = null;
        }
      }
      const qualifications = form.qualifications
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);

      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        headline: form.headline,
        slug: form.slug || slugify(form.name),
        bio: form.bio,
        photoUrl: form.photoUrl,
        socialLinks,
        qualifications,
      };

      if (isNew) {
        const res: any = await adminApi.createTeamMember(payload);
        const newId = res?.data?.id;
        router.push(newId ? `/admin/dashboard/team/${newId}` : '/admin/dashboard/team');
      } else {
        await adminApi.updateTeamMember(id, payload);
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
    if (!confirm('Remove this team member?')) return;
    try {
      await adminApi.deleteTeamMember(id);
      router.push('/admin/dashboard/team');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const resetItemForm = () => {
    setItemForm({ ...emptyItem });
    setEditingItemId(null);
  };

  const nonMediaItems = items.filter((i) => i.kind !== 'MEDIA');
  const mediaItems = items.filter((i) => i.kind === 'MEDIA');

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title.trim()) return;
    setSavingItem(true);
    setError('');
    try {
      const body = {
        kind: itemForm.kind,
        title: itemForm.title,
        description: itemForm.description,
        date: itemForm.date || null,
        venue: itemForm.venue,
        url: itemForm.url,
      };
      if (editingItemId) await adminApi.updateTeamItem(editingItemId, body);
      else await adminApi.addTeamItem(id, body);
      resetItemForm();
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Remove this entry?')) return;
    try {
      await adminApi.deleteTeamItem(itemId);
      if (editingItemId === itemId) resetItemForm();
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  const startEditItem = (item: TeamMemberItem) => {
    setEditingItemId(item.id);
    setItemForm({
      kind: item.kind || 'CONTRIBUTION',
      title: item.title || '',
      description: item.description || '',
      date: item.date ? String(item.date).slice(0, 10) : '',
      venue: item.venue || '',
      url: item.url || '',
    });
    setTab('contributions');
  };

  const handlePickMedia = (media: PickedMedia) => {
    setMediaForm((f) => ({ ...f, url: media.url }));
    setMediaPickerOpen(false);
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.url) return;
    setSavingMedia(true);
    setError('');
    try {
      await adminApi.addTeamItem(id, {
        kind: 'MEDIA',
        title: mediaForm.title || mediaForm.event || 'Event photo',
        description: mediaForm.event || null,
        date: mediaForm.date || null,
        venue: null,
        url: mediaForm.url,
      });
      setMediaForm({ ...emptyMedia });
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to add photo');
    } finally {
      setSavingMedia(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const publicHref = form.slug ? `/team/${form.slug}` : '/team';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/dashboard/team" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Team
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">
            {isNew ? 'Add Member' : 'Edit Member'}
          </h1>
          {member && (
            <p className="mt-1 text-sm text-gray-500">
              {member.role || ''}
              {!isNew && form.slug && (
                <>
                  {' · '}
                  <Link href={publicHref} target="_blank" className="text-primary hover:underline">
                    View public profile
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
        {!isNew && member && (
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {!isNew && (
        <FormTabs
          tabs={[
            { id: 'content', label: 'Content' },
            { id: 'profile', label: 'Profile' },
            { id: 'contributions', label: `Contributions (${nonMediaItems.length})` },
            { id: 'gallery', label: `Event Photos (${mediaItems.length})` },
          ]}
          active={tab}
          onChange={setTab}
        />
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6">
        {(isNew || tab === 'content') && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: !f.slug || f.slug === slugify(f.name) || isNew ? slugify(name) : f.slug,
                  }));
                }}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Role / Title *</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Clinical Psychologist"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Short tagline shown on profile"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="auto-from-name"
              />
              {!isNew && form.slug && (
                <p className="mt-1 text-[11px] text-gray-400">Public URL: /team/{form.slug}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={8}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Full biography — background, expertise, and work in mental health"
              />
            </div>
            <div className="sm:col-span-2">
              <MediaField
                value={form.photoUrl}
                accept="IMAGE"
                label="Photo"
                onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
                hint="Choose from Media Library or paste an image URL"
              />
            </div>
          </div>
        )}

        {(tab === 'profile' && !isNew) && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Qualifications</label>
              <textarea
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={'One per line\nClinical Psychology\nPastoral Counselling'}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Social links (JSON)</label>
              <textarea
                value={form.socialLinks}
                onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={'{\n  "linkedin": "https://…",\n  "twitter": "https://…"\n}'}
              />
            </div>
          </div>
        )}

        {(tab === 'contributions' && !isNew) && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                {editingItemId ? 'Edit entry' : 'Add seminar, talk, contribution, or award'}
              </p>
              <form onSubmit={handleSaveItem} className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
                  <select
                    value={itemForm.kind}
                    onChange={(e) => setItemForm({ ...itemForm, kind: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
                  >
                    {ITEM_KINDS.map((k) => (
                      <option key={k.value} value={k.value}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Title *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.title}
                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    value={itemForm.date}
                    onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Venue</label>
                  <input
                    type="text"
                    value={itemForm.venue}
                    onChange={(e) => setItemForm({ ...itemForm, venue: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Link URL</label>
                  <input
                    type="url"
                    value={itemForm.url}
                    onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none"
                    placeholder="https://…"
                  />
                </div>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
                  >
                    {savingItem ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {editingItemId ? 'Update entry' : 'Add entry'}
                  </button>
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={resetItemForm}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {nonMediaItems.length === 0 ? (
                <p className="text-sm text-gray-500">No seminars or contributions yet.</p>
              ) : (
                nonMediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          {ITEM_KINDS.find((k) => k.value === item.kind)?.label || item.kind}
                        </span>
                        <h4 className="mt-2 text-sm font-semibold text-gray-900">{item.title}</h4>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                          {item.date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(item.date)}
                            </span>
                          )}
                          {item.venue && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {item.venue}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEditItem(item)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'gallery' && !isNew && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Add event photo</p>
              <form onSubmit={handleSaveMedia} className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Image *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mediaForm.url}
                      onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                      placeholder="/uploads/… or pick from media library"
                      className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <ImagePlus className="h-4 w-4" /> Browse
                    </button>
                  </div>
                  {mediaForm.url && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(mediaForm.url)}
                        alt="Event photo preview"
                        className="h-36 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Caption</label>
                  <input
                    type="text"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    placeholder="e.g. Keynote at community outreach"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Event</label>
                  <input
                    type="text"
                    value={mediaForm.event}
                    onChange={(e) => setMediaForm({ ...mediaForm, event: e.target.value })}
                    placeholder="Event or occasion name"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    value={mediaForm.date}
                    onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={savingMedia || !mediaForm.url}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
                  >
                    {savingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add photo
                  </button>
                </div>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mediaItems.length === 0 ? (
                <p className="text-sm text-gray-500 sm:col-span-2 lg:col-span-3">
                  No event photos yet. Photos you add will appear in the member&apos;s public profile gallery.
                </p>
              ) : (
                mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-colors hover:border-primary/20"
                  >
                    <div className="relative aspect-[3/2] bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(item.url || '')}
                        alt={item.title || 'Event photo'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                          {item.description && <span>{item.description}</span>}
                          {item.date && <span>{formatDate(item.date)}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/dashboard/team"
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
            {isNew ? 'Add Member' : 'Save Changes'}
          </button>
        </div>
      </form>

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handlePickMedia}
        accept="IMAGE"
        title="Select event photo"
      />
    </div>
  );
}

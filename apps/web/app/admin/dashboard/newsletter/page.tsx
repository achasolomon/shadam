'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Mail,
  Search,
  Send,
  Trash2,
  Users,
  UserMinus,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  X,
  PenLine,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source?: string;
  consentAt?: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [meta, setMeta] = useState<{ total: number; active: number; unsubscribed: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [sendError, setSendError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getSubscribers();
      if (res.success) {
        setSubscribers(res.data || []);
        setMeta(res.meta || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!composeOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setComposeOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [composeOpen]);

  const openCompose = () => {
    setSendResult(null);
    setSendError('');
    setComposeOpen(true);
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateSubscriber(id, status);
      setSubscribers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      load();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber permanently?')) return;
    try {
      await adminApi.deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      load();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || sending) return;
    setSending(true);
    setSendError('');
    setSendResult(null);
    try {
      const res = await adminApi.sendNewsletter(subject.trim(), message.trim());
      const data = res.data || {};
      setSendResult(
        `Sent ${data.sent ?? 0} of ${data.total ?? 0} emails${data.failed ? ` (${data.failed} failed)` : ''}${data.mode === 'dev' ? ' — logged to console (dev mode)' : ''}`,
      );
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setSendError(err.message || 'send error');
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (s: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-50 text-green-600',
      UNSUBSCRIBED: 'bg-gray-100 text-gray-500',
      BOUNCED: 'bg-red-50 text-red-600',
    };
    return styles[s] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Newsletter</h1>
          <p className="mt-1 text-sm text-gray-500">Manage subscribers and send newsletters</p>
        </div>
        <button
          type="button"
          onClick={openCompose}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          <PenLine className="h-4 w-4" />
          Compose
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{meta?.total ?? subscribers.length}</p>
              <p className="text-xs text-gray-500">Total subscribers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meta?.active ?? subscribers.filter((s) => s.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <UserMinus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meta?.unsubscribed ?? subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length}
              </p>
              <p className="text-xs text-gray-500">Unsubscribed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Mail className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No subscribers found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{sub.source || 'website'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {sub.consentAt || sub.createdAt
                      ? new Date(sub.consentAt || sub.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {sub.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleStatus(sub.id, 'UNSUBSCRIBED')}
                          title="Mark unsubscribed"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatus(sub.id, 'ACTIVE')}
                          title="Reactivate"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sub.id)}
                        title="Delete"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && subscribers.length === 0 && !error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No subscribers yet. They will appear here when people sign up on the site.
        </div>
      )}
      {!loading && subscribers.length > 0 && filtered.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {filtered.length} subscriber{filtered.length === 1 ? '' : 's'} shown
        </div>
      )}

      {composeOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setComposeOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg text-gray-900">Compose Newsletter</h2>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                aria-label="Close composer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="newsletter-subject" className="mb-1 block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="newsletter-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Newsletter subject"
                    required
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="newsletter-message" className="mb-1 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="newsletter-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your newsletter message... (blank lines separate paragraphs)"
                    required
                    rows={12}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Sends to all active subscribers with an unsubscribe footer.
                </p>
                {sendError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{sendError}</div>
                )}
                {sendResult && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{sendResult}</div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !subject.trim() || !message.trim()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? 'Sending...' : 'Send Newsletter'}
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

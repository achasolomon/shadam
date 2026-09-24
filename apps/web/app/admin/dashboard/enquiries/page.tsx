'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
 AlertCircle,
  User,
  ChevronDown,
  Filter,
  Send,
  X,
  Reply,
  MessageCircle,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface EnquiryReply {
  channel: string;
  message: string;
  subject?: string;
  mode?: string;
  sentAt?: string;
  to?: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type?: string;
  status: string;
  createdAt: string;
  replies?: EnquiryReply[];
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<Enquiry | null>(null);
  const [replyChannel, setReplyChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyResult, setReplyResult] = useState<string | null>(null);
  const [replyError, setReplyError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getEnquiries();
      if (res.success) setEnquiries(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!replyTarget) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReplyTarget(null);
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [replyTarget]);

  const openReply = (enquiry: Enquiry) => {
    setReplyTarget(enquiry);
    setReplyChannel('EMAIL');
    setReplyMessage('');
    setReplySubject(enquiry.subject ? `Re: ${enquiry.subject}` : `Re: Your enquiry to SHEDAM`);
    setReplyResult(null);
    setReplyError('');
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateEnquiry(id, { status });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget || !replyMessage.trim() || sendingReply) return;
    setSendingReply(true);
    setReplyError('');
    setReplyResult(null);
    try {
      const res = await adminApi.replyToEnquiry(
        replyTarget.id,
        replyChannel,
        replyMessage.trim(),
        replySubject.trim() || undefined,
      );
      const data = res.data || {};
      if (data.smsLink && typeof window !== 'undefined') {
        window.location.href = data.smsLink;
      }
      setReplyResult(
        replyChannel === 'EMAIL'
          ? `Email sent${data.mode === 'dev' ? ' (dev mode — logged to console)' : ''}`
          : data.mode === 'api'
            ? 'SMS sent'
            : 'SMS ready — your device messaging app should open',
      );
      setReplyMessage('');
      const updated = data.enquiry;
      if (updated) {
        setEnquiries((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
      } else {
        load();
      }
    } catch (err: any) {
      setReplyError(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusIcon = (s: string) => {
    switch (s) {
      case 'NEW': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'RESOLVED': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const statusBadge = (s: string) => {
    const styles: Record<string, string> = {
      NEW: 'bg-blue-50 text-blue-600',
      IN_PROGRESS: 'bg-amber-50 text-amber-600',
      RESOLVED: 'bg-green-50 text-green-600',
    };
    return styles[s] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-gray-900">Enquiries</h1>
        <p className="mt-1 text-sm text-gray-500">{enquiries.length} total enquiries</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-xl border border-gray-200 bg-white transition-all hover:border-primary/20"
            >
              <div
                className="flex cursor-pointer items-center gap-4 p-4"
                onClick={() => setExpanded(expanded === enquiry.id ? null : enquiry.id)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {enquiry.name?.charAt(0) || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{enquiry.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(enquiry.status)}`}>
                      {enquiry.status?.replace('_', ' ')}
                    </span>
                    {Array.isArray(enquiry.replies) && enquiry.replies.length > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {enquiry.replies.length} replied
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {enquiry.email}
                    {enquiry.subject && ` · ${enquiry.subject}`}
                    {enquiry.type && ` · ${enquiry.type}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expanded === enquiry.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expanded === enquiry.id && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="h-3 w-3" /> {enquiry.email}
                    </a>
                    {enquiry.phone && (
                      <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" /> {enquiry.phone}
                      </a>
                    )}
                  </div>

                  {Array.isArray(enquiry.replies) && enquiry.replies.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Replies sent</p>
                      {enquiry.replies.map((r, i) => (
                        <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span className="flex items-center gap-1 font-medium text-primary">
                              {r.channel === 'EMAIL' ? <Mail className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                              {r.channel}
                              {r.to ? ` → ${r.to}` : ''}
                            </span>
                            <span>{r.sentAt ? new Date(r.sentAt).toLocaleString() : ''}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-700 whitespace-pre-wrap">{r.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openReply(enquiry)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Reply
                    </button>
                    {['NEW', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(enquiry.id, s)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          enquiry.status === s
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {replyTarget && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setReplyTarget(null)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-heading text-lg text-gray-900">Reply to Enquiry</h2>
                  <p className="text-xs text-gray-500">{replyTarget.name} · {replyTarget.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                aria-label="Close reply"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-4 rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Original message</p>
                <p className="mt-1 line-clamp-4 text-xs text-gray-600 whitespace-pre-wrap">{replyTarget.message}</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Channel</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyChannel('EMAIL')}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        replyChannel === 'EMAIL'
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Mail className="h-4 w-4" /> Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyChannel('SMS')}
                      disabled={!replyTarget.phone}
                      title={replyTarget.phone ? undefined : 'No phone number on file'}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                        replyChannel === 'SMS'
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" /> SMS
                    </button>
                  </div>
                  {!replyTarget.phone && (
                    <p className="mt-1 text-xs text-amber-600">No phone number — SMS unavailable for this enquirer.</p>
                  )}
                  {replyChannel === 'SMS' && replyTarget.phone && (
                    <p className="mt-1 text-xs text-gray-500">Will send to {replyTarget.phone}</p>
                  )}
                </div>

                {replyChannel === 'EMAIL' && (
                  <div>
                    <label htmlFor="reply-subject" className="mb-1 block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      id="reply-subject"
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="reply-message" className="mb-1 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="reply-message"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your response..."
                    required
                    rows={10}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {replyError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{replyError}</div>
                )}
                {replyResult && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{replyResult}</div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyTarget(null)}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim() || (replyChannel === 'SMS' && !replyTarget.phone)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
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

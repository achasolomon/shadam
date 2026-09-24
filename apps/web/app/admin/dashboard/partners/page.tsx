'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Search, Edit3, HeartHandshake } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

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
  createdAt?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getPartners();
      if (res.success) setPartners(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    setActionId(id);
    try {
      await adminApi.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = partners.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.abbr?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Partners</h1>
          <p className="mt-1 text-sm text-gray-500">
            {partners.length} partners — powers the /partners page and homepage section
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search partners…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            href="/admin/dashboard/partners/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> New Partner
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No partners yet</p>
          <Link
            href="/admin/dashboard/partners/new"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Add your first partner
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((partner) => (
            <div
              key={partner.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                {partner.logoUrl ? (
                  <img src={resolveMediaUrl(partner.logoUrl)} alt="" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    {partner.abbr || partner.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-base text-gray-900">{partner.name}</h2>
                  {partner.abbr && (
                    <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {partner.abbr}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      partner.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {partner.status}
                  </span>
                </div>
                {partner.category && (
                  <p className="mt-1 text-xs font-medium text-primary">{partner.category}</p>
                )}
                {partner.website && (
                  <p className="mt-0.5 text-xs text-gray-400 truncate">{partner.website}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/dashboard/partners/${partner.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(partner.id)}
                  disabled={actionId === partner.id}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

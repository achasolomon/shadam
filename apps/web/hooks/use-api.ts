'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ApiResponse, PaginationMeta } from '@/lib/types/api';

// ── Generic fetch hook with fallback ──
export function useFetch<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  deps: any[] = [],
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'static'>('static');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setSource('api');
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSource('static');
          setError(err.message || 'Failed to fetch');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, source };
}

// ── Projects hook ──
export function useProjects(params?: { page?: number; limit?: number; category?: string }) {
  const fallback = { data: [] as any[], meta: null as PaginationMeta | null };

  return useFetch(async () => {
    try {
      const res = await api.getProjects(
        Object.fromEntries(
          Object.entries({ page: params?.page, limit: params?.limit, category: params?.category })
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      );
      if (res.success) return { data: res.data, meta: res.meta || null };
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.page, params?.limit, params?.category]);
}

// ── Single project hook ──
export function useProject(slug: string) {
  return useFetch(async () => {
    try {
      const res = await api.getProject(slug);
      if (res.success) return res.data;
      return null;
    } catch {
      return null;
    }
  }, null, [slug]);
}

// ── Single page hook ──
export function usePage(slug: string) {
  return useFetch(async () => {
    try {
      const res = await api.getPage(slug);
      if (res.success && res.data) return res.data;
      return null;
    } catch {
      return null;
    }
  }, null, [slug]);
}
export function useEvents(params?: { page?: number; limit?: number }) {
  const fallback = { data: [] as any[], meta: null as PaginationMeta | null };

  return useFetch(async () => {
    try {
      const res = await api.getEvents(
        Object.fromEntries(
          Object.entries({ page: params?.page, limit: params?.limit })
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      );
      if (res.success) return { data: res.data, meta: res.meta || null };
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.page, params?.limit]);
}

// ── Single event hook ──
export function useEvent(slug: string) {
  return useFetch(async () => {
    try {
      const res = await api.getEvent(slug);
      if (res.success) return res.data;
      return null;
    } catch {
      return null;
    }
  }, null, [slug]);
}

// ── Articles hook ──
export function useArticles(params?: { page?: number; limit?: number; category?: string }) {
  const fallback = { data: [] as any[], meta: null as PaginationMeta | null };

  return useFetch(async () => {
    try {
      const res = await api.getArticles(
        Object.fromEntries(
          Object.entries({ page: params?.page, limit: params?.limit, category: params?.category })
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      );
      if (res.success) return { data: res.data, meta: res.meta || null };
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.page, params?.limit, params?.category]);
}

// ── Single article hook ──
export function useArticle(slug: string) {
  return useFetch(async () => {
    try {
      const res = await api.getArticle(slug);
      if (res.success) return res.data;
      return null;
    } catch {
      return null;
    }
  }, null, [slug]);
}

// ── Gallery albums hook ──
export function useAlbums() {
  return useFetch(async () => {
    try {
      const res = await api.getAlbums();
      if (res.success) return res.data;
      return [];
    } catch {
      return [];
    }
  }, []);
}

// ── Team hooks ──
export function useTeam() {
  return useFetch(async () => {
    try {
      const res = await api.getTeam();
      if (res.success) return res.data;
      return [];
    } catch {
      return [];
    }
  }, []);
}

export function useTeamMember(slug: string) {
  return useFetch(
    async () => {
      try {
        const res = await api.getTeamMember(slug);
        if (res.success && res.data) return res.data;
        return null;
      } catch {
        return null;
      }
    },
    null as any,
    [slug],
  );
}

// ── Settings hook ──
export function useSettings() {
  return useFetch<Array<{ key: string; value: string; type?: string; groupName?: string }>>(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1'}/settings`,
        { credentials: 'include' }
      );
      if (res.ok) {
        const body = await res.json();
        return Array.isArray(body?.data) ? body.data : [];
      }
      return [];
    } catch {
      return [];
    }
  }, []);
}

// ── Settings map helper ──
// Returns { map: Record<string, string>, get: (key, fallback?) => string }
export function useSettingsMap() {
  const { data: settings, loading, source } = useSettings();
  const map = (settings || []).reduce<Record<string, string>>((acc, s) => {
    if (s && s.key) acc[s.key] = s.value;
    return acc;
  }, {});

  const get = useCallback(
    (key: string, fallback = '') => (map[key] !== undefined && map[key] !== '' ? map[key] : fallback),
    [map]
  );

  const getJSON = useCallback(
    <T,>(key: string, fallback: T): T => {
      const raw = map[key];
      if (raw === undefined || raw === '') return fallback;
      try {
        const parsed = JSON.parse(raw);
        return (Array.isArray(fallback) && !Array.isArray(parsed)) || (!Array.isArray(fallback) && Array.isArray(parsed))
          ? fallback
          : (parsed as T);
      } catch {
        return fallback;
      }
    },
    [map]
  );

  return { map, get, getJSON, loading, source };
}

// ── Enquiry submission ──
export function useSubmitEnquiry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: {
    name: string;
    email: string;
    phone?: string;
    type?: string;
    subject?: string;
    message: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.submitEnquiry(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, success };
}

// ── Newsletter subscription ──
export function useSubscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.subscribe(email);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error, success };
}

// ── Featured event (for hero/countdown) ──
export function useFeaturedEvent() {
  return useFetch(async () => {
    try {
      const res = await api.getFeaturedEvent();
      if (res.success) return res.data;
      return null;
    } catch {
      return null;
    }
  }, null);
}

// ── Resources hook (get-help + /resources page) ──
export function useResources(params?: { page?: number; limit?: number; category?: string }) {
  const fallback = [] as any[];
  return useFetch(async () => {
    try {
      const res = await api.getResources(
        Object.fromEntries(
          Object.entries({ page: params?.page, limit: params?.limit, category: params?.category })
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      );
      if (res.success) return res.data || [];
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.page, params?.limit, params?.category]);
}

// ── Partners hook (homepage section + /partners page) ──
export function usePartners(params?: { category?: string }) {
  const fallback = [] as any[];
  return useFetch(async () => {
    try {
      const res = await api.getPartners(
        params?.category ? { category: params.category } : undefined
      );
      if (res.success) return res.data || [];
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.category]);
}

// ── Stories hook (testimonials/spotlight) ──
export function useStories(params?: { page?: number; limit?: number }) {
  const fallback = { data: [] as any[], meta: null as PaginationMeta | null };
  return useFetch(async () => {
    try {
      const res = await api.getStories(
        Object.fromEntries(
          Object.entries({ page: params?.page, limit: params?.limit })
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      );
      if (res.success) return { data: res.data, meta: res.meta || null };
      return fallback;
    } catch {
      return fallback;
    }
  }, fallback, [params?.page, params?.limit]);
}

// ── Event registration submission ──
export function useRegisterForEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    ticketType?: string;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.registerForEvent(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, success };
}

// ── Donation submission ──
export function useSubmitDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: {
    donorName: string;
    donorEmail?: string;
    donorPhone?: string;
    amount: number;
    currency?: string;
    frequency?: string;
    method?: string;
    projectId?: string;
    message?: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.submitDonation(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to submit donation');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, success };
}

// ── Navigation hook (header) ──
export function useNavigation() {
  return useFetch(async () => {
    try {
      const res = await api.getNavigation();
      if (res.success) return res.data;
      return [];
    } catch {
      return [];
    }
  }, []);
}

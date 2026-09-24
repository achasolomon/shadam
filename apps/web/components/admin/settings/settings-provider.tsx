'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { adminApi } from '@/lib/api';

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  groupName?: string;
}

interface SettingsContextValue {
  settings: Setting[];
  loading: boolean;
  error: string;
  edits: Record<string, string>;
  jsonErrors: Record<string, string>;
  dirtyKeys: string[];
  dirtyByGroup: Record<string, string[]>;
  getValue: (key: string) => string;
  isDirty: (key: string) => boolean;
  setValue: (key: string, val: string) => void;
  setJsonError: (key: string, err: string | null) => void;
  discardAll: () => void;
  saveAll: () => Promise<number>;
  saving: boolean;
  reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettingsStore(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettingsStore must be used within SettingsProvider');
  return ctx;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const settingsRef = useRef<Setting[]>([]);
  settingsRef.current = settings;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getSettings();
      if (res.success) setSettings((res.data || []) as Setting[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getValue = useCallback(
    (key: string): string => {
      if (key in edits) return edits[key];
      return settings.find((s) => s.key === key)?.value || '';
    },
    [edits, settings]
  );

  const isDirty = useCallback(
    (key: string): boolean => {
      if (!(key in edits)) return false;
      const orig = settings.find((s) => s.key === key)?.value || '';
      return edits[key] !== orig;
    },
    [edits, settings]
  );

  const dirtyKeys = useMemo(
    () => settings.map((s) => s.key).filter((k) => isDirty(k)),
    [settings, isDirty]
  );

  const dirtyByGroup = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const k of dirtyKeys) {
      const s = settings.find((x) => x.key === k);
      const g = s?.groupName || 'general';
      if (!map[g]) map[g] = [];
      map[g].push(k);
    }
    return map;
  }, [dirtyKeys, settings]);

  const setValue = useCallback((key: string, val: string) => {
    setEdits((prev) => ({ ...prev, [key]: val }));
    setJsonErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setError('');
  }, []);

  const setJsonError = useCallback((key: string, err: string | null) => {
    setJsonErrors((prev) => {
      const next = { ...prev };
      if (err === null) delete next[key];
      else next[key] = err;
      return next;
    });
  }, []);

  const discardAll = useCallback(() => {
    setEdits({});
    setJsonErrors({});
    setError('');
  }, []);

  const validateKey = useCallback(
    (key: string, value: string): boolean => {
      const setting = settingsRef.current.find((s) => s.key === key);
      if (!setting) return true;
      const t = value.trim();
      const isJsonish =
        setting.type === 'JSON' ||
        ((setting.type === 'TEXTAREA' || setting.type === 'TEXT') && (t.startsWith('[') || t.startsWith('{')));
      if (!isJsonish) return true;
      try {
        JSON.parse(value);
        setJsonError(key, null);
        return true;
      } catch (e: any) {
        setJsonError(key, e.message || 'Invalid JSON');
        return false;
      }
    },
    [setJsonError]
  );

  const saveAll = useCallback(async (): Promise<number> => {
    const keys = dirtyKeys;
    if (keys.length === 0) return 0;

    // Validate all first — block if any invalid
    let allValid = true;
    for (const k of keys) {
      if (!validateKey(k, getValue(k))) allValid = false;
    }
    if (!allValid) {
      setError('Fix invalid JSON before saving.');
      return 0;
    }

    setSaving(true);
    setError('');
    let ok = 0;
    try {
      for (const key of keys) {
        const value = getValue(key);
        await adminApi.updateSetting(key, value);
        setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
        ok += 1;
      }
      setEdits((prev) => {
        const next = { ...prev };
        for (const k of keys) delete next[k];
        return next;
      });
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
    return ok;
  }, [dirtyKeys, getValue, validateKey]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      loading,
      error,
      edits,
      jsonErrors,
      dirtyKeys,
      dirtyByGroup,
      getValue,
      isDirty,
      setValue,
      setJsonError,
      discardAll,
      saveAll,
      saving,
      reload: load,
    }),
    [
      settings,
      loading,
      error,
      edits,
      jsonErrors,
      dirtyKeys,
      dirtyByGroup,
      getValue,
      isDirty,
      setValue,
      setJsonError,
      discardAll,
      saveAll,
      saving,
      load,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

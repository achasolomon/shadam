'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [invite, setInvite] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setLoadError('Missing invitation token. Use the link from your email.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setLoadError('');
      const data = await authApi.getInvite(token);
      setInvite(data);
    } catch (err: any) {
      setLoadError(err.message || 'Invalid or expired invitation link');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await authApi.acceptInvite(token, password);
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Could not set password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500">Checking invitation…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="font-heading text-xl text-gray-900">Invitation problem</h1>
          <p className="mt-2 text-sm text-gray-500">{loadError}</p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="font-heading text-xl text-gray-900">Account ready</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your password has been set. You can now sign in to the admin panel.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <h1 className="mt-4 font-heading text-2xl text-gray-900">Set your password</h1>
          <p className="mt-1 text-sm text-gray-500">
            {invite ? `Welcome, ${invite.name}` : 'Complete your registration'}
          </p>
        </div>

        {invite && (
          <div className="mb-5 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p>
              <span className="text-gray-400">Email:</span> {invite.email}
            </p>
            {invite.role && (
              <p>
                <span className="text-gray-400">Role:</span> {invite.role}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6BCF6B] disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving…
              </span>
            ) : (
              'Activate account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

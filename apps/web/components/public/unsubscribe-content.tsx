'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get('email') || '';
  const [email, setEmail] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefill) setEmail(prefill);
  }, [prefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      await api.unsubscribe(email.trim());
      setDone(true);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not found')) {
        setNotFound(true);
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="h-6 w-6" />
        </div>

        {done ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <h1 className="font-heading text-xl text-gray-900">You have unsubscribed</h1>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{email}</span> will no longer receive newsletters from SHEDAM.
              You can re-subscribe anytime from our homepage.
            </p>
          </div>
        ) : notFound ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <h1 className="font-heading text-xl text-gray-900">Email not found</h1>
            </div>
            <p className="text-sm text-gray-600">
              We could not find that email on our list. It may already be unsubscribed.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-xl text-gray-900">Unsubscribe from our newsletter</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the email you subscribed with. You can unsubscribe at any time.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="unsub-email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="unsub-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {loading ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function UnsubscribeContent() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}

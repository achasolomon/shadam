'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/components/admin/auth-provider';
import { isSuperAdmin } from '@/lib/access';

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <ShieldAlert className="h-7 w-7 text-red-500" />
      </div>
      <h1 className="font-heading text-xl text-gray-900">Access denied</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        {message || 'You do not have permission to view this page. Contact a Super Admin if you believe this is a mistake.'}
      </p>
      <Link
        href="/admin/dashboard"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export function SuperAdminOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isSuperAdmin(user)) {
    return <AccessDenied message="This page is restricted to Super Admins." />;
  }

  return <>{children}</>;
}

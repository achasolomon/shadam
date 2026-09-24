'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OldSettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/settings/general');
  }, [router]);
  return (
    <div className="flex items-center justify-center py-20 text-sm text-gray-500">
      Redirecting to Settings…
    </div>
  );
}

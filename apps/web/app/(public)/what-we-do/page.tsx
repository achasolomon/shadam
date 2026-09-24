import type { Metadata } from 'next';
import { WhatWeDoContent } from '@/components/public/what-we-do-content';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

async function getSettingsMap(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const body = await res.json();
    const rows = Array.isArray(body?.data) ? body.data : [];
    const map: Record<string, string> = {};
    for (const r of rows) if (r?.key) map[r.key] = r.value ?? '';
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const map = await getSettingsMap();
  return {
    title: map.wwd_meta_title || 'What We Do',
    description:
      map.wwd_meta_description ||
      'Explore the services and programmes SHEDAM offers — from mental health awareness campaigns to professional referrals and community support.',
  };
}

export default function WhatWeDoPage() {
  return <WhatWeDoContent />;
}

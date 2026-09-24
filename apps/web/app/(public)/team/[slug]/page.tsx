import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TeamDetailContent } from '@/components/public/team-detail-content';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

async function fetchMember(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/team/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function fetchTeam(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/team`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await fetchMember(slug);
  if (!member) return { title: 'Team Member Not Found' };
  const description =
    member.headline ||
    (member.bio ? String(member.bio).slice(0, 160) : `Learn about ${member.name} at SHEDAM Mental Health Initiative.`);
  return {
    title: `${member.name} — SHEDAM Team`,
    description,
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await fetchMember(slug);
  if (!member) notFound();
  const all = await fetchTeam();
  const related = all.filter((m) => m.slug !== slug && m.id !== member.id).slice(0, 4);
  return <TeamDetailContent member={member} related={related} />;
}

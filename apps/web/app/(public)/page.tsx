import type { Metadata } from 'next';
import React from 'react';
import { Hero } from '@/components/public/sections/hero';
import { TornEdge } from '@/components/public/sections/torn-edge';
import { FloatingBanner } from '@/components/public/sections/floating-banner';
import { Stats } from '@/components/public/sections/stats';
import { AboutPreview } from '@/components/public/sections/about-preview';
import { Services } from '@/components/public/sections/services';
import { Features } from '@/components/public/sections/features';
import { Projects } from '@/components/public/sections/projects';
import { MasonryGallery } from '@/components/public/sections/masonry-gallery';
import { VideoSection } from '@/components/public/sections/video-section';
import { Spotlight } from '@/components/public/sections/spotlight';
import { EventsList } from '@/components/public/sections/events-list';
import { Partners } from '@/components/public/sections/partners';
import { ImpactGalleryHelp } from '@/components/public/sections/impact-gallery-help';
import { BlogPreview } from '@/components/public/sections/blog-preview';
import { Newsletter } from '@/components/public/sections/newsletter';

export const metadata: Metadata = {
  title: 'SHEDAM Mental Health Initiative',
  description:
    'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help. SHEDAM Mental Health Initiative is dedicated to making mental health support accessible for all.',
};

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  torn_edge: () => <TornEdge />,
  floating_banner: FloatingBanner,
  stats: Stats,
  about_preview: AboutPreview,
  services: Services,
  features: Features,
  projects: Projects,
  spotlight: Spotlight,
  masonry_gallery: MasonryGallery,
  video: VideoSection,
  events_list: EventsList,
  partners: Partners,
  impact_gallery_help: ImpactGalleryHelp,
  blog_preview: BlogPreview,
  newsletter: Newsletter,
};

const DEFAULT_SECTION_TYPES = [
  'hero',
  'torn_edge',
  'floating_banner',
  'stats',
  'about_preview',
  'services',
  'features',
  'projects',
  'spotlight',
  'masonry_gallery',
  'video',
  'events_list',
  'partners',
  'impact_gallery_help',
  'blog_preview',
  'newsletter',
];

interface SectionRow {
  sectionType: string;
  sortOrder: number;
  isVisible: boolean;
}

async function getVisibleSectionTypes(): Promise<string[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';
    const res = await fetch(`${base}/homepage`, {
      next: { revalidate: 60 },
      cache: 'force-cache',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const rows: SectionRow[] = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body)
        ? body
        : [];
    if (rows.length === 0) throw new Error('empty');
    return rows
      .filter((r) => r.isVisible !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((r) => r.sectionType)
      .filter((t) => t in SECTION_COMPONENTS);
  } catch {
    return DEFAULT_SECTION_TYPES;
  }
}

export default async function HomePage() {
  const types = await getVisibleSectionTypes();

  return (
    <>
      {types.map((type, i) => {
        const Component = SECTION_COMPONENTS[type];
        if (!Component) return null;
        return <Component key={`${type}-${i}`} />;
      })}
    </>
  );
}

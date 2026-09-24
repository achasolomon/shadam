import type { Metadata } from 'next';
import { GalleryContent } from '@/components/public/gallery-content';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Moments from our work — community events, workshops, outreach and impact through SHEDAM Mental Health Initiative.',
};

export default function GalleryPage() {
  return <GalleryContent />;
}

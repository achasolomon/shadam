import type { Metadata } from 'next';
import { ResourcesContent } from '@/components/public/resources-content';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Free mental health guides, checklists and downloadable resources from SHEDAM Mental Health Initiative.',
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}

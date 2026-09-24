import type { Metadata } from 'next';
import { ResourceDetailContent } from '@/components/public/resource-detail-content';

export const metadata: Metadata = {
  title: 'Resource Article',
  description: 'Read a mental health resource article from SHEDAM Mental Health Initiative.',
};

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  return <ResourceDetailContent id={params.id} />;
}

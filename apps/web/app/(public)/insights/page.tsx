import type { Metadata } from 'next';
import { InsightsContent } from '@/components/public/insights-content';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Articles, stories and resources on mental health from SHEDAM Mental Health Initiative.',
};

export default function InsightsPage() {
  return <InsightsContent />;
}

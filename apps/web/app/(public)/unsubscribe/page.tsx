import type { Metadata } from 'next';
import { UnsubscribeContent } from '@/components/public/unsubscribe-content';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from the SHEDAM newsletter at any time.',
};

export default function UnsubscribePage() {
  return <UnsubscribeContent />;
}

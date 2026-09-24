import type { Metadata } from 'next';
import { PartnersContent } from '@/components/public/partners-content';

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Organisations collaborating with SHEDAM Mental Health Initiative to strengthen mental health systems across Nigeria.',
};

export default function PartnersPage() {
  return <PartnersContent />;
}

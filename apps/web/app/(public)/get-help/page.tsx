import type { Metadata } from 'next';
import { GetHelpContent } from '@/components/public/get-help-content';

export const metadata: Metadata = {
  title: 'Get Help',
  description:
    'Free mental health support, crisis helplines and resources. You are not alone — we are here to help.',
};

export default function GetHelpPage() {
  return <GetHelpContent />;
}

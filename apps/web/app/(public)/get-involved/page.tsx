import type { Metadata } from 'next';
import { GetInvolvedContent } from '@/components/public/get-involved-content';

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Volunteer, partner with us, or support our mission. Together, we can make mental health support accessible for all.',
};

export default function GetInvolvedPage() {
  return <GetInvolvedContent />;
}

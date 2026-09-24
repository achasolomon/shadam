import type { Metadata } from 'next';
import { ContactContent } from '@/components/public/contact-content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with SHEDAM Mental Health Initiative. We are here to help.',
};

export default function ContactPage() {
  return <ContactContent />;
}

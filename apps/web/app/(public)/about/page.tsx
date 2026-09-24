import type { Metadata } from 'next';
import { AboutContent } from '@/components/public/about-content';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about SHEDAM Mental Health Initiative — our mission, vision, values, and the story behind our work to make mental health support accessible for all.',
};

export default function AboutPage() {
  return <AboutContent />;
}

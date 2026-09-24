import type { Metadata } from 'next';
import { TeamContent } from '@/components/public/team-content';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the founders, professionals, and volunteers behind SHEDAM Mental Health Initiative and explore their seminars, contributions, and mental health work.',
};

export default function TeamPage() {
  return <TeamContent />;
}

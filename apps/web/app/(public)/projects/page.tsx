import type { Metadata } from 'next';
import { ProjectsContent } from '@/components/public/projects-content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore the mental health projects and programmes led by SHEDAM — creating real change in communities across Nigeria.',
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}

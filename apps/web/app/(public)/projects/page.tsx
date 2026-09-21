import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore our mental health projects and programmes creating real change.',
};

export default function ProjectsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Our Projects</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Through targeted programmes and community engagement, we provide support, education and hope for a healthier tomorrow.
        </p>
      </div>
    </div>
  );
}

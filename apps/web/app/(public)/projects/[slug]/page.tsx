import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetailContent } from '@/components/public/project-detail-content';
import { getProjectBySlug, getRelatedProjects, projects, mapApiProject } from '@/lib/projects-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

async function fetchProject(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const apiProject = await fetchProject(slug);
  const project = apiProject ? mapApiProject(apiProject) : getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — SHEDAM Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiProject = await fetchProject(slug);
  const project = apiProject ? mapApiProject(apiProject) : getProjectBySlug(slug);
  if (!project) notFound();
  const relatedProjects = getRelatedProjects(slug, 3);
  return <ProjectDetailContent project={project} relatedProjects={relatedProjects} />;
}
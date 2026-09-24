import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug, getRelatedArticles, mapApiArticle } from '@/lib/articles-data';
import { ArticleDetailContent } from '@/components/public/article-detail-content';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

async function fetchArticle(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const apiArticle = await fetchArticle(params.slug);
  const article = apiArticle ? mapApiArticle(apiArticle) : getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const apiArticle = await fetchArticle(params.slug);
  const article = apiArticle ? mapApiArticle(apiArticle) : getArticleBySlug(params.slug);
  if (!article) notFound();
  const related = getRelatedArticles(params.slug, 3);
  return <ArticleDetailContent article={article} related={related} />;
}
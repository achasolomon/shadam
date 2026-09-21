import Link from 'next/link';
import { Container } from '@smhi/ui';
import { ArrowRight } from 'lucide-react';

const galleryImages = [
  { id: 1, alt: 'Gallery image 1' },
  { id: 2, alt: 'Gallery image 2' },
  { id: 3, alt: 'Gallery image 3' },
  { id: 4, alt: 'Gallery image 4' },
];

export function GalleryPreview() {
  return (
    <section className="bg-surface-alt py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Gallery
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">
              Moments from Our Work
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-border"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-text-muted">{image.alt}</p>
              </div>
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/20" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

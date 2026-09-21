import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.galleryAlbum.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true, items: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlugPublic(slug: string) {
    const album = await this.prisma.galleryAlbum.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true, items: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async findAllAdmin() {
    return this.prisma.galleryAlbum.findMany({
      where: { deletedAt: null },
      include: { coverMedia: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { title: string; description?: string; authorId: string }) {
    const slug = data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    return this.prisma.galleryAlbum.create({ data: { ...data, slug } });
  }

  async remove(id: string) {
    return this.prisma.galleryAlbum.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

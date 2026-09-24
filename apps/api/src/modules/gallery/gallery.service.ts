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

  async findAllAdmin(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.galleryAlbum.findMany({
        where,
        skip,
        take: limit,
        include: { coverMedia: true, items: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.galleryAlbum.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const album = await this.prisma.galleryAlbum.findUnique({
      where: { id },
      include: { coverMedia: true, items: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!album || album.deletedAt) throw new NotFoundException('Album not found');
    return album;
  }

  async create(data: { title: string; description?: string; authorId: string }) {
    const slug = this.slugify(data.title);
    return this.prisma.galleryAlbum.create({ data: { ...data, slug } });
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    return this.prisma.galleryAlbum.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title, slug: this.slugify(dto.title) }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.coverMediaId !== undefined && { coverMediaId: dto.coverMediaId }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      include: { coverMedia: true, items: { include: { media: true } } },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.galleryAlbum.update({ where: { id }, data: { status: 'PUBLISHED' } });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.galleryAlbum.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addItem(albumId: string, mediaId: string, sortOrder?: number) {
    await this.findById(albumId);
    const count = await this.prisma.galleryItem.count({ where: { albumId } });
    return this.prisma.galleryItem.create({ data: { albumId, mediaId, sortOrder: sortOrder ?? count } });
  }

  async removeItem(id: string) {
    return this.prisma.galleryItem.delete({ where: { id } });
  }

  async reorderItems(albumId: string, orderedIds: string[]) {
    const ops = orderedIds.map((itemId, idx) =>
      this.prisma.galleryItem.update({ where: { id: itemId }, data: { sortOrder: idx } }),
    );
    return this.prisma.$transaction(ops);
  }

  private slugify(title: string) {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }
}

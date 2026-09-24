import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MediaType } from '@prisma/client';
import { MediaStorageService } from './media-storage.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private storage: MediaStorageService,
  ) {}

  async findAll(params?: { page?: number; limit?: number; folder?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 20;
    const { folder } = params || {};
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (folder) where.folder = folder;

    const [data, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.mediaAsset.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async create(data: {
    url: string;
    originalUrl?: string | null;
    fileName: string;
    mimeType: string;
    type: string;
    fileSize?: number;
    uploadedBy: string;
    altText?: string;
    caption?: string;
    folder?: string;
  }) {
    return this.prisma.mediaAsset.create({
      data: {
        ...data,
        originalUrl: data.originalUrl ?? null,
        type: data.type as MediaType,
      },
    });
  }

  async update(id: string, data: { altText?: string; caption?: string; folder?: string }) {
    await this.findById(id);
    return this.prisma.mediaAsset.update({ where: { id }, data });
  }

  async remove(id: string) {
    const media = await this.findById(id);
    if (media.deletedAt) return media;

    if (media.originalUrl) {
      await this.storage.destroy(media.originalUrl);
    } else if (media.url?.startsWith('/uploads/')) {
      await this.storage.destroyLocal(media.url);
    }

    return this.prisma.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ContentStatus, ConsentStatus } from '@prisma/client';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = { status: 'PUBLISHED', deletedAt: null };
    if (params?.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        skip,
        take: limit,
        include: { media: true, author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.story.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlugPublic(slug: string) {
    const story = await this.prisma.story.findFirst({
      where: { title: { contains: slug }, status: 'PUBLISHED', deletedAt: null },
      include: { media: true, author: { select: { id: true, name: true } } },
    });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async findAllAdmin(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        skip,
        take: limit,
        include: { media: true, author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.story.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: { media: true, author: { select: { id: true, name: true } } },
    });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async create(dto: any, authorId: string) {
    const slug = dto.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    return this.prisma.story.create({
      data: {
        title: dto.title,
        body: dto.body,
        quote: dto.quote,
        personLabel: dto.personLabel,
        mediaId: dto.mediaId,
        consentStatus: (dto.consentStatus as ConsentStatus) || 'PENDING',
        consentDate: dto.consentDate ? new Date(dto.consentDate) : null,
        consentNotes: dto.consentNotes,
        authorId,
        status: (dto.status as ContentStatus) || 'DRAFT',
      },
      include: { media: true },
    });
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    return this.prisma.story.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.quote !== undefined && { quote: dto.quote }),
        ...(dto.personLabel !== undefined && { personLabel: dto.personLabel }),
        ...(dto.mediaId !== undefined && { mediaId: dto.mediaId }),
        ...(dto.consentStatus !== undefined && { consentStatus: dto.consentStatus }),
        ...(dto.consentDate !== undefined && { consentDate: dto.consentDate ? new Date(dto.consentDate) : null }),
        ...(dto.consentNotes !== undefined && { consentNotes: dto.consentNotes }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.publishedAt !== undefined && { publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null }),
      },
      include: { media: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.story.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.story.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
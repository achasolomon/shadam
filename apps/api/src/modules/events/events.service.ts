import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { status: 'PUBLISHED' as const, deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: { coverMedia: true },
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlugPublic(slug: string) {
    const event = await this.prisma.event.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async getFeatured() {
    const now = new Date();
    const upcoming = await this.prisma.event.findFirst({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        startAt: { gte: now },
      },
      include: { coverMedia: true },
      orderBy: { startAt: 'asc' },
    });
    if (upcoming) return upcoming;
    return this.prisma.event.findFirst({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true },
      orderBy: { startAt: 'desc' },
    });
  }

  async findAllAdmin(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const { status } = params || {};
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({ where, skip, take: limit, include: { coverMedia: true }, orderBy: { startAt: 'desc' } }),
      this.prisma.event.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id }, include: { coverMedia: true } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto, authorId: string) {
    const slug = await this.generateSlug(dto.title);
    const { coverMediaId, ...rest } = dto;
    return this.prisma.event.create({
      data: {
        ...rest,
        slug,
        authorId,
        body: dto.body || {},
        ...(coverMediaId !== undefined && { coverMediaId }),
      },
      include: { coverMedia: true },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findById(id);
    const { coverMediaId, ...rest } = dto;
    return this.prisma.event.update({
      where: { id },
      data: {
        ...rest,
        ...(coverMediaId !== undefined && { coverMediaId }),
      },
      include: { coverMedia: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private async generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const existing = await this.prisma.event.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;
    return slug;
  }
}

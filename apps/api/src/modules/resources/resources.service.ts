import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; category?: string }) {
    const { page = 1, limit = 10, category } = params || {};
    const skip = (page - 1) * limit;
    const where: any = { status: 'PUBLISHED', deletedAt: null };
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.resource.findMany({ where, skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      this.prisma.resource.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin() {
    return this.prisma.resource.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any, authorId: string) {
    return this.prisma.resource.create({ data: { ...data, authorId } });
  }

  async update(id: string, data: any) {
    return this.prisma.resource.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateResourceDto, UpdateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; category?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = { status: 'PUBLISHED', deletedAt: null };
    if (params?.category) where.category = params.category;

    const [data, total] = await Promise.all([
      this.prisma.resource.findMany({ where, skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      this.prisma.resource.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin() {
    return this.prisma.resource.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findPublicById(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource || resource.deletedAt || resource.status !== 'PUBLISHED') {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }

  async findById(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource || resource.deletedAt) throw new NotFoundException('Resource not found');
    return resource;
  }

  async create(dto: CreateResourceDto, authorId: string) {
    const data: any = { ...dto, authorId };
    data.resourceType = dto.resourceType || 'DOCUMENT';
    if (data.resourceType === 'ARTICLE' && !data.body) data.body = '';
    if (dto.status === 'PUBLISHED' && !dto.publishedAt) data.publishedAt = new Date();
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);
    return this.prisma.resource.create({ data });
  }

  async update(id: string, dto: UpdateResourceDto) {
    await this.findById(id);
    const data: any = { ...dto };
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);
    else delete data.publishedAt;
    return this.prisma.resource.update({ where: { id }, data });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.resource.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

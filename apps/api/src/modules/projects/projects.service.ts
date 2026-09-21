import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; category?: string }) {
    const { page = 1, limit = 10, category } = params || {};
    const skip = (page - 1) * limit;

    const where: any = { status: 'PUBLISHED', deletedAt: null };
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { coverMedia: true, author: { select: { id: true, name: true } } },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlugPublic(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true, author: { select: { id: true, name: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findAllAdmin(params?: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 10, status } = params || {};
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { coverMedia: true, author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { coverMedia: true, author: { select: { id: true, name: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(dto: CreateProjectDto, authorId: string) {
    const slug = await this.generateSlug(dto.title);
    return this.prisma.project.create({
      data: {
        ...dto,
        slug,
        authorId,
        body: dto.body || {},
      },
      include: { coverMedia: true },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findById(id);
    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: { coverMedia: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.project.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
  }

  async archive(id: string) {
    await this.findById(id);
    return this.prisma.project.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async generateSlug(title: string) {
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await this.prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    return slug;
  }
}

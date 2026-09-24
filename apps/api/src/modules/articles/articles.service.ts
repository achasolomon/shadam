import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; category?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const { category } = params || {};
    const skip = (page - 1) * limit;
    const where: any = { status: 'PUBLISHED', deletedAt: null };
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where, skip, take: limit,
        include: { coverMedia: true, author: { select: { id: true, name: true } }, tags: true },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.article.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlugPublic(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { coverMedia: true, author: { select: { id: true, name: true } }, tags: true },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async findAllAdmin(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const { status } = params || {};
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({ where, skip, take: limit, include: { coverMedia: true, author: { select: { id: true, name: true } }, tags: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.article.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id }, include: { coverMedia: true, author: { select: { id: true, name: true } }, tags: true } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: CreateArticleDto, authorId: string) {
    const slug = await this.generateSlug(dto.title);
    const { tags, coverMediaId, ...data } = dto;
    return this.prisma.article.create({
      data: {
        ...data,
        slug,
        authorId,
        body: dto.body || {},
        ...(coverMediaId !== undefined && { coverMediaId }),
        tags: tags ? { create: tags.map((t) => ({ tag: t })) } : undefined,
      },
      include: { tags: true },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.findById(id);
    const { tags, coverMediaId, ...data } = dto;
    if (tags) {
      await this.prisma.articleTag.deleteMany({ where: { articleId: id } });
    }
    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        ...(coverMediaId !== undefined && { coverMediaId }),
        tags: tags ? { create: tags.map((t) => ({ tag: t })) } : undefined,
      },
      include: { tags: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.article.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.article.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private async generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;
    return slug;
  }
}

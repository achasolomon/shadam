import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findBySlugPublic(slug: string) {
    const page = await this.prisma.page.findFirst({ where: { slug, status: 'PUBLISHED', deletedAt: null } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findAllAdmin() {
    return this.prisma.page.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async create(data: { title: string; slug?: string; body?: any; authorId: string }) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    return this.prisma.page.create({ data: { ...data, slug, body: data.body || {} } });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.page.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.page.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

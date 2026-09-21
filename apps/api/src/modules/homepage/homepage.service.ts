import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class HomepageService {
  constructor(private prisma: PrismaService) {}

  async getSections() {
    return this.prisma.homepageSection.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } });
  }

  async findAllAdmin() {
    return this.prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async update(id: string, data: any) {
    return this.prisma.homepageSection.update({ where: { id }, data });
  }
}

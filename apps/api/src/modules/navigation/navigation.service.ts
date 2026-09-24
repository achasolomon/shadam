import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async findByLocation(location?: string) {
    const loc = (location || 'HEADER').toUpperCase();
    return this.prisma.navigationItem.findMany({
      where: { location: loc as any, status: 'ACTIVE', parentId: null },
      include: { children: { where: { status: 'ACTIVE' }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.navigationItem.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async create(data: any) { return this.prisma.navigationItem.create({ data }); }
  async update(id: string, data: any) { return this.prisma.navigationItem.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.navigationItem.delete({ where: { id } }); }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.teamMember.findMany({ where: { status: 'ACTIVE' }, orderBy: { sortOrder: 'asc' } });
  }

  async findAllAdmin() {
    return this.prisma.teamMember.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } });
  }

  async create(data: any) { return this.prisma.teamMember.create({ data }); }
  async update(id: string, data: any) { return this.prisma.teamMember.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.teamMember.update({ where: { id }, data: { deletedAt: new Date() } }); }
}

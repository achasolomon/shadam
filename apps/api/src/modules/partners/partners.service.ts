import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(params?: { page?: number; limit?: number; category?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 100;
    const skip = (page - 1) * limit;
    const where: any = { status: 'PUBLISHED' };
    if (params?.category) where.category = params.category;

    const [data, total] = await Promise.all([
      this.prisma.partner.findMany({ where, skip, take: limit, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
      this.prisma.partner.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin() {
    return this.prisma.partner.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  }

  async findById(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async create(dto: CreatePartnerDto) {
    return this.prisma.partner.create({ data: { ...dto } });
  }

  async update(id: string, dto: UpdatePartnerDto) {
    await this.findById(id);
    return this.prisma.partner.update({ where: { id }, data: { ...dto } });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.partner.delete({ where: { id } });
    return { id, deleted: true };
  }
}

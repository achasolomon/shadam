import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: {
    donorName: string;
    donorEmail?: string;
    donorPhone?: string;
    amount: number;
    currency?: string;
    frequency?: string;
    method?: string;
    projectId?: string;
    message?: string;
  }) {
    return this.prisma.donation.create({
      data: {
        donorName: dto.donorName,
        donorEmail: dto.donorEmail,
        donorPhone: dto.donorPhone,
        amount: dto.amount,
        currency: dto.currency || 'NGN',
        frequency: dto.frequency || 'one_time',
        method: dto.method,
        projectId: dto.projectId,
        message: dto.message,
        status: 'PENDING',
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; status?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params?.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        skip,
        take: limit,
        include: { project: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.donation.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getStats() {
    const [totalAmount, byStatusRaw, recent] = await Promise.all([
      this.prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
      this.prisma.donation.groupBy({ by: ['status'], _count: true }),
      this.prisma.donation.findMany({ take: 5, include: { project: { select: { title: true } } }, orderBy: { createdAt: 'desc' } }),
    ]);
    return {
      totalDonations: totalAmount._count,
      totalAmount: totalAmount._sum.amount?.toString() || '0',
      byStatus: byStatusRaw,
      recent,
    };
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.donation.update({ where: { id }, data: { status } });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class EventRegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { eventId: string; name: string; email: string; phone?: string; ticketType?: string; notes?: string }) {
    const event = await this.prisma.event.findFirst({ where: { id: dto.eventId, deletedAt: null } });
    if (!event) throw new NotFoundException('Event not found');
    return this.prisma.eventRegistration.create({ data: dto });
  }

  async findAll(params?: { page?: number; limit?: number; eventId?: string }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params?.eventId) where.eventId = params.eventId;

    const [data, total] = await Promise.all([
      this.prisma.eventRegistration.findMany({
        where,
        skip,
        take: limit,
        include: { event: { select: { id: true, title: true, slug: true, startAt: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.eventRegistration.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, status: string) {
    await this.prisma.eventRegistration.findUniqueOrThrow({ where: { id } });
    return this.prisma.eventRegistration.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    return this.prisma.eventRegistration.delete({ where: { id } });
  }
}
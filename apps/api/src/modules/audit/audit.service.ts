import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: { actorId?: string; action: string; entity: string; entityId?: string; metadata?: any; ipAddress?: string; userAgent?: string }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(params?: { page?: number; limit?: number; entity?: string }) {
    const { page = 1, limit = 50, entity } = params || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (entity) where.entity = entity;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take: limit, include: { actor: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

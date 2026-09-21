import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiryType, EnquiryStatus } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnquiryDto) {
    return this.prisma.enquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        type: (dto.type as EnquiryType) || 'GENERAL',
        subject: dto.subject,
        message: dto.message,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 10, status } = params || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status as EnquiryStatus;

    const [data, total] = await Promise.all([
      this.prisma.enquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.enquiry.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const enquiry = await this.prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return enquiry;
  }

  async update(id: string, data: { status?: string; assignedTo?: string; notes?: any }) {
    await this.findById(id);
    return this.prisma.enquiry.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status as EnquiryStatus }),
        ...(data.assignedTo !== undefined && { assignee: data.assignedTo ? { connect: { id: data.assignedTo } } : { disconnect: true } }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  }
}

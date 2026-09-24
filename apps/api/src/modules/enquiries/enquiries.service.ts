import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MailService } from '../../mail/mail.service';
import { CreateEnquiryDto, ReplyEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiryType, EnquiryStatus, Prisma } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

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
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const { status } = params || {};
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

  async reply(id: string, dto: ReplyEnquiryDto) {
    const enquiry = await this.findById(id);
    const message = dto.message.trim();
    if (!message) throw new BadRequestException('Reply message is required');

    const subject =
      dto.subject?.trim() ||
      (enquiry.subject ? `Re: ${enquiry.subject}` : `Re: Your enquiry to SHEDAM`);

    let channelResult: {
      ok: boolean;
      mode: string;
      error?: string;
      smsLink?: string;
    };

    if (dto.channel === 'EMAIL') {
      const result = await this.mail.send(
        this.mail.enquiryReplyEmail(enquiry.email, subject, [
          `Hello ${enquiry.name},`,
          message,
          `— SHEDAM Mental Health Initiative`,
        ]),
      );
      channelResult = { ok: result.ok, mode: result.mode, error: result.error };
    } else {
      if (!enquiry.phone) throw new BadRequestException('This enquirer has no phone number on file');
      const result = await this.mail.sendSms(enquiry.phone, message);
      channelResult = { ok: result.ok, mode: result.mode, error: result.error, smsLink: result.smsLink };
    }

    if (!channelResult.ok) {
      throw new BadRequestException(channelResult.error || 'Failed to send reply');
    }

    const entry = {
      channel: dto.channel,
      message,
      subject,
      mode: channelResult.mode,
      sentAt: new Date().toISOString(),
      to: dto.channel === 'EMAIL' ? enquiry.email : enquiry.phone,
    };

    const existingReplies = (enquiry.replies as unknown) || [];
    const replies = Array.isArray(existingReplies) ? existingReplies : [];
    const nextStatus =
      enquiry.status === 'NEW' || enquiry.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : enquiry.status;

    const updated = await this.prisma.enquiry.update({
      where: { id },
      data: {
        replies: [...replies, entry] as unknown as Prisma.InputJsonValue,
        status: nextStatus as EnquiryStatus,
      },
    });

    this.logger.log(`Enquiry reply ${dto.channel} to ${entry.to}: mode=${channelResult.mode}`);

    return {
      enquiry: updated,
      channel: dto.channel,
      mode: channelResult.mode,
      smsLink: channelResult.smsLink,
      ok: true,
    };
  }
}

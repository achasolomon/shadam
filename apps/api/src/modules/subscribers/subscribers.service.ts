import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class SubscribersService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string, source?: string) {
    return this.prisma.subscriber.upsert({
      where: { email },
      update: { status: 'ACTIVE' },
      create: { email, consentAt: new Date(), source },
    });
  }

  async findAll() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

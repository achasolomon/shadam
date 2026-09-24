import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class SubscribersService {
  private readonly logger = new Logger(SubscribersService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async subscribe(email: string, source?: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.prisma.subscriber.findUnique({ where: { email: normalized } });
    const shouldWelcome = !existing || existing.status !== 'ACTIVE';

    const subscriber = await this.prisma.subscriber.upsert({
      where: { email: normalized },
      update: { status: 'ACTIVE', consentAt: new Date() },
      create: { email: normalized, consentAt: new Date(), source: source || 'website' },
    });

    if (shouldWelcome) {
      this.mail
        .send(this.mail.welcomeEmail(normalized))
        .then((r) => this.logger.log(`Welcome email to ${normalized}: ${r.mode}${r.ok ? '' : ' FAILED'}`))
        .catch((err) => this.logger.error(`Welcome email failed for ${normalized}: ${err?.message}`));
    }

    return subscriber;
  }

  async unsubscribe(email: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.prisma.subscriber.findUnique({ where: { email: normalized } });
    if (!existing) throw new NotFoundException('Subscriber not found');
    if (existing.status === 'UNSUBSCRIBED') return existing;
    return this.prisma.subscriber.update({
      where: { email: normalized },
      data: { status: 'UNSUBSCRIBED' },
    });
  }

  async findAll() {
    const [data, total, active, unsubscribed] = await Promise.all([
      this.prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.subscriber.count(),
      this.prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
      this.prisma.subscriber.count({ where: { status: 'UNSUBSCRIBED' } }),
    ]);
    return { data, meta: { total, active, unsubscribed } };
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED') {
    const existing = await this.prisma.subscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscriber not found');
    return this.prisma.subscriber.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    const existing = await this.prisma.subscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscriber not found');
    await this.prisma.subscriber.delete({ where: { id } });
    return { id, deleted: true };
  }

  async sendNewsletter(subject: string, message: string, isHtml?: boolean) {
    const subscribers = await this.prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return { sent: 0, failed: 0, total: 0, mode: 'dev' as const };
    }

    const bodyHtml = isHtml
      ? message
      : message
          .split(/\n{2,}/)
          .map((p) => `<p>${p.replace(/\n/g, '<br>').replace(/</g, '&lt;')}</p>`)
          .join('');

    const messages = subscribers.map((s) => this.mail.newsletterEmail(s.email, subject, bodyHtml));
    const result = await this.mail.sendMany(messages);
    this.logger.log(`Newsletter "${subject}": sent=${result.sent} failed=${result.failed}`);
    return { ...result, total: subscribers.length };
  }
}

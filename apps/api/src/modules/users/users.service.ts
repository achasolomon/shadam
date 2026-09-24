import { Injectable, NotFoundException, ConflictException, BadRequestException, GoneException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { UserStatus } from '@prisma/client';
import { MailService } from '../../mail/mail.service';

const INVITE_TTL_HOURS = 72;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  async create(dto: { name: string; email: string; passwordHash?: string | null; roleId?: string; status?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      if (existing.deletedAt) {
        throw new ConflictException('A deleted account already uses this email — use a different address');
      }
      throw new ConflictException('Email already in use');
    }
    const data: any = {
      name: dto.name,
      email: dto.email,
      passwordHash: dto.passwordHash ?? null,
      status: (dto.status as UserStatus) || 'ACTIVE',
    };
    if (dto.roleId) data.role = { connect: { id: dto.roleId } };
    return this.prisma.user.create({ data, include: { role: true } });
  }

  private generateInviteToken(): string {
    return randomBytes(32).toString('hex');
  }

  private inviteExpiry(): Date {
    return new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);
  }

  private siteUrl(): string {
    return (
      this.config.get<string>('SITE_URL') ||
      this.config.get<string>('NEXT_PUBLIC_SITE_URL') ||
      'http://localhost:3000'
    );
  }

  private inviteUrl(token: string): string {
    return `${this.siteUrl()}/admin/invite?token=${encodeURIComponent(token)}`;
  }

  async createInvited(dto: { name: string; email: string; roleId?: string }) {
    const inviteToken = this.generateInviteToken();
    const inviteExpiresAt = this.inviteExpiry();
    const user = await this.create({
      name: dto.name,
      email: dto.email,
      passwordHash: null,
      roleId: dto.roleId,
      status: 'INVITED',
    });
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { inviteToken, inviteExpiresAt, invitedAt: new Date() },
      include: { role: true },
    });
    await this.sendInviteEmail(updated.email, updated.name, inviteToken, inviteExpiresAt);
    return updated;
  }

  async sendInviteEmail(email: string, name: string, token: string, expiresAt: Date | null) {
    const result = await this.mail.send(
      this.mail.adminInviteEmail(email, name, this.inviteUrl(token), expiresAt),
    );
    if (!result.ok) {
      throw new BadRequestException(`Invite email failed to send: ${result.error || 'unknown error'}`);
    }
    return result;
  }

  async resendInvite(id: string) {
    const user = await this.findById(id);
    if (user.deletedAt) throw new NotFoundException('User not found');
    if (user.status === 'ACTIVE' && user.passwordHash) {
      throw new BadRequestException('User has already completed registration');
    }
    const inviteToken = this.generateInviteToken();
    const inviteExpiresAt = this.inviteExpiry();
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        inviteToken,
        inviteExpiresAt,
        invitedAt: new Date(),
        status: 'INVITED',
      },
      include: { role: true },
    });
    await this.sendInviteEmail(updated.email, updated.name, inviteToken, inviteExpiresAt);
    return this.stripSensitive(updated);
  }

  async findByInviteToken(token: string) {
    if (!token) throw new NotFoundException('Invalid invitation link');
    const user = await this.prisma.user.findUnique({
      where: { inviteToken: token },
      include: { role: true },
    });
    if (!user || user.deletedAt) throw new NotFoundException('Invalid invitation link');
    if (!user.inviteExpiresAt || user.inviteExpiresAt.getTime() < Date.now()) {
      throw new GoneException('This invitation link has expired. Ask an admin to resend it.');
    }
    if (user.passwordHash && user.status === 'ACTIVE') {
      throw new BadRequestException('This invitation has already been used');
    }
    return user;
  }

  async acceptInvite(token: string, password: string) {
    const user = await this.findByInviteToken(token);
    const passwordHash = await bcrypt.hash(password, 12);
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        status: 'ACTIVE',
        inviteToken: null,
        inviteExpiresAt: null,
        invitedAt: null,
        lastLogin: new Date(),
      },
      include: { role: true },
    });
  }

  stripSensitive(user: any) {
    const { passwordHash, inviteToken, ...rest } = user;
    return rest;
  }

  async getRoles() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params || {};
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          avatarUrl: true,
          lastLogin: true,
          createdAt: true,
          invitedAt: true,
          inviteExpiresAt: true,
          role: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async updateRaw(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (user.deletedAt) {
      return user;
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
        email: `${user.email}#deleted-${Date.now()}`,
        inviteToken: null,
        inviteExpiresAt: null,
      },
      include: { role: true },
    });
  }
}

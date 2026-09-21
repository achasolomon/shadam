import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const data: any = {
      name: dto.name,
      email: dto.email,
      passwordHash: dto.passwordHash,
      status: (dto.status as UserStatus) || 'ACTIVE',
    };
    if (dto.roleId) data.role = { connect: { id: dto.roleId } };
    return this.prisma.user.create({ data, include: { role: true } });
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params || {};
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: data.map((u: any) => ({ ...u, passwordHash: undefined })),
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

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.status) data.status = dto.status as UserStatus;
    if (dto.roleId) data.role = { connect: { id: dto.roleId } };
    return this.prisma.user.update({ where: { id }, data, include: { role: true } });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

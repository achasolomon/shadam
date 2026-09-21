import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.siteSetting.findMany(); }

  async findByGroup(groupName: string) { return this.prisma.siteSetting.findMany({ where: { groupName } }); }

  async findByKey(key: string) { return this.prisma.siteSetting.findUnique({ where: { key } }); }

  async upsert(key: string, value: string, updatedBy?: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value, updatedBy },
      create: { key, value, updatedBy },
    });
  }
}

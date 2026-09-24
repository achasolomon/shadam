import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  private itemsOrderBy = [{ sortOrder: 'asc' as const }, { date: 'desc' as const }, { createdAt: 'desc' as const }];

  async findAllPublic() {
    return this.prisma.teamMember.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlugPublic(slug: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { slug, status: 'ACTIVE', deletedAt: null },
      include: { items: { orderBy: this.itemsOrderBy } },
    });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async findAllAdmin() {
    return this.prisma.teamMember.findMany({
      where: { deletedAt: null },
      include: { items: { orderBy: this.itemsOrderBy } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
      include: { items: { orderBy: this.itemsOrderBy } },
    });
    if (!member || member.deletedAt) throw new NotFoundException('Team member not found');
    return member;
  }

  async create(data: any) {
    const payload = { ...data };
    if (!payload.slug && payload.name) payload.slug = this.slugify(payload.name);
    return this.prisma.teamMember.create({
      data: payload,
      include: { items: { orderBy: this.itemsOrderBy } },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    const payload = { ...data };
    if (payload.name && payload.slug === undefined) {
      payload.slug = this.slugify(payload.name);
    } else if (payload.slug === '') {
      payload.slug = null;
    }
    return this.prisma.teamMember.update({
      where: { id },
      data: payload,
      include: { items: { orderBy: this.itemsOrderBy } },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.teamMember.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addItem(memberId: string, body: any) {
    await this.findById(memberId);
    const count = await this.prisma.teamMemberItem.count({ where: { memberId } });
    const date = body.date ? new Date(body.date) : null;
    return this.prisma.teamMemberItem.create({
      data: {
        memberId,
        kind: body.kind || 'CONTRIBUTION',
        title: body.title,
        description: body.description ?? null,
        date: date && !Number.isNaN(date.getTime()) ? date : null,
        venue: body.venue ?? null,
        url: body.url ?? null,
        sortOrder: body.sortOrder ?? count,
      },
    });
  }

  async updateItem(itemId: string, body: any) {
    const existing = await this.prisma.teamMemberItem.findUnique({ where: { id: itemId } });
    if (!existing) throw new NotFoundException('Item not found');
    const data: any = {};
    if (body.kind !== undefined) data.kind = body.kind;
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.venue !== undefined) data.venue = body.venue;
    if (body.url !== undefined) data.url = body.url;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
    if (body.date !== undefined) {
      if (!body.date) data.date = null;
      else {
        const d = new Date(body.date);
        data.date = Number.isNaN(d.getTime()) ? null : d;
      }
    }
    return this.prisma.teamMemberItem.update({ where: { id: itemId }, data });
  }

  async removeItem(itemId: string) {
    const existing = await this.prisma.teamMemberItem.findUnique({ where: { id: itemId } });
    if (!existing) throw new NotFoundException('Item not found');
    return this.prisma.teamMemberItem.delete({ where: { id: itemId } });
  }

  private slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

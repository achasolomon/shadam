import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  @Roles('Super Admin', 'Content Manager', 'Events Manager', 'Support Officer', 'Editor')
  @ApiOperation({ summary: 'Get dashboard stats' })
  async getStats() {
    const [
      projects,
      publishedProjects,
      events,
      publishedEvents,
      articles,
      publishedArticles,
      enquiries,
      openEnquiries,
      teamMembers,
      mediaAssets,
      stories,
      subscribers,
      eventRegistrations,
      donations,
      users,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.event.count(),
      this.prisma.event.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.article.count(),
      this.prisma.article.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.enquiry.count(),
      this.prisma.enquiry.count({ where: { status: { in: ['NEW', 'IN_PROGRESS'] } } }),
      this.prisma.teamMember.count(),
      this.prisma.mediaAsset.count(),
      this.prisma.story.count({ where: { deletedAt: null } }),
      this.prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
      this.prisma.eventRegistration.count(),
      this.prisma.donation.count(),
      this.prisma.user.count(),
    ]);

    const [donationAgg, recentEnquiries, recentEvents, recentArticles] = await Promise.all([
      this.prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
      this.prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      this.prisma.event.findMany({ take: 5, orderBy: { startAt: 'desc' } }).catch(() => []),
      this.prisma.article.findMany({ take: 5, orderBy: { publishedAt: 'desc' } }).catch(() => []),
    ]);

    return {
      projects,
      publishedProjects,
      events,
      publishedEvents,
      articles,
      publishedArticles,
      enquiries,
      openEnquiries,
      teamMembers,
      mediaAssets,
      stories,
      subscribers,
      eventRegistrations,
      donations,
      users,
      donationStats: {
        totalCount: donationAgg._count,
        totalAmount: donationAgg._sum.amount?.toString() || '0',
      },
      recentEnquiries,
      recentEvents,
      recentArticles,
    };
  }
}
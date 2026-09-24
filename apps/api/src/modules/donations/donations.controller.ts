import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Donations')
@Controller()
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Post('donations')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Submit a donation pledge' })
  create(@Body() dto: any) {
    return this.donationsService.create(dto);
  }

  @Get('admin/donations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer', 'Read Only')
  @ApiBearerAuth()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.donationsService.findAll({ page, limit, status });
  }

  @Get('admin/donations/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer', 'Read Only')
  @ApiBearerAuth()
  stats() {
    return this.donationsService.getStats();
  }

  @Patch('admin/donations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer')
  @ApiBearerAuth()
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.donationsService.updateStatus(id, body.status);
  }
}

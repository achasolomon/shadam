import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto, ReplyEnquiryDto } from './dto/create-enquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Enquiries')
@Controller()
export class EnquiriesController {
  constructor(private enquiriesService: EnquiriesService) {}

  @Post('enquiries')
  @Public()
  @ApiOperation({ summary: 'Submit enquiry' })
  create(@Body() dto: CreateEnquiryDto) {
    return this.enquiriesService.create(dto);
  }

  @Get('admin/enquiries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.enquiriesService.findAll({ page, limit, status });
  }

  @Get('admin/enquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.enquiriesService.findById(id);
  }

  @Patch('admin/enquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer')
  @Permissions('enquiries')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: { status?: string; assignedTo?: string }) {
    return this.enquiriesService.update(id, body);
  }

  @Post('admin/enquiries/:id/replies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Support Officer')
  @Permissions('enquiries')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send reply to enquirer via email or SMS' })
  reply(@Param('id') id: string, @Body() dto: ReplyEnquiryDto) {
    return this.enquiriesService.reply(id, dto);
  }
}

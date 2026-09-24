import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventRegistrationsService } from './event-registrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Event Registrations')
@Controller()
export class EventRegistrationsController {
  constructor(private registrationsService: EventRegistrationsService) {}

  @Post('event-registrations')
  @Public()
  @ApiOperation({ summary: 'Register for an event' })
  create(@Body() dto: { eventId: string; name: string; email: string; phone?: string; ticketType?: string; notes?: string }) {
    return this.registrationsService.create(dto);
  }

  @Get('admin/event-registrations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Support Officer', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('eventId') eventId?: string) {
    return this.registrationsService.findAll({ page, limit, eventId });
  }

  @Patch('admin/event-registrations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager')
  @Permissions('events')
  @ApiBearerAuth()
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.registrationsService.updateStatus(id, body.status);
  }

  @Delete('admin/event-registrations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager')
  @Permissions('events')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.registrationsService.remove(id);
  }
}

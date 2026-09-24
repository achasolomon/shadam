import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Events')
@Controller()
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('events')
  @Public()
  @ApiOperation({ summary: 'List published events' })
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.eventsService.findAllPublic({ page, limit });
  }

  @Get('events/featured')
  @Public()
  @ApiOperation({ summary: 'Get featured event' })
  getFeatured() {
    return this.eventsService.getFeatured();
  }

  @Get('events/:slug')
  @Public()
  @ApiOperation({ summary: 'Get event by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlugPublic(slug);
  }

  @Get('admin/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all events (admin)' })
  findAllAdmin(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.eventsService.findAllAdmin({ page, limit, status });
  }

  @Get('admin/events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post('admin/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager')
  @Permissions('events')
  @ApiBearerAuth()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(dto, user.sub);
  }

  @Patch('admin/events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager')
  @Permissions('events')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Post('admin/events/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager', 'Editor')
  @Permissions('publish')
  @ApiBearerAuth()
  publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Delete('admin/events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Events Manager', 'Content Manager')
  @Permissions('events')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

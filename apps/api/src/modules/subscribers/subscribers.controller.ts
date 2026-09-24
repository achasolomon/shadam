import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import {
  SubscribeDto,
  UnsubscribeDto,
  UpdateSubscriberDto,
  SendNewsletterDto,
} from './dto/subscribers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Subscribers')
@Controller()
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Post('newsletter/subscribe')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  subscribe(@Body() dto: SubscribeDto) {
    return this.subscribersService.subscribe(dto.email, 'website');
  }

  @Post('newsletter/unsubscribe')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  unsubscribe(@Body() dto: UnsubscribeDto) {
    return this.subscribersService.unsubscribe(dto.email);
  }

  @Get('admin/subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Support Officer', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List newsletter subscribers' })
  findAll() {
    return this.subscribersService.findAll();
  }

  @Patch('admin/subscribers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Support Officer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscriber status' })
  update(@Param('id') id: string, @Body() dto: UpdateSubscriberDto) {
    return this.subscribersService.updateStatus(id, dto.status);
  }

  @Delete('admin/subscribers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete subscriber' })
  remove(@Param('id') id: string) {
    return this.subscribersService.remove(id);
  }

  @Post('admin/newsletter/send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send newsletter to all active subscribers' })
  send(@Body() dto: SendNewsletterDto) {
    return this.subscribersService.sendNewsletter(dto.subject, dto.message, dto.isHtml === 'true' || dto.isHtml === '1');
  }
}

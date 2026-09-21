import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';

@ApiTags('Subscribers')
@Controller()
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Post('newsletter/subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  subscribe(@Body() body: { email: string }) {
    return this.subscribersService.subscribe(body.email, 'website');
  }
}

import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Settings')
@Controller()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('settings')
  findAll() { return this.settingsService.findAll(); }

  @Get('settings/:group')
  findByGroup(@Param('group') group: string) { return this.settingsService.findByGroup(group); }

  @Put('admin/settings/:key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin')
  @ApiBearerAuth()
  upsert(@Param('key') key: string, @Body() body: { value: string }) {
    return this.settingsService.upsert(key, body.value);
  }
}

import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Navigation')
@Controller()
export class NavigationController {
  constructor(private navigationService: NavigationService) {}

  @Get('navigation')
  findByLocation(@Query('location') location: string) { return this.navigationService.findByLocation(location || 'header'); }

  @Get('admin/navigation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findAllAdmin() { return this.navigationService.findAllAdmin(); }

  @Post('admin/navigation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() body: any) { return this.navigationService.create(body); }

  @Patch('admin/navigation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.navigationService.update(id, body); }

  @Delete('admin/navigation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.navigationService.remove(id); }
}

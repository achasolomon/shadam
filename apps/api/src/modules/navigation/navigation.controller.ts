import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Navigation')
@Controller()
export class NavigationController {
  constructor(private navigationService: NavigationService) {}

  @Get('navigation')
  @Public()
  findByLocation(@Query('location') location?: string) { return this.navigationService.findByLocation(location); }

  @Get('admin/navigation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAllAdmin() { return this.navigationService.findAllAdmin(); }

  @Post('admin/navigation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('pages')
  @ApiBearerAuth()
  create(@Body() body: any) { return this.navigationService.create(body); }

  @Patch('admin/navigation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('pages')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.navigationService.update(id, body); }

  @Delete('admin/navigation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('pages')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.navigationService.remove(id); }
}

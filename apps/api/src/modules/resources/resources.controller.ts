import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Resources')
@Controller()
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('resources')
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.resourcesService.findAllPublic({ page, limit, category });
  }

  @Get('admin/resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findAllAdmin() { return this.resourcesService.findAllAdmin(); }

  @Post('admin/resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() body: any, @CurrentUser() user: any) { return this.resourcesService.create(body, user.sub); }

  @Patch('admin/resources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.resourcesService.update(id, body); }

  @Delete('admin/resources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.resourcesService.remove(id); }
}

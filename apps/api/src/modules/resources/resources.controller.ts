import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Resources')
@Controller()
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('resources')
  @Public()
  @ApiOperation({ summary: 'List published resources' })
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.resourcesService.findAllPublic({ page, limit, category });
  }

  @Get('resources/:id')
  @Public()
  @ApiOperation({ summary: 'Get a published resource' })
  findPublicById(@Param('id') id: string) {
    return this.resourcesService.findPublicById(id);
  }

  @Get('admin/resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAllAdmin() {
    return this.resourcesService.findAllAdmin();
  }

  @Get('admin/resources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.resourcesService.findById(id);
  }

  @Post('admin/resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('resources')
  @ApiBearerAuth()
  create(@Body() dto: CreateResourceDto, @CurrentUser() user: any) {
    return this.resourcesService.create(dto, user.sub);
  }

  @Patch('admin/resources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('resources')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.resourcesService.update(id, dto);
  }

  @Post('admin/resources/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('publish')
  @ApiBearerAuth()
  publish(@Param('id') id: string) {
    return this.resourcesService.publish(id);
  }

  @Delete('admin/resources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('resources')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}

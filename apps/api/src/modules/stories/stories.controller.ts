import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Stories')
@Controller()
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get('stories')
  @ApiOperation({ summary: 'List published stories' })
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.storiesService.findAllPublic({ page, limit });
  }

  @Get('stories/:slug')
  @ApiOperation({ summary: 'Get story by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.storiesService.findBySlugPublic(slug);
  }

  @Get('admin/stories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  findAllAdmin(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.storiesService.findAllAdmin({ page, limit, status });
  }

  @Get('admin/stories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.storiesService.findById(id);
  }

  @Post('admin/stories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() dto: any, @CurrentUser() user: any) {
    return this.storiesService.create(dto, user.sub);
  }

  @Patch('admin/stories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: any) {
    return this.storiesService.update(id, dto);
  }

  @Post('admin/stories/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  publish(@Param('id') id: string) {
    return this.storiesService.publish(id);
  }

  @Delete('admin/stories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.storiesService.remove(id);
  }
}
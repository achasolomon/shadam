import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Gallery')
@Controller()
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get('gallery/albums')
  findAllPublic() { return this.galleryService.findAllPublic(); }

  @Get('gallery/albums/:slug')
  findBySlug(@Param('slug') slug: string) { return this.galleryService.findBySlugPublic(slug); }

  @Get('admin/gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  findAllAdmin(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.galleryService.findAllAdmin({ page, limit, status });
  }

  @Get('admin/gallery/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  findById(@Param('id') id: string) { return this.galleryService.findById(id); }

  @Post('admin/gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  create(@Body() body: { title: string; description?: string }, @CurrentUser() user: any) {
    return this.galleryService.create({ ...body, authorId: user.sub });
  }

  @Patch('admin/gallery/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.galleryService.update(id, body); }

  @Post('admin/gallery/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  publish(@Param('id') id: string) { return this.galleryService.publish(id); }

  @Delete('admin/gallery/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.galleryService.remove(id); }

  @Post('admin/gallery/:id/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  addItem(@Param('id') id: string, @Body() body: { mediaId: string; sortOrder?: number }) {
    return this.galleryService.addItem(id, body.mediaId, body.sortOrder);
  }

  @Delete('admin/gallery/items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  removeItem(@Param('itemId') itemId: string) { return this.galleryService.removeItem(itemId); }

  @Post('admin/gallery/:id/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  reorder(@Param('id') id: string, @Body() body: { orderedIds: string[] }) {
    return this.galleryService.reorderItems(id, body.orderedIds);
  }
}
import { Controller, Get, Post, Delete, Param, UseGuards, Body } from '@nestjs/common';
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
  findAllAdmin() { return this.galleryService.findAllAdmin(); }

  @Post('admin/gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  create(@Body() body: { title: string; description?: string }, @CurrentUser() user: any) {
    return this.galleryService.create({ ...body, authorId: user.sub });
  }

  @Delete('admin/gallery/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.galleryService.remove(id); }
}

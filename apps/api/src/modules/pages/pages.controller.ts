import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pages')
@Controller()
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get('pages/:slug')
  findBySlug(@Param('slug') slug: string) { return this.pagesService.findBySlugPublic(slug); }

  @Get('admin/pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findAllAdmin() { return this.pagesService.findAllAdmin(); }

  @Get('admin/pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findById(@Param('id') id: string) { return this.pagesService.findById(id); }

  @Post('admin/pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() body: { title: string; body?: any }, @CurrentUser() user: any) {
    return this.pagesService.create({ ...body, authorId: user.sub });
  }

  @Patch('admin/pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.pagesService.update(id, body); }

  @Delete('admin/pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.pagesService.remove(id); }
}

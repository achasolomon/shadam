import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Articles')
@Controller()
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get('articles')
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.articlesService.findAllPublic({ page, limit, category });
  }

  @Get('articles/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlugPublic(slug);
  }

  @Get('admin/articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  findAllAdmin(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.articlesService.findAllAdmin({ page, limit, status });
  }

  @Get('admin/articles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @Post('admin/articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: any) {
    return this.articlesService.create(dto, user.sub);
  }

  @Patch('admin/articles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Post('admin/articles/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @ApiBearerAuth()
  publish(@Param('id') id: string) {
    return this.articlesService.publish(id);
  }

  @Delete('admin/articles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}

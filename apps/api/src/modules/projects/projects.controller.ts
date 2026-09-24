import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // Public endpoints
  @Get('projects')
  @Public()
  @ApiOperation({ summary: 'List published projects' })
  findAllPublic(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
  ) {
    return this.projectsService.findAllPublic({ page, limit, category });
  }

  @Get('projects/:slug')
  @Public()
  @ApiOperation({ summary: 'Get project by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlugPublic(slug);
  }

  // Admin endpoints
  @Get('admin/projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all projects (admin)' })
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.projectsService.findAllAdmin({ page, limit, status });
  }

  @Get('admin/projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID (admin)' })
  findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Post('admin/projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('projects')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project' })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(dto, user.sub);
  }

  @Patch('admin/projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('projects')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Post('admin/projects/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Editor')
  @Permissions('publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish project' })
  publish(@Param('id') id: string) {
    return this.projectsService.publish(id);
  }

  @Post('admin/projects/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('projects')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive project' })
  archive(@Param('id') id: string) {
    return this.projectsService.archive(id);
  }

  @Delete('admin/projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('projects')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}

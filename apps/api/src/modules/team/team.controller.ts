import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Team')
@Controller()
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('team')
  findAllPublic() { return this.teamService.findAllPublic(); }

  @Get('team/:slug')
  findBySlug(@Param('slug') slug: string) { return this.teamService.findBySlugPublic(slug); }

  @Get('admin/team')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findAllAdmin() { return this.teamService.findAllAdmin(); }

  @Get('admin/team/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findById(@Param('id') id: string) { return this.teamService.findById(id); }

  @Post('admin/team')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  create(@Body() body: any) { return this.teamService.create(body); }

  @Patch('admin/team/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.teamService.update(id, body); }

  @Delete('admin/team/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.teamService.remove(id); }

  @Post('admin/team/:id/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  addItem(@Param('id') id: string, @Body() body: any) { return this.teamService.addItem(id, body); }

  @Patch('admin/team/items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  updateItem(@Param('itemId') itemId: string, @Body() body: any) {
    return this.teamService.updateItem(itemId, body);
  }

  @Delete('admin/team/items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  removeItem(@Param('itemId') itemId: string) { return this.teamService.removeItem(itemId); }
}

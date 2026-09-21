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

  @Get('admin/team')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @ApiBearerAuth()
  findAllAdmin() { return this.teamService.findAllAdmin(); }

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
}

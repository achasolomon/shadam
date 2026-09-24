import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Homepage')
@Controller()
export class HomepageController {
  constructor(private homepageService: HomepageService) {}

  @Get('homepage')
  @Public()
  getSections() { return this.homepageService.getSections(); }

  @Get('admin/homepage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAllAdmin() { return this.homepageService.findAllAdmin(); }

  @Patch('admin/homepage/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('pages')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.homepageService.update(id, body); }
}

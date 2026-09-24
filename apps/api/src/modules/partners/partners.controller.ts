import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/create-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Partners')
@Controller()
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get('partners')
  @Public()
  @ApiOperation({ summary: 'List published partners' })
  findAllPublic(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.partnersService.findAllPublic({ page, limit, category });
  }

  @Get('admin/partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all partners (admin)' })
  findAllAdmin() {
    return this.partnersService.findAllAdmin();
  }

  @Get('admin/partners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.partnersService.findById(id);
  }

  @Post('admin/partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('partners')
  @ApiBearerAuth()
  create(@Body() dto: CreatePartnerDto) {
    return this.partnersService.create(dto);
  }

  @Patch('admin/partners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('partners')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto) {
    return this.partnersService.update(id, dto);
  }

  @Delete('admin/partners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Content Manager')
  @Permissions('partners')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}

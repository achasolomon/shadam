import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('Super Admin')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List all roles (id/name only)' })
  getRoles() {
    return this.usersService.getRoles();
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return this.usersService.stripSensitive(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create user and send invite email' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createInvited({
      name: dto.name,
      email: dto.email,
      roleId: dto.roleId,
    });
    return this.usersService.stripSensitive(user);
  }

  @Post(':id/resend-invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend invitation email' })
  async resendInvite(@Param('id') id: string) {
    return this.usersService.resendInvite(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.roleId !== undefined) data.roleId = dto.roleId;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.updateRaw(id, data);
    return this.usersService.stripSensitive(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate (soft-delete) user' })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return this.usersService.stripSensitive(user);
  }
}

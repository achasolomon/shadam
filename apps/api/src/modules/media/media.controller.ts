import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get('admin/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager')
  @ApiBearerAuth()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('folder') folder?: string) {
    return this.mediaService.findAll({ page, limit, folder });
  }

  @Get('admin/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.mediaService.findById(id);
  }

  @Post('admin/media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any, @Body() body: { altText?: string; caption?: string; folder?: string }) {
    return this.mediaService.create({
      url: `/uploads/${file.filename}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      type: file.mimetype.startsWith('image') ? 'IMAGE' : file.mimetype.startsWith('video') ? 'VIDEO' : 'DOCUMENT',
      fileSize: file.size,
      uploadedBy: user.sub,
      altText: body.altText,
      caption: body.caption,
      folder: body.folder,
    });
  }

  @Patch('admin/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: { altText?: string; caption?: string; folder?: string }) {
    return this.mediaService.update(id, body);
  }

  @Delete('admin/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}

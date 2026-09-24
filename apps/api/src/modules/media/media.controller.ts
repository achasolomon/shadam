import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const uploadStorage = diskStorage({
  destination: (_req, _file, cb) => {
    try {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      cb(null, UPLOADS_DIR);
    } catch (err) {
      cb(err as Error, UPLOADS_DIR);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base =
      path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'file';
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

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
  @UseInterceptors(FileInterceptor('file', { storage: uploadStorage, limits: { fileSize: 20 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any, @Body() body: { altText?: string; caption?: string; folder?: string }) {
    if (!file) throw new BadRequestException('No file uploaded');
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

import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as path from 'path';
import { MediaService } from './media.service';
import { MediaStorageService } from './media-storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const ALLOWED_UPLOAD_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'application/pdf': ['.pdf'],
};

const BLOCKED_UPLOAD_EXTENSIONS = new Set(['.html', '.htm', '.svg', '.xhtml', '.xml', '.js', '.mjs', '.php', '.phtml', '.sh', '.bat', '.cmd', '.exe', '.dll', '.scr', '.jsp', '.asp', '.aspx']);

function isAllowedUpload(file: { originalname: string; mimetype: string }): boolean {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (!ext || BLOCKED_UPLOAD_EXTENSIONS.has(ext)) return false;
  const allowedExts = ALLOWED_UPLOAD_TYPES[file.mimetype];
  if (!allowedExts) return false;
  return allowedExts.includes(ext);
}

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private storage: MediaStorageService,
  ) {}

  @Get('admin/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('folder') folder?: string) {
    return this.mediaService.findAll({ page, limit, folder });
  }

  @Get('admin/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager', 'Read Only')
  @Permissions('read')
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.mediaService.findById(id);
  }

  @Post('admin/media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager', 'Content Manager')
  @Permissions('media')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!isAllowedUpload(file)) {
          cb(new BadRequestException('Unsupported file type'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() body: { altText?: string; caption?: string; folder?: string },
  ) {
    if (!file || !file.buffer) throw new BadRequestException('No file uploaded');
    if (!isAllowedUpload(file)) throw new BadRequestException('Unsupported file type');

    const stored = await this.storage.upload({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    return this.mediaService.create({
      url: stored.url,
      originalUrl: stored.publicId,
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
  @Permissions('media')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: { altText?: string; caption?: string; folder?: string }) {
    return this.mediaService.update(id, body);
  }

  @Delete('admin/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Media Manager')
  @Permissions('media')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}

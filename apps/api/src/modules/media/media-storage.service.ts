import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export type StorageProvider = 'cloudinary' | 'local';

export interface StoredUpload {
  url: string;
  publicId: string | null;
  provider: StorageProvider;
}

@Injectable()
export class MediaStorageService {
  private readonly logger = new Logger(MediaStorageService.name);
  private readonly cloudinaryConfigured: boolean;
  private readonly folder: string;

  constructor(config: ConfigService) {
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');
    const url = config.get<string>('CLOUDINARY_URL');

    this.folder = config.get<string>('CLOUDINARY_FOLDER') || 'shedam/media';
    this.cloudinaryConfigured = Boolean(url || (cloudName && apiKey && apiSecret));

    if (this.cloudinaryConfigured) {
      if (url) {
        cloudinary.config({ url, secure: true });
      } else {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        });
      }
      this.logger.log('Cloudinary storage enabled');
    } else {
      this.logger.warn('Cloudinary not configured — using local uploads directory');
    }
  }

  get provider(): StorageProvider {
    return this.cloudinaryConfigured ? 'cloudinary' : 'local';
  }

  async upload(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<StoredUpload> {
    if (!this.cloudinaryConfigured) {
      return this.uploadLocal(file);
    }
    return this.uploadCloudinary(file);
  }

  async destroy(publicId: string | null | undefined): Promise<void> {
    if (!publicId || !this.cloudinaryConfigured) return;
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch (err) {
      this.logger.warn(`Cloudinary destroy failed for ${publicId}: ${(err as Error).message}`);
    }
  }

  async destroyLocal(url: string | null | undefined): Promise<void> {
    if (!url || !url.startsWith('/uploads/')) return;
    const filename = path.basename(url);
    if (!filename || filename.includes('..')) return;
    const dest = path.join(UPLOADS_DIR, filename);
    try {
      await fs.promises.unlink(dest);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.warn(`Local destroy failed for ${filename}: ${(err as Error).message}`);
      }
    }
  }

  private async uploadLocal(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<StoredUpload> {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base =
      path
        .basename(file.originalname || 'file', path.extname(file.originalname || 'file'))
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'file';
    const filename = `${Date.now()}-${base}${ext}`;
    const dest = path.join(UPLOADS_DIR, filename);
    await fs.promises.writeFile(dest, file.buffer);
    return { url: `/uploads/${filename}`, publicId: null, provider: 'local' };
  }

  private async uploadCloudinary(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<StoredUpload> {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base =
      path
        .basename(file.originalname || 'file', path.extname(file.originalname || 'file'))
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'file';
    const publicId = `${base}-${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: this.folder,
            public_id: publicId,
            resource_type: this.resourceType(file.mimetype),
            overwrite: false,
            unique_filename: false,
            type: 'upload',
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error || new Error('Cloudinary upload failed'));
              return;
            }
            resolve(uploadResult);
          },
        );
        stream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
      };
    } catch (err) {
      this.logger.error(`Cloudinary upload failed: ${(err as Error).message}`);
      throw new BadRequestException('Cloudinary upload failed');
    }
  }

  private resourceType(mimetype: string): 'image' | 'video' | 'raw' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'raw';
  }
}

import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaStorageService } from './media-storage.service';
import { MediaController } from './media.controller';

@Module({
  providers: [MediaService, MediaStorageService],
  controllers: [MediaController],
  exports: [MediaService, MediaStorageService],
})
export class MediaModule {}

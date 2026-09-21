import { Module } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { HomepageController } from './homepage.controller';

@Module({
  providers: [HomepageService],
  controllers: [HomepageController],
  exports: [HomepageService],
})
export class HomepageModule {}

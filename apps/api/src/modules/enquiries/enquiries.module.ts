import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [EnquiriesService],
  controllers: [EnquiriesController],
  exports: [EnquiriesService],
})
export class EnquiriesModule {}

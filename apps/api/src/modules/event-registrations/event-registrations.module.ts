import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistrationsController } from './event-registrations.controller';

@Module({
  providers: [EventRegistrationsService],
  controllers: [EventRegistrationsController],
  exports: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
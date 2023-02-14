import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventService } from './event.service';

@Module({
  imports: [HttpModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}

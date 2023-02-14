import { PartialType } from '@nestjs/swagger';
import { EventCreateDto } from './event-create.dto';

export class EventUpdateDto extends PartialType(EventCreateDto) {}

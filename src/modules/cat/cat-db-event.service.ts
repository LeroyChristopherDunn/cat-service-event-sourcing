import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityName,
  EventArgs,
  EventSubscriber,
} from '@mikro-orm/core';
import { Cat, SUMMARY_PROJECTION } from './entities/cat.entity';
import { CatService } from './cat.service';
import {
  CAT_CREATED_EVENT_TYPE,
  CAT_DELETED_EVENT_TYPE,
  CAT_EVENT_AGGREGATE,
  CAT_UPDATED_EVENT_TYPE,
} from '../../constants';
import { EventCreateDto } from '../event/dto/event-create.dto';
import { EventService } from '../event/event.service';

@Injectable()
export class CatDbEventService implements EventSubscriber<Cat> {
  constructor(
    private readonly em: EntityManager,
    private readonly catService: CatService,
    private readonly eventService: EventService,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Cat>[] {
    return [Cat];
  }

  async afterCreate(args: EventArgs<Cat>): Promise<void> {
    const cat = await this.getCat(args.entity.id);
    const event = CatCreated(cat);
    await this.eventService.create(event);
  }

  async afterUpdate(args: EventArgs<Cat>): Promise<void> {
    const cat = await this.getCat(args.entity.id);
    const event = CatUpdated(cat);
    await this.eventService.create(event);
  }

  async afterDelete(args: EventArgs<Cat>): Promise<void> {
    const id = args.entity.id;
    const event = CatDeleted(id);
    await this.eventService.create(event);
  }

  private getCat(id: string) {
    return this.catService.find(id, SUMMARY_PROJECTION);
  }
}

export const CatCreated = (cat: Cat): EventCreateDto => ({
  version: 1,
  aggregate: CAT_EVENT_AGGREGATE,
  type: CAT_CREATED_EVENT_TYPE,
  payload: cat,
});
export const CatUpdated = (cat: Cat): EventCreateDto => ({
  version: 1,
  aggregate: CAT_EVENT_AGGREGATE,
  type: CAT_UPDATED_EVENT_TYPE,
  payload: cat,
});
export const CatDeleted = (id: string): EventCreateDto => ({
  version: 1,
  aggregate: CAT_EVENT_AGGREGATE,
  type: CAT_DELETED_EVENT_TYPE,
  payload: { id },
});

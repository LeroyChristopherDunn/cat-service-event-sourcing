import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EventService } from '../event/event.service';
import {
  CAT_EVENT_AGGREGATE,
  CAT_CREATED_EVENT_TYPE,
  CAT_DELETED_EVENT_TYPE,
  CAT_UPDATED_EVENT_TYPE,
} from '../../constants';
import { EventSortField } from '../event/dto/event-query.dto';
import { Event } from '../event/dto/event.dto';
import { CatService } from './cat.service';
import { EntityManager, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { Cat } from './entities/cat.entity';
import { CatEventSeedService } from './cat-event-seed.service';

@Injectable()
export class CatEventReplayService implements OnApplicationBootstrap {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly eventService: EventService,
    private readonly catService: CatService,
    private readonly seedService: CatEventSeedService,
  ) {}
  private readonly logger = new Logger(CatEventReplayService.name);

  async onApplicationBootstrap() {
    await this.waitForSeeding();
    await this.replayEvents();
  }

  private async waitForSeeding() {
    this.logger.log(`Event replay waiting for seeding`);
    while (true) {
      if (this.seedService.hasRun) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  @UseRequestContext()
  private async replayEvents() {
    this.logger.log(`Event replay starting`);
    const start = Date.now();

    let page = 0;
    while (true) {
      const events = await this.fetchEvents(page);
      if (events.length === 0) break;
      await this.processEvents(events);
      page++;
    }

    const end = Date.now();
    const timeElapsedSecs = (end - start) / 1000;
    this.logger.log(`Event replay finished. Time elapsed: ${timeElapsedSecs}s`);
  }

  private fetchEvents(page: number): Promise<Event[]> {
    const pageSize = 500;
    return this.eventService
      .findAll({
        aggregate: CAT_EVENT_AGGREGATE,
        offset: page * pageSize,
        limit: pageSize,
        sortField: EventSortField.ID,
        sortAsc: true,
      })
      .then((response) => response.items);
  }

  // Using mikroOrm 'native' mutation methods in transaction is 10x faster than repository methods.
  // Also, using mikroOrm 'native' mutation methods doesn't trigger db events which is great during event replay.
  private async processEvents(events: Event[]) {
    await this.em.begin();
    for (const event of events) {
      if (event.version !== 1) {
        this.logger.warn('Unhandled event type: ', JSON.stringify(event));
        continue;
      }
      switch (event.type) {
        case CAT_CREATED_EVENT_TYPE: {
          await this.em.nativeInsert(Cat, event.payload);
          // this.logger.debug('Processed event: ', JSON.stringify(event));
          break;
        }
        case CAT_UPDATED_EVENT_TYPE: {
          await this.em.nativeUpdate(
            Cat,
            { id: event.payload.id },
            event.payload,
          );
          // this.logger.debug('Processed event: ', JSON.stringify(event));
          break;
        }
        case CAT_DELETED_EVENT_TYPE: {
          await this.em.nativeDelete(Cat, { id: event.payload.id });
          // this.logger.debug('Processed event: ', JSON.stringify(event));
          break;
        }
        default:
          this.logger.warn('Unhandled event type: ', JSON.stringify(event));
      }
    }
    await this.em.commit();
  }
}

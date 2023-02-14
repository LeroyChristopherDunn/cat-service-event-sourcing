import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { NUM_SEED_ITERATIONS } from '../../config';
import { faker } from '@faker-js/faker';
import { EventCreateDto } from '../event/dto/event-create.dto';
import { Cat } from './entities/cat.entity';
import {
  CAT_CREATED_EVENT_TYPE,
  CAT_DELETED_EVENT_TYPE,
  CAT_EVENT_AGGREGATE,
  CAT_UPDATED_EVENT_TYPE,
} from '../../constants';

@Injectable()
export class CatEventSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CatEventSeedService.name);

  private _hasRun = false;

  constructor(private readonly eventService: EventService) {}

  get hasRun(): boolean {
    return this._hasRun;
  }

  async onApplicationBootstrap() {
    if (NUM_SEED_ITERATIONS) await this.seedEventTable(NUM_SEED_ITERATIONS);
    this._hasRun = true;
  }

  async seedEventTable(numIterations: number) {
    this.logger.log('Event seed starting');
    const start = Date.now();

    await this.eventService.healthCheck().catch((healthCheckFailed) => {
      this.logger.error('Event service health check failed', healthCheckFailed);
      throw healthCheckFailed;
    });

    let catIds = [];

    const randomBool = (probability = 0.5) => Math.random() > probability;
    const randomCatId = () => {
      if (catIds.length === 1) return catIds[0];
      const index = Math.round(Math.random() * (catIds.length - 1));
      return catIds[index];
    };

    for (let i = 0; i < numIterations; i++) {
      const shouldCreate = randomBool(0.5);
      if (shouldCreate) {
        const event = this.createCreateEvent();
        await this.eventService.create(event);
        catIds.push(event.payload.id);
      }

      const shouldUpdate = catIds.length && randomBool(0.75);
      if (shouldUpdate) {
        const event = this.createUpdateEvent(randomCatId());
        await this.eventService.create(event);
      }

      const shouldRemove = catIds.length && randomBool(0.9);
      if (shouldRemove) {
        const event = this.createDeleteEvent(randomCatId());
        await this.eventService.create(event);
        catIds = catIds.filter((id) => id !== event.payload.id);
      }
    }

    const end = Date.now();
    const timeElapsedSecs = (end - start) / 1000;
    this.logger.log(`Event seed finished. Time elapsed: ${timeElapsedSecs}s`);
  }

  private createCreateEvent() {
    const cat = Object.assign(new Cat(), {
      name: faker.name.firstName(),
      age: parseInt(faker.random.numeric(2)),
      colour: faker.color.human(),
      createdDate: new Date(),
      modifiedDate: new Date(),
    });
    const event: EventCreateDto = {
      aggregate: CAT_EVENT_AGGREGATE,
      type: CAT_CREATED_EVENT_TYPE,
      version: 1,
      payload: cat,
    };
    return event;
  }

  private createUpdateEvent(id: string) {
    const cat = Object.assign(new Cat(), {
      id,
      name: faker.name.firstName(),
      age: parseInt(faker.random.numeric(2)),
      colour: faker.color.human(),
      createdDate: new Date(),
      modifiedDate: new Date(),
    });
    const event: EventCreateDto = {
      aggregate: CAT_EVENT_AGGREGATE,
      type: CAT_UPDATED_EVENT_TYPE,
      version: 1,
      payload: cat,
    };
    return event;
  }

  private createDeleteEvent(id: string) {
    const event: EventCreateDto = {
      aggregate: CAT_EVENT_AGGREGATE,
      type: CAT_DELETED_EVENT_TYPE,
      version: 1,
      payload: { id },
    };
    return event;
  }
}

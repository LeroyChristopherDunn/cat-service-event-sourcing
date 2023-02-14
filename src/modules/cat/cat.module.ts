import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cat } from './entities/cat.entity';
import { CatBulkController } from './cat.bulk.controller';
import { CatMapper } from './cat.mapper';
import { EventModule } from '../event/event.module';
import { CatEventSeedService } from './cat-event-seed.service';
import { CatEventReplayService } from './cat-event-replay.service';
import { CatDbEventService } from './cat-db-event.service';

@Module({
  imports: [MikroOrmModule.forFeature([Cat]), EventModule],
  controllers: [CatController, CatBulkController],
  providers: [
    CatService,
    CatMapper,
    CatEventSeedService,
    CatEventReplayService,
    CatDbEventService,
  ],
})
export class CatModule {}

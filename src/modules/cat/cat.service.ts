import { Injectable } from '@nestjs/common';
import { CatCreateDto } from './dto/cat-create.dto';
import { CatUpdateDto } from './dto/cat-update.dto';
import { Cat, CatProjection, DEFAULT_PROJECTION } from './entities/cat.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/knex';
import { CatQueryDto } from './dto/cat-query.dto';
import { MikroOrmEntityService } from '../../mikro-orm-entity.service';
import { CatMapper } from './cat.mapper';

@Injectable()
export class CatService extends MikroOrmEntityService<
  Cat,
  CatCreateDto,
  CatUpdateDto,
  CatQueryDto,
  CatProjection
> {
  constructor(
    mapper: CatMapper,
    @InjectRepository(Cat)
    repository: EntityRepository<Cat>,
  ) {
    super(mapper, repository, DEFAULT_PROJECTION);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Cat } from './entities/cat.entity';
import { EntityRepository } from '@mikro-orm/knex';
import { CatCreateDto } from './dto/cat-create.dto';
import { CatUpdateDto } from './dto/cat-update.dto';
import { CatQueryDto } from './dto/cat-query.dto';
import { FilterQuery } from '@mikro-orm/core';
import { EntityMapper } from '../../mikro-orm-entity.service';

@Injectable()
export class CatMapper
  implements EntityMapper<Cat, CatCreateDto, CatUpdateDto, CatQueryDto>
{
  constructor(
    @InjectRepository(Cat)
    private readonly repository: EntityRepository<Cat>,
  ) {}

  fromCreateDto(dto: CatCreateDto): Cat {
    return this.entityFromDto(dto);
  }

  async fromUpdateDto(id: string, dto: CatUpdateDto): Promise<Cat | null> {
    const cat = await this.repository.findOne(
      { id },
      { disableIdentityMap: true, refresh: true },
    );
    if (!cat) return cat;
    const mappedDto = this.entityFromDto(dto);
    return this.repository.assign(cat, mappedDto);
  }

  entityFromDto(dto: CatCreateDto | CatUpdateDto) {
    return Object.assign(new Cat(), dto);
  }

  filtersFromQueryDto(query: CatQueryDto) {
    const idsIn: FilterQuery<Cat> = query.ids?.length && {
      id: { $in: query.ids },
    };
    const nameLike: FilterQuery<Cat> = query.nameLike && {
      name: { $like: '%' + query.nameLike + '%' },
    };
    const createdBefore: FilterQuery<Cat> = query.createdBefore && {
      createdDate: { $lt: query.createdBefore },
    };
    const createdAfter: FilterQuery<Cat> = query.createdAfter && {
      createdDate: { $gte: query.createdAfter },
    };
    const modifiedBefore: FilterQuery<Cat> = query.modifiedBefore && {
      modifiedDate: { $lt: query.modifiedBefore },
    };
    const modifiedAfter: FilterQuery<Cat> = query.modifiedAfter && {
      modifiedDate: { $gte: query.modifiedAfter },
    };
    return [
      idsIn,
      nameLike,
      createdAfter,
      createdBefore,
      modifiedBefore,
      modifiedAfter,
    ].filter((filter) => !!filter);
  }
}

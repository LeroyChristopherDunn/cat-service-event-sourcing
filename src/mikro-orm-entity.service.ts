/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EntityRepository } from '@mikro-orm/knex';
import {
  microOrmPaginationOptions,
  Paginated,
  paginatedResponse,
} from './pagination.utils';
import { FilterQuery } from '@mikro-orm/core';

export interface EntityMapper<Entity, CreateDto, UpdateDto, QueryDto> {
  fromCreateDto(createDto: CreateDto): Entity;
  filtersFromQueryDto(queryDto: QueryDto): FilterQuery<Entity>[];
  fromUpdateDto(id, dto: UpdateDto): Promise<Entity | null>;
}

export interface EntityOrphanRemover<UpdateDto> {
  removeOrphanSubEntitiesOnUpdate(id: any, dto: UpdateDto): Promise<void>;
}

interface IDClass {
  id: any;
}

export abstract class MikroOrmEntityService<
  Entity extends IDClass,
  CreateDto,
  UpdateDto,
  QueryDto,
  Projection,
> {
  protected constructor(
    private readonly mapper: EntityMapper<
      Entity,
      CreateDto,
      UpdateDto,
      QueryDto
    >,
    protected readonly repository: EntityRepository<Entity>,
    protected readonly defaultProjection: Projection[] = [],
    protected readonly orphanRemover?: EntityOrphanRemover<UpdateDto>,
  ) {}

  async create(dto: CreateDto): Promise<Entity> {
    const entity = await this.mapper.fromCreateDto(dto);
    await this.repository.persistAndFlush(entity);
    return this.find(entity.id);
  }

  async createAll(dtos: CreateDto[]) {
    const entities = dtos.map((dto) => this.mapper.fromCreateDto(dto));
    return this.repository.persistAndFlush(entities);
  }

  async find(
    id: any,
    projections: Projection[] = this.defaultProjection,
  ): Promise<Entity | null> {
    return this.repository.findOne(
      // @ts-ignore
      { id },
      { populate: projections, refresh: true },
    );
  }

  async findAll(
    query: QueryDto,
    projections: Projection[] = this.defaultProjection,
  ): Promise<Paginated<Entity>> {
    const filters = this.mapper.filtersFromQueryDto(query);
    const [items, totalNumItems] = await this.repository.findAndCount(
      // @ts-ignore
      { $and: filters },
      {
        ...microOrmPaginationOptions(query),
        populate: projections,
      },
    );
    return paginatedResponse(items, totalNumItems, query);
  }

  async update(id: any, dto: UpdateDto): Promise<Entity | null> {
    const entity = await this.mapper.fromUpdateDto(id, dto);
    if (!entity) return entity;
    await this.orphanRemover?.removeOrphanSubEntitiesOnUpdate(id, dto);
    await this.repository.persistAndFlush(entity);
    return this.find(entity.id);
  }

  async updateAll(dtos: (UpdateDto & { id: any })[]) {
    const videos = await Promise.all(
      dtos.map(async (dto) => {
        await this.orphanRemover?.removeOrphanSubEntitiesOnUpdate(dto.id, dto);
        return this.mapper.fromUpdateDto(dto.id, dto);
      }),
    );
    return this.repository.persistAndFlush(videos);
  }

  async remove(id: any): Promise<number> {
    const entity = await this.find(id);
    if (!entity) return 0;
    return this.repository.removeAndFlush(entity).then(() => 1);
  }

  async removeAll(query: QueryDto): Promise<number> {
    const entities = (await this.findAll(query)).items;
    entities.forEach((video) => this.repository.remove(video));
    return this.repository.flush().then(() => entities.length);
  }

  async upsert(dto: CreateDto & { id: any }): Promise<Entity> {
    const entity = await this.find(dto.id);
    if (!entity) return this.create(dto);
    // @ts-ignore
    return this.update(dto.id, dto);
  }

  async upsertAll(dtos: (CreateDto & { id: any })[]) {
    for (const dto of dtos) {
      await this.upsert(dto);
    }
  }
}

import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../pagination.utils';
import { QueryArrayTransform } from '../../../validation.utils';

// noinspection JSUnusedGlobalSymbols
export enum EventSortField {
  ID = 'id',
  CREATED_DATE = 'createdDate',
  AGGREGATE = 'aggregate',
  TYPE = 'type',
}

export class EventQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @IsEnum(EventSortField)
  sortField?: EventSortField;

  @IsArray()
  @Transform(({ value }) => QueryArrayTransform(value))
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  ids?: number[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  aggregate?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  typeLike?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdBefore?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAfter?: Date;
}

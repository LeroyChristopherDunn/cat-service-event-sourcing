import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '../../../pagination.utils';
import { Transform, Type } from 'class-transformer';
import { QueryArrayTransform } from '../../../validation.utils';

export enum CatSortField {
  ID = 'id',
  NAME = 'name',
  AGE = 'age',
  COLOUR = 'colour',
  CREATED_DATE = 'createdDate',
  MODIFIED_DATE = 'modifiedDate',
}

export class CatQueryDto extends PaginationQueryDto {
  @IsArray()
  @Transform(({ value }) => QueryArrayTransform(value))
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  ids?: string[];

  @IsString()
  @IsOptional()
  @IsEnum(CatSortField)
  sortField?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nameLike?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdBefore?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAfter?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  modifiedBefore?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  modifiedAfter?: Date;
}

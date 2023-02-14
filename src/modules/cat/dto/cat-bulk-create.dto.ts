import { CatCreateDto } from './cat-create.dto';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CatBulkCreateDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => CatCreateDto)
  cats: CatCreateDto[];
}

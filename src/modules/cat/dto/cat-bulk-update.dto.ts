import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CatUpdateDto } from './cat-update.dto';
import { Type } from 'class-transformer';

export class CatIdUpdateDto extends CatUpdateDto {
  @IsString()
  id: string;
}

export class CatBulkUpdateDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => CatIdUpdateDto)
  cats: CatIdUpdateDto[];
}

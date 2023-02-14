import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CatBulkDeleteDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ids: string[];
}

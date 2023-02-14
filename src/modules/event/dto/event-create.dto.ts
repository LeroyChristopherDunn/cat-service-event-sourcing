import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class EventCreateDto {
  @IsInt()
  @IsPositive()
  version: number;

  @IsString()
  @IsNotEmpty()
  aggregate: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  payload: any;
}

import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CatCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  age: number;

  @IsString()
  @IsNotEmpty()
  colour: string;
}

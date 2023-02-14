import { CatCreateDto } from './cat-create.dto';
import { PartialType } from '@nestjs/swagger';

export class CatUpdateDto extends PartialType(CatCreateDto) {}

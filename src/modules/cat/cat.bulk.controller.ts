import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatBulkUpdateDto } from './dto/cat-bulk-update.dto';
import { CatBulkDeleteDto } from './dto/cat-bulk-delete.dto';
import { CatBulkCreateDto } from './dto/cat-bulk-create.dto';

@ApiBearerAuth()
@ApiTags('Cat')
@Controller('CatBulk')
export class CatBulkController {
  constructor(private readonly catService: CatService) {}

  @Post()
  createAll(@Body() catBulkCreateDto: CatBulkCreateDto) {
    return this.catService.createAll(catBulkCreateDto.cats);
  }

  @Patch()
  async updateAll(@Body() catBulkUpdateDto: CatBulkUpdateDto) {
    await this.validateUpdateDto(catBulkUpdateDto);
    return this.catService.updateAll(catBulkUpdateDto.cats);
  }

  private async validateUpdateDto(catBulkUpdateDto: CatBulkUpdateDto) {
    const ids = catBulkUpdateDto.cats.map((dto) => dto.id);
    const cats = await this.catService.findAll({ ids });

    if (ids.length > cats.items.length) {
      const foundIds = cats.items.map((cat) => cat.id);
      const notFoundIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        'Cat entities not found with ids: ' + notFoundIds,
      );
    }
  }

  @Delete()
  removeAll(@Query() query: CatBulkDeleteDto) {
    return this.catService.removeAll(query);
  }
}

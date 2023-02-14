import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CatCreateDto } from './dto/cat-create.dto';
import { CatUpdateDto } from './dto/cat-update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatQueryDto } from './dto/cat-query.dto';

@ApiBearerAuth()
@ApiTags('Cat')
@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  create(@Body() createCatDto: CatCreateDto) {
    return this.catService.create(createCatDto);
  }

  @Get()
  findAll(@Query() query: CatQueryDto) {
    return this.catService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cat = await this.catService.find(id);
    if (!cat) throw new NotFoundException();
    return cat;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: CatUpdateDto) {
    const cat = await this.catService.update(id, updateCatDto);
    if (!cat) throw new NotFoundException();
    return cat;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(id);
  }
}

import {
  Version,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto, UpdateFieldDto } from './dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { VALID_ROLES } from '@/auth/enums';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Auth(VALID_ROLES.ADMIN)
@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @Version('1')
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get()
  @Version('1')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.fieldsService.findAll(paginationDto);
  }

  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findById(id);
  }

  @Patch(':id')
  @Version('1')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(id, updateFieldDto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fieldsService.remove(id);
  }
}

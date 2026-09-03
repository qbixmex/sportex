import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Version,
  Query,
} from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { VALID_ROLES } from '@/auth/enums';

@Auth(VALID_ROLES.ADMIN)
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Version('1')
  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.coachesService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.coachesService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coachesService.remove(id);
  }
}

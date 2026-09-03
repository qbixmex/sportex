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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { VALID_ROLES } from '@/auth/enums';

@Auth(VALID_ROLES.ADMIN)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Version('1')
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.teamsService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findByBy(@Param('id') id: string) {
    return this.teamsService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.remove(id);
  }
}
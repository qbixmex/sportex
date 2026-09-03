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
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { VALID_ROLES } from '@/auth/enums';

@Auth(VALID_ROLES.ADMIN)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Version('1')
  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playersService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.playersService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.playersService.remove(id);
  }
}

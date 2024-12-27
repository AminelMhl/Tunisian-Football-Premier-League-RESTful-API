import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: 'Shows all players' })
  getAllPlayers() {
    return this.playersService.getAllPlayers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Shows a specific player' })
  findOne(@Param('id') id: string) {
    return this.playersService.getPlayer(Number(id));
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayersService } from './players.service';
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

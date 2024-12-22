import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  getAllPlaers() {
    return this.playersService.getAllPlayers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.getPlayer(Number(id));
  }
}

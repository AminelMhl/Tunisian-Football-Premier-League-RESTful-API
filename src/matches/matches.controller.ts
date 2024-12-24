import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @Get(':id')
  getMatch(@Param('id') id: string) {
    return this.matchesService.getMatch(Number(id));
  }

  @Get('team/:id')
  getTeamMatches(@Param('id') id: string) {
    return this.matchesService.getTeamMatches(Number(id));
  }

  @Get('date/:date')
  getMatchByDate(@Param('date') date: string) {
    return this.matchesService.getMatchByDate(new Date(date));
  }
}

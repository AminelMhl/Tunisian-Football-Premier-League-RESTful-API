import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Shows all matches' })
  async getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Shows a specific match' })
  async getMatch(@Param('id') id: string) {
    return this.matchesService.getMatch(Number(id));
  }

  @Get('team/:id')
  @ApiOperation({ summary: 'Shows all matches of a team' })
  async getTeamMatches(@Param('id') id: string) {
    return this.matchesService.getTeamMatches(Number(id));
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Shows all matches on a specific date' })
  async getMatchByDate(@Param('date') date: string) {
    return this.matchesService.getMatchByDate(new Date(date));
  }
}
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  @ApiOperation({ summary: 'Shows standings table' })
  getStandings() {
    return this.standingsService.getStandings();
  }

}

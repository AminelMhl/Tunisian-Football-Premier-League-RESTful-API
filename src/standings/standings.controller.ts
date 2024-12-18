import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Post()
  create(@Body() createStandingDto: CreateStandingDto) {
    return this.standingsService.create(createStandingDto);
  }

  @Get()
  findAll() {
    return this.standingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStandingDto: UpdateStandingDto) {
    return this.standingsService.update(+id, updateStandingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.standingsService.remove(+id);
  }
}

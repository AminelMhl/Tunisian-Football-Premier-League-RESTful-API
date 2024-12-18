import { Module } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { StandingsController } from './standings.controller';

@Module({
  controllers: [StandingsController],
  providers: [StandingsService],
})
export class StandingsModule {}

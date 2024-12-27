import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { FantasyService } from 'src/fantasy/fantasy.service';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, FantasyService],
})
export class MatchesModule {}

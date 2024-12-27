import { Module } from '@nestjs/common';
import { FantasyService } from './fantasy.service';
import { FantasyController } from './fantasy.controller';

@Module({
  controllers: [FantasyController],
  providers: [FantasyService],
})
export class FantasyModule {}

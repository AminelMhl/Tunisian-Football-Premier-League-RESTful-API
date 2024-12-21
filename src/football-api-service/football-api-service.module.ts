import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { FootballApiServiceService } from './football-api-service.service';
import { FootballApiServiceController } from './football-api-service.controller';

@Module({
  imports: [HttpModule], 
  controllers: [FootballApiServiceController],
  providers: [FootballApiServiceService],
})
export class FootballApiServiceModule {}
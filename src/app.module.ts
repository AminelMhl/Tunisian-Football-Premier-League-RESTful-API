import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { StandingsModule } from './standings/standings.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MatchesModule } from './matches/matches.module';
import { FootballApiServiceModule } from './football-api-service/football-api-service.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TeamsModule, PlayersModule, StandingsModule, ScheduleModule, MatchesModule, FootballApiServiceModule, ConfigModule.forRoot(), // Ensure ConfigModule is initialized here
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

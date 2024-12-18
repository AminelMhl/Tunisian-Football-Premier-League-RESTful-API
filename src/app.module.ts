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

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TeamsModule, PlayersModule, StandingsModule, ScheduleModule, MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

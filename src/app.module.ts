import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { StandingsModule } from './standings/standings.module';
import { MatchesModule } from './matches/matches.module';
import { FootballApiServiceModule } from './football-api-service/football-api-service.module';
import { ConfigModule } from '@nestjs/config';
import { FantasyModule } from './fantasy/fantasy.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      secret: 'YOUR_JWT_SECRET',
      signOptions: { expiresIn: '60m' },
    }),AuthModule, PrismaModule, UsersModule, TeamsModule, PlayersModule, StandingsModule, MatchesModule, FootballApiServiceModule, ConfigModule.forRoot({
    isGlobal: true, 
  }),
    AuthModule, FantasyModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

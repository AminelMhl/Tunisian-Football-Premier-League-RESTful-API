// filepath: /c:/Users/marut/Documents/My Projects/Tunisian Football Premier League RESTful API/src/football-api-service/football-api-service.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FootballApiServiceService {
  private readonly API_URL = 'https://v3.football.api-sports.io/standings';
  private readonly API_KEY = '8a9b956142c333a86a210ae13533d168';

  constructor(private readonly httpService: HttpService, private readonly prisma: PrismaService) {}

  async fetchStandings(): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.API_URL, {
          headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': this.API_KEY,
          },
          params: {
            league: '202',
            season: '2022',
          },
        }),
      );

      const standings = response.data.response[0].league.standings[0];
      for (const team of standings) {
        const { rank, team: teamInfo, points, all, goalsDiff } = team;
        await this.prisma.team.upsert({
          where: { name: teamInfo.name },
          update: {
            points: points,
            position: rank,
            matchesPlayed: all.played,
            wins: all.win,
            draws: all.draw,
            losses: all.lose,
            goalsFor: all.goals.for,
            goalsAgainst: all.goals.against,
            goalDifference: goalsDiff,
          },
          create: {
            name: teamInfo.name,
            founded: teamInfo.founded || 0, 
            city: teamInfo.city || 'Unknown', 
            points: points,
            position: rank,
            matchesPlayed: all.played,
            wins: all.win,
            draws: all.draw,
            losses: all.lose,
            goalsFor: all.goals.for,
            goalsAgainst: all.goals.against,
            goalDifference: goalsDiff,
          },
        });
      }

      console.log('Team standings updated successfully!');
      return standings;
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  }
}
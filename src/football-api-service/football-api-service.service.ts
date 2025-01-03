// filepath: /c:/Users/marut/Documents/My Projects/Tunisian Football Premier League RESTful API/src/football-api-service/football-api-service.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FootballApiServiceService {
  private readonly API_URL = this.configService.get<string>('API_URL') || '';
  private readonly API_KEY = this.configService.get<string>('API_KEY') || '';

  constructor(private readonly httpService: HttpService, private readonly prisma: PrismaService, private readonly configService: ConfigService) {}
  async updatePlayers(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API_URL}/players`, {
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

      const players = response.data.response;
      for (const player of players) {
        const { player: playerInfo, statistics } = player;
        await this.prisma.player.upsert({
          where: { name: playerInfo.name },
          update: {
            name: playerInfo.name,
            age: playerInfo.age,
            position: statistics[0].games.position,
            nationality: playerInfo.nationality,
            team_id: statistics[0].team.id,
            goals: statistics[0].goals.total,
            assists: statistics[0].goals.assists,
          },
          create: {
            name: playerInfo.name,
            age: playerInfo.age,
            position: statistics[0].games.position,
            nationality: playerInfo.nationality,
            team_id: statistics[0].team.id,
            goals: statistics[0].goals.total,
            assists: statistics[0].goals.assists,
          },
        });
      }

      console.log('Players updated successfully!');
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  async updateMatches(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API_URL}/fixtures`, {
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

      const matches = response.data.response;
      for (const match of matches) {
        const { fixture, teams, goals } = match;
        await this.prisma.match.upsert({
          where: { id: fixture.id },
          update: {
            date: new Date(fixture.date),
            home_team_id: teams.home.id,
            away_team_id: teams.away.id,
            homeGoals: goals.home,
            awayGoals: goals.away,
          },
          create: {
            date: new Date(fixture.date),
            home_team_id: teams.home.id,
            away_team_id: teams.away.id,
            homeGoals: goals.home,
            awayGoals: goals.away,
          },
        });
      }

      console.log('Matches updated successfully!');
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async updateManagers(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API_URL}/coaches`, {
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

      const managers = response.data.response;
      for (const manager of managers) {
        const { coach, team } = manager;
        await this.prisma.manager.upsert({
          where: { name: coach.name },
          update: {
            name: coach.name,
            teamId: team.id,
          },
          create: {
            name: coach.name,
            teamId: team.id,
          },
        });
      }

      console.log('Managers updated successfully!');
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  }

  async fetchStandings(): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API_URL}/standings`, {
          headers: {
            'x-rapidapi-host': 'https://v3.football.api-sports.io/',
            'x-rapidapi-key': 'b2ec46bee870a9f6852b9399402d47f0',
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

    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  }
}
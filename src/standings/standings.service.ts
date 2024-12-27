import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StandingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStandings() {
    const teams = await this.prisma.team.findMany({
      orderBy: {
        position: 'asc',
      },
    });

    // Format the standings
    const formattedStandings = teams.map(team => ({
      position: team.position,
      name: team.name,
      matchesPlayed: team.matchesPlayed,
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalsFor - team.goalsAgainst,
    }));

    return formattedStandings;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FantasyService } from '../fantasy/fantasy.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService, private fantasyService: FantasyService) {}

  async getAllMatches() {
    const matches = await this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    return matches.map(match => ({
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    }));
  }

  async getMatch(id: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: id },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new Error(`Match with id ${id} not found`);
    }

    return {
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    };
  }

  async getTeamMatches(id: number) {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [
          { home_team_id: id },
          { away_team_id: id }
        ]
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (matches.length === 0) {
      throw new Error(`No matches found for team with id ${id}`);
    }

    return matches.map(match => ({
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    }));
  }

  async getMatchByDate(date: Date) {
    const matches = await this.prisma.match.findMany({
      where: {
        date: date
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (matches.length === 0) {
      throw new Error(`No matches found on date ${date}`);
    }

    return matches.map(match => ({
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    }));
  }

  async completeMatch(matchId: number, homeGoals: number, awayGoals: number) {
    // Logic to mark the match as completed and set goals
    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        homeGoals,
        awayGoals,
      },
    });

    // Update points for fantasy teams based on player contributions
    await this.fantasyService.updatePointsAfterMatch(matchId);
  }
}
import { Injectable } from '@nestjs/common'
import { retry } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}
  getAllMatches() {
    return this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });
  }

async getMatch(id: number) {
  const match = await this.prisma.match.findUnique({
    where: { id: id },
    include: {
      homeTeam: true,
      awayTeam: true
    }
  });
  if (!match) {
    throw new Error(`Match with id ${id} not found`);
  }
  return match;
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
  return matches;
}

async getMatchByDate(date: Date) {
  const matches = await this.prisma.match.findMany({
    where: {
      date: date
    }
  });
  if (matches.length === 0) {
    throw new Error(`No matches found on date ${date}`);
  }
  return matches;
}
}

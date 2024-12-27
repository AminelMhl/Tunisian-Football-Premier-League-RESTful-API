import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams() {
    return this.prisma.team.findMany();
  }

  async getTeam(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id: id }
    });
    if (!team) {
      throw new Error(`Team with ID ${id} not found`);
    }
    return team;
  }

  async getTeamPlayers(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id: id }
    });
    if (!team) {
      throw new Error(`Team with ID ${id} not found`);
    }
    return this.prisma.player.findMany({
      where: { team_id: id }
    });
  }
}

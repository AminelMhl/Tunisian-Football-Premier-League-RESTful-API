import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  getAllTeams() {
    return this.prisma.team.findMany();
  }

  getTeam(id: number) {
    return this.prisma.team.findUnique({
      where: { id: id }
    });
  }

  getTeamPlayers(id: number) {
    return this.prisma.team.findUnique({
      where: { id: id }
    }).players();
  }
}

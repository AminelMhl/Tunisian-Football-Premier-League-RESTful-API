import { Injectable } from '@nestjs/common';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StandingsService {
  constructor(private readonly prisma: PrismaService) {}

  getStandings() {
    return this.prisma.team.findMany({
      orderBy: {
        position: 'asc',
      },
    });
  }

}

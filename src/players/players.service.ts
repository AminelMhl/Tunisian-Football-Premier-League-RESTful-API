import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}
  getAllPlayers() {
    return this.prisma.player.findMany();
  }

  getPlayer(id: number) {
    return this.prisma.player.findUnique({
      where: { id: id }
      });
  }
}

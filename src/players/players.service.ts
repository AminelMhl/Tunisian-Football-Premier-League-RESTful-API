import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) { }
  getAllPlayers() {
    return this.prisma.player.findMany();
  }

  async getPlayer(id: number) {
    const player = await this.prisma.player.findUnique({
      where: { id: id }
    });
    if (!player) {
      throw new Error(`Player with ID ${id} not found`);
    }
    return player;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagersService {
  constructor(private prisma: PrismaService) {}
  
  async getAllManagers() {
    return this.prisma.manager.findMany();
  }

  async getManager(id: number) {
    return this.prisma.manager.findUnique({
      where: { id },
    });
  }
}
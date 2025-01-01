import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagersService {
  constructor(private prisma: PrismaService) {}
  
  async getAllManagers() {
    return this.prisma.manager.findMany();
  }

  async getManager(id: number) {
    const manager = await this.prisma.manager.findUnique({
      where: { id },
    });
    if (!manager) {
      throw new NotFoundException(`Manager with id ${id} not found`);
    }
    return manager;
  }
}
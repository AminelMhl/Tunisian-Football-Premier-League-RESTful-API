import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      return []; 
    }
    return users.map(user => {
      const { hash, refreshToken, ...userWithoutSensitiveInfo } = user as { hash?: string, refreshToken?: string };
      return userWithoutSensitiveInfo;
    });
  }

  async updateToAdmin(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id }
      });

      if (!user) {
        return { message: `User  with ID ${id} does not exist.` };
      }

      if (user.role === "ADMIN") {
        return { message: `User  is already an admin.` };
      }

      await this.prisma.user.update({
        where: { id: id },
        data: { role: "ADMIN" }
      });

      return { message: `User  has been updated to admin.` };
    } catch (error) {
      console.error("Error updating user to admin:", error);
      throw error;
    }
  }

  async updateToUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id }
      });

      if (!user) {
        return { message: `Admin  with ID ${id} does not exist.` };
      }

      if (user.role === "USER") {
        return { message: `User  is already an admin.` };
      }

      await this.prisma.user.update({
        where: { id: id },
        data: { role: "USER" }
      });

      return { message: `Admin  has been updated to user.` };
    } catch (error) {
      console.error("Error updating user to user:", error);
      throw error;
    }
  }



  async getUser(id: number){ 
      const user = await this.prisma.user.findUnique({
        where: { id: Number(id) }
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const { hash, refreshToken, ...userWithoutSensitiveInfo } = user;
      return userWithoutSensitiveInfo;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async removeUser(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id: id }
      });
      return `User  with ID ${id} has been deleted successfully.`;
    } catch (error) {
      if (error.code === 'P2025') { // Prisma error code for "Record to delete does not exist."
        return `User  with ID ${id} not found.`;
      }
      throw error; // Re-throw unexpected errors
    }
  }

  
}


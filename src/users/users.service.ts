import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  getAllUsers() {
    return this.prisma.user.findMany({
      where: {
        role: "USER"
      }
    });
  }

  getAllAdmins() {
    return this.prisma.user.findMany({
      where: {
        role: "ADMIN"
      }
    })
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



  async getUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id }
      });
      if (!user) {
        return (`User  with ID ${id} not found`);
      }
      delete user.hash;

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new InternalServerErrorException("An error occurred while fetching the user");
    }
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

  async updateName(id: number, name: string) {
    console.log(`Updating user with ID ${id} to name ${name}`);
    try {
        const user = await this.prisma.user.update({
            where: { id: id },
            data: { name: name } // Directly assign the name string
        });
        console.log(`User  updated: ${JSON.stringify(user)}`);
        return `User  with ID ${id} has been updated successfully.`;
    } catch (error) {
        console.error("Error updating user name:", error);
        if (error.code === 'P2025') {
            return `User  with ID ${id} not found.`;
        }
        throw error;
    }
}
}

import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(Number(id));
  }

  @Get("/admins")
  getAllAdmins() {
    return this.usersService.getAllAdmins();
  }

  @Put(":id")
  updateToAdmin(@Param("id") id: string) {
    return this.usersService.updateToAdmin(Number(id));
  }

  @Put("/admins/:id")
  updateToUser(@Param("id") id: string) {
    return this.usersService.updateToUser(Number(id));
  }

  @Put("/name/:id")
  updateName(@Param('id') id: string, @Body() body: { name: string }) {
    return this.usersService.updateName(Number(id), body.name);
  }

  @Delete(":id")
  deleteUser(@Param('id') id: string) {
    return this.usersService.removeUser(Number(id));
  }
}

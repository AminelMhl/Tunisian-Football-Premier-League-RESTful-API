import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get()
  @ApiOperation({ summary: 'Shows all users' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Shows a specific user' })
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(Number(id));
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates user to admin'})
  @Roles('ADMIN')
  @Put(":id")
  updateToAdmin(@Param("id") id: string) {
    return this.usersService.updateToAdmin(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates admin to user'})
  @Roles('ADMIN')
  @Put("/admins/:id")
  updateToUser(@Param("id") id: string) {
    return this.usersService.updateToUser(Number(id));
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Deletes a user'})
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Delete(":id")
  deleteUser(@Param('id') id: string) {
    return this.usersService.removeUser(Number(id));
  }
}

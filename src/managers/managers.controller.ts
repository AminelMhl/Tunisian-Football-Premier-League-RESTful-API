import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  @ApiOperation({ summary: 'Shows all managers' })
  async getAllManagers() {
    return this.managersService.getAllManagers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Shows a specific manager by Id' })
  async getManager(@Param('id') managerId: string) {
    return this.managersService.getManager(Number(managerId));
  }
}
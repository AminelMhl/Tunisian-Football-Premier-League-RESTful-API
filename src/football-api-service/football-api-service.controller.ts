import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { FootballApiServiceService } from './football-api-service.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@Controller('football-api-service')
export class FootballApiServiceController {
  constructor(private readonly footballApiServiceService: FootballApiServiceService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update standings' })
  @Roles('ADMIN')
  @Patch('/update')
  async updateStandings() {
    await this.footballApiServiceService.fetchStandings();
    return { message: 'Standings updated successfully!' };
  }

}

import { Controller, Post, Body, Req, Get, UseGuards, Delete, Param } from '@nestjs/common';
import { FantasyService } from './fantasy.service';
import { CreateFantasyTeamDto } from './dto/create-fantasy-team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('fantasy')
export class FantasyController {
  constructor(private readonly fantasyService: FantasyService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new fantasy team' })
  @ApiResponse({ status: 201, description: 'Fantasy team created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('teams')
  async createFantasyTeam(@Body() createFantasyTeamDto: CreateFantasyTeamDto, @Req() req) {
    const userId = req.user.userId; // Get the user ID from the request
    return this.fantasyService.createFantasyTeam(createFantasyTeamDto, userId);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the leaderboard' })
  @Get('leaderboard')
  async getLeaderboard() {
    return this.fantasyService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Show your fantasy team' })
  @Get('user/teams') 
  async getUserFantasyTeam(@Req() req) {
      const userId = req.user.userId; 
      return this.fantasyService.getUserFantasyTeam(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a fantasy a user's fantasy team" })
    @ApiBearerAuth()
    @Get('teams/user/:userId') // Endpoint to get a fantasy team by user ID
    async getFantasyTeamByUserId(@Param('userId') userId: string) {
        return this.fantasyService.getFantasyTeamByUserId(Number(userId)); // Convert to number
    }

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a player to your team' })
  @ApiResponse({ status: 201, description: 'Player added to your team successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('teams/players') // Endpoint to add a player
  @ApiBody({ schema: { type: 'object', properties: { playerId: { type: 'number' } } } })
  async addPlayer(@Body() body: { playerId: number }, @Req() req) {
    const userId = req.user.userId; // Get the user ID from the request
    const playerId = body.playerId; // Get playerId from the request body
    return this.fantasyService.addPlayerToFantasyTeam(userId, playerId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a player from your team' })
  @ApiResponse({ status: 201, description: 'Player removed from your team successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete('teams/players/:playerId')
  async removePlayer(@Param('playerId') playerId: string, @Req() req) {
    const userId = req.user.userId;
    return this.fantasyService.removePlayerFromFantasyTeam(userId, Number(playerId));
  }
}
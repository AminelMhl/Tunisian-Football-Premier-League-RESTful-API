import { Controller, Get, Param} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  
  @Get()
  @ApiOperation({ summary: 'Shows all teams'})
  getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Shows a specific team' })
  getTeam(@Param("id") id: string) {
    return this.teamsService.getTeam(Number(id));
  }

  @Get(':id/players')
  @ApiOperation({ summary: 'Shows all players in a team' })
  getTeamPlayers(@Param("id") id: string) {
    return this.teamsService.getTeamPlayers(Number(id));
  }
}

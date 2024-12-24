import { Controller, Get, Param} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  
  @Get()
  getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get(':id')
  getTeam(@Param("id") id: string) {
    return this.teamsService.getTeam(Number(id));
  }

  @Get(':id/players')
  getTeamPlayers(@Param("id") id: string) {
    return this.teamsService.getTeamPlayers(Number(id));
  }
}

import { Controller, Get} from '@nestjs/common';
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
  getTeam(id: number) {
    return this.teamsService.getTeam(id);
  }

  @Get(':id/players')
  getTeamPlayers(id: number) {
    return this.teamsService.getTeamPlayers(id);
  }
}

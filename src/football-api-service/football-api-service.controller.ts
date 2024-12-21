import { Controller, Post } from '@nestjs/common';
import { FootballApiServiceService } from './football-api-service.service';

@Controller('football-api-service')
export class FootballApiServiceController {
  constructor(private readonly footballApiServiceService: FootballApiServiceService) {}

  @Post('/update')
  async updateStandings() {
    await this.footballApiServiceService.updateTeamStandings();
    return { message: 'Standings updated successfully!' };
  }

}

import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            getAllTeams: jest.fn(),
            getTeam: jest.fn(),
            getTeamPlayers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all teams', async () => {
    const result = [{ 
        id: 1, 
        name: 'Team A', 
        founded: 1900, 
        city: 'City A', 
        points: 0, 
        position: 1, 
        matchesPlayed: 0, 
        wins: 0, 
        draws: 0, 
        losses: 0, 
        goalsFor: 0, 
        goalsAgainst: 0, 
        goalDifference: 0 
    }];
    jest.spyOn(service, 'getAllTeams').mockResolvedValue(result);

    expect(await controller.getAllTeams()).toBe(result);
  });

  it('should return a team by ID', async () => {
    const result = { 
        id: 1, 
        name: 'Team A', 
        founded: 1900, 
        city: 'City A', 
        points: 0, 
        position: 1, 
        matchesPlayed: 0, 
        wins: 0, 
        draws: 0, 
        losses: 0, 
        goalsFor: 0, 
        goalsAgainst: 0, 
        goalDifference: 0 
    };
    jest.spyOn(service, 'getTeam').mockResolvedValue(result);

    expect(await controller.getTeam('1')).toBe(result);
  });

  it('should return players of a team', async () => {
    const result = [{ 
        id: 1, 
        name: 'Player A', 
        position: 'Forward', 
        nationality: 'Tunisian', 
        age: 25, 
        team_id: 1, 
        goals: 10, 
        assists: 5 
    }];
    jest.spyOn(service, 'getTeamPlayers').mockResolvedValue(result);

    expect(await controller.getTeamPlayers('1')).toBe(result);
  });
});
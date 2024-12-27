import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: {
            getAllMatches: jest.fn(),
            getMatch: jest.fn(),
            getTeamMatches: jest.fn(),
            getMatchByDate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all matches', async () => {
    const result = [{
      id: 1,
      homeTeam: {
        name: 'Team A',
        id: 1,
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
      },
      awayTeam: {
        name: 'Team B',
        id: 2,
        founded: 1900,
        city: 'City B',
        points: 0,
        position: 2,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      },
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 0,
      awayGoals: 0,
      date: new Date()
    }];
    jest.spyOn(service, 'getAllMatches').mockResolvedValue(result);

    expect(await controller.getAllMatches()).toBe(result);
  });

  it('should return a match by ID', async () => {
    const result = {
      id: 1,
      homeTeam: {
        name: 'Team A',
        id: 1,
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
      },
      awayTeam: {
        name: 'Team B',
        id: 2,
        founded: 1900,
        city: 'City B',
        points: 0,
        position: 2,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      },
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 0,
      awayGoals: 0,
      date: new Date()
    };
    jest.spyOn(service, 'getMatch').mockResolvedValue(result);

    expect(await controller.getMatch('1')).toBe(result);
  });

  it('should return matches for a specific team', async () => {
    const result = [{
      id: 1,
      homeTeam: {
        name: 'Team A',
        id: 1,
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
      },
      awayTeam: {
        name: 'Team B',
        id: 2,
        founded: 1900,
        city: 'City B',
        points: 0,
        position: 2,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      },
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 0,
      awayGoals: 0,
      date: new Date()
    }];
    jest.spyOn(service, 'getTeamMatches').mockResolvedValue(result);

    expect(await controller.getTeamMatches('1')).toBe(result);
  });

  it('should return matches by date', async () => {
    const result = [{ 
      id: 1, 
      home_team_id: 1, 
      away_team_id: 2, 
      homeGoals: 0, 
      awayGoals: 0, 
      date: new Date() 
    }];
    jest.spyOn(service, 'getMatchByDate').mockResolvedValue(result);

    expect(await controller.getMatchByDate('2022-01-01')).toBe(result);
  });
});
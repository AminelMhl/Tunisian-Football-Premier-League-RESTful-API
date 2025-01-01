import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';
import { FantasyService } from '../fantasy/fantasy.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: DeepMockProxy<PrismaClient>;
  let fantasyService: DeepMockProxy<FantasyService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();
    fantasyService = mockDeep<FantasyService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: FantasyService,
          useValue: fantasyService,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all matches', async () => {
    const result = [{
      id: 1,
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 2,
      awayGoals: 1,
      date: new Date(),
      homeTeam: { name: 'Home Team' },
      awayTeam: { name: 'Away Team' },
    }];
    prisma.match.findMany.mockResolvedValue(result);

    expect(await service.getAllMatches()).toEqual(result.map(match => ({
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    })));
  });

  it('should return a match by ID', async () => {
    const result = {
      id: 1,
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 2,
      awayGoals: 1,
      date: new Date(),
      homeTeam: { name: 'Home Team' },
      awayTeam: { name: 'Away Team' },
    };
    prisma.match.findUnique.mockResolvedValue(result);

    expect(await service.getMatch(1)).toEqual({
      result: `${result.homeTeam.name} ${result.homeGoals}-${result.awayGoals} ${result.awayTeam.name}`,
      date: result.date,
    });
  });

  it('should throw an error if match not found', async () => {
    prisma.match.findUnique.mockResolvedValue(null);

    await expect(service.getMatch(1)).rejects.toThrow('Match with id 1 not found');
  });

  it('should return matches for a specific team', async () => {
    const result = [{
      id: 1,
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 2,
      awayGoals: 1,
      date: new Date(),
      homeTeam: { name: 'Home Team' },
      awayTeam: { name: 'Away Team' },
    }];
    prisma.match.findMany.mockResolvedValue(result);

    expect(await service.getTeamMatches(1)).toEqual(result.map(match => ({
      result: `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name}`,
      date: match.date,
    })));
  });

  it('should throw an error if no matches found for a team', async () => {
    prisma.match.findMany.mockResolvedValue([]);

    await expect(service.getTeamMatches(1)).rejects.toThrow('No matches found for team with id 1');
  });
});
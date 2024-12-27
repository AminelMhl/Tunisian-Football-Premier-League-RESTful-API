import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService, PrismaService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all matches', async () => {
    const result = [{ id: 1, home_team_id: 1, away_team_id: 2, homeGoals: 2, awayGoals: 1, date: new Date() }];
    jest.spyOn(prisma.match, 'findMany').mockResolvedValue(result);

    expect(await service.getAllMatches()).toBe(result);
  });

  it('should return a match by ID', async () => {
    const result = { id: 1, home_team_id: 1, away_team_id: 2, homeGoals: 2, awayGoals: 1, date: new Date() };
    jest.spyOn(prisma.match, 'findUnique').mockResolvedValue(result);

    expect(await service.getMatch(1)).toBe(result);
  });

  it('should throw an error if match not found', async () => {
    jest.spyOn(prisma.match, 'findUnique').mockResolvedValue(null);

    await expect(service.getMatch(1)).rejects.toThrow('Match with id 1 not found');
  });

  it('should return matches for a specific team', async () => {
    const result = [{ id: 1, home_team_id: 1, away_team_id: 2, homeGoals: 2, awayGoals: 1, date: new Date() }];
    jest.spyOn(prisma.match, 'findMany').mockResolvedValue(result);

    expect(await service.getTeamMatches(1)).toBe(result);
  });

  it('should throw an error if no matches found for a team', async () => {
    jest.spyOn(prisma.match, 'findMany').mockResolvedValue([]);

    await expect(service.getTeamMatches(1)).rejects.toThrow('No matches found for team with id 1');
  });
});
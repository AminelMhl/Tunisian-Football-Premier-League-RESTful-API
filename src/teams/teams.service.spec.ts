import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService, PrismaService],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    jest.spyOn(prisma.team, 'findMany').mockResolvedValue(result);

    expect(await service.getAllTeams()).toBe(result);
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
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(result);

    expect(await service.getTeam(1)).toBe(result);
  });

  it('should throw an error if team not found', async () => {
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);

    await expect(service.getTeam(1)).rejects.toThrow('Team with ID 1 not found');
  });
});
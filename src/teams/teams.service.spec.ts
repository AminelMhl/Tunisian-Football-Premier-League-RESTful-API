import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma= mockDeep<PrismaService>()
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService, {
        provide: PrismaService,
        useValue: prisma,
      },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
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
    prisma.team.findMany.mockResolvedValue(result);

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
    prisma.team.findUnique.mockResolvedValue(result);

    expect(await service.getTeam(1)).toBe(result);
  });

  it('should throw an error if team not found', async () => {
    prisma.team.findUnique.mockResolvedValue(null);

    await expect(service.getTeam(1)).rejects.toThrow('Team with ID 1 not found');
  });
});
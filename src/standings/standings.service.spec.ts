import { Test, TestingModule } from '@nestjs/testing';
import { StandingsService } from './standings.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('StandingsService', () => {
  let service: StandingsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandingsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<StandingsService>(StandingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return standings', async () => {
    const result = [
      {
        id: 1,
        name: 'Team A',
        city: 'City A',
        founded: 1920,
        points: 30,
        position: 1,
        matchesPlayed: 15,
        wins: 9,
        draws: 3,
        losses: 3,
        goalsFor: 25,
        goalsAgainst: 15,
        goalDifference: 10,
      },
      {
        id: 2,
        name: 'Team B',
        city: 'City B',
        founded: 1925,
        points: 25,
        position: 2,
        matchesPlayed: 15,
        wins: 7,
        draws: 4,
        losses: 4,
        goalsFor: 20,
        goalsAgainst: 18,
        goalDifference: 2,
      },
    ];
    prisma.team.findMany.mockResolvedValue(result);

    const expectedStandings = result.map(team => ({
      position: team.position,
      name: team.name,
      matchesPlayed: team.matchesPlayed,
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalsFor - team.goalsAgainst,
    }));

    expect(await service.getStandings()).toEqual(expectedStandings);
    expect(prisma.team.findMany).toHaveBeenCalledWith({
      orderBy: {
        position: 'asc',
      },
    });
  });
});
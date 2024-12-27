import { Test, TestingModule } from '@nestjs/testing';
import { StandingsService } from './standings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StandingsService', () => {
  let service: StandingsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandingsService,
        {
          provide: PrismaService,
          useValue: {
            team: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StandingsService>(StandingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return standings', async () => {
    const result = [
      { 
        id: 1, 
        name: 'Team A',
        founded: 1920,
        city: 'City A',
        points: 30,
        position: 1,
        matchesPlayed: 15,
        wins: 9,
        draws: 3,
        losses: 3,
        goalsFor: 25,
        goalsAgainst: 15,
        goalDifference: 10
      },
      { 
        id: 2, 
        name: 'Team B',
        founded: 1925,
        city: 'City B', 
        points: 25,
        position: 2,
        matchesPlayed: 15,
        wins: 7,
        draws: 4,
        losses: 4,
        goalsFor: 20,
        goalsAgainst: 18,
        goalDifference: 2
      }
    ];
    jest.spyOn(prisma.team, 'findMany').mockResolvedValue(result);

    expect(await service.getStandings()).toBe(result);
    expect(prisma.team.findMany).toHaveBeenCalledWith({
      orderBy: {
        position: 'asc',
      },
    });
  });
});
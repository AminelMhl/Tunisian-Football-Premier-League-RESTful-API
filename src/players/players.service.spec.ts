import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('PlayersService', () => {
  let service: PlayersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma= mockDeep<PrismaService>()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all players', async () => {
    const result = [
      {
        id: 1,
        name: 'Player A',
        nationality: 'Tunisian',
        age: 25,
        position: 'Forward',
        team_id: 1,
        goals: 10,
        assists: 5
      },
      {
        id: 2,
        name: 'Player B',
        nationality: 'Tunisian',
        age: 28,
        position: 'Midfielder',
        team_id: 1,
        goals: 5,
        assists: 8
      }
    ];
    prisma.player.findMany.mockResolvedValue(result);

    expect(await service.getAllPlayers()).toBe(result);
    expect(prisma.player.findMany).toHaveBeenCalled();
  });

  it('should return a player by ID', async () => {
    const result = {
      id: 1,
      name: 'Player A',
      nationality: 'Tunisian',
      age: 25,
      position: 'Forward',
      team_id: 1,
      goals: 10,
      assists: 5
    };
    prisma.player.findUnique.mockResolvedValue(result);

    expect(await service.getPlayer(1)).toBe(result);
    expect(prisma.player.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if player not found', async () => {
    prisma.player.findUnique.mockResolvedValue(null);

    await expect(service.getPlayer(1)).rejects.toThrow('Player with ID 1 not found');
  });
});
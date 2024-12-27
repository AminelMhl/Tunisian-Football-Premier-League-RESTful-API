import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            getAllPlayers: jest.fn(),
            getPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all players', async () => {
    const result = [{
      id: 1,
      name: 'Player A',
      nationality: 'Tunisian',
      age: 25,
      position: 'Forward',
      team_id: 1,
      goals: 10,
      assists: 5
    }, {
      id: 2,
      name: 'Player B',
      nationality: 'Tunisian',
      age: 28,
      position: 'Midfielder',
      team_id: 1,
      goals: 5,
      assists: 8
    }];
    jest.spyOn(service, 'getAllPlayers').mockResolvedValue(result);

    expect(await controller.getAllPlayers()).toBe(result);
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
    jest.spyOn(service, 'getPlayer').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should throw an error if player not found', async () => {
    jest.spyOn(service, 'getPlayer').mockRejectedValue(new Error('Player with ID 1 not found'));

    await expect(controller.findOne('1')).rejects.toThrow('Player with ID 1 not found');
  });
});
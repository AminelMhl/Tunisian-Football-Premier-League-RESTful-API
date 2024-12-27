import { Test, TestingModule } from '@nestjs/testing';
import { FantasyController } from './fantasy.controller';
import { FantasyService } from './fantasy.service';

describe('FantasyController', () => {
  let controller: FantasyController;
  let service: FantasyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FantasyController],
      providers: [
        {
          provide: FantasyService,
          useValue: {
            createFantasyTeam: jest.fn(),
            getLeaderboard: jest.fn(),
          },
        },
      ],
    }).compile ();

    controller = module.get<FantasyController>(FantasyController);
    service = module.get<FantasyService>(FantasyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a fantasy team', async () => {
    const result = { 
      id: 1, 
      name: 'My Fantasy Team',
      userId: 1,
      totalPoints: 0
    };
    const mockRequest = {
      user: { id: 1 }
    };
    jest.spyOn(service, 'createFantasyTeam').mockResolvedValue(result);

    expect(await controller.createFantasyTeam({
        name: 'My Fantasy Team',
        playerIds: []
    }, mockRequest)).toBe(result);
  });

  it('should return the leaderboard', async () => {
    const result = [{
      id: 1,
      name: 'Team A',
      userId: 1,
      totalPoints: 100,
      user: {
        id: 1,
        name: 'User A'
      }
    }];
    jest.spyOn(service, 'getLeaderboard').mockResolvedValue(result);

    expect(await controller.getLeaderboard()).toBe(result);
  });
});
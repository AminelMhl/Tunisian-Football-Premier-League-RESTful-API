import { Test, TestingModule } from '@nestjs/testing';
import { StandingsController } from './standings.controller';
import { StandingsService } from './standings.service';

describe('StandingsController', () => {
  let controller: StandingsController;
  let service: StandingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandingsController],
      providers: [
        {
          provide: StandingsService,
          useValue: {
            getStandings: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StandingsController>(StandingsController);
    service = module.get<StandingsService>(StandingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return standings', async () => {
    const result = [{
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
    }];
    jest.spyOn(service, 'getStandings').mockResolvedValue(result);

    expect(await controller.getStandings()).toBe(result);
  });
});
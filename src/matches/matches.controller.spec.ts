import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: {
            getAllMatches: jest.fn(),
            getMatch: jest.fn(),
            getTeamMatches: jest.fn(),
            getMatchByDate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all matches', async () => {
    const result = [{
      result: "Team A score - score Team B",
      date: new Date(),
    },
    {
      result: "Team C score - score Team D",
      date: new Date(),
    }];
    jest.spyOn(service, 'getAllMatches').mockResolvedValue(result);

    expect(await controller.getAllMatches()).toBe(result);
  });

  it('should return a match by ID', async () => {
    const result = {
      result:"Team A score - score Team B",
      date: new Date(),
    };
    jest.spyOn(service, 'getMatch').mockResolvedValue(result);

    expect(await controller.getMatch('1')).toBe(result);
  });

  it('should return matches for a specific team', async () => {
    const result =[{
      result: "Team A score - score Team B",
      date: new Date(),
    },
    {
      result: "Team C score - score Team D",
      date: new Date(),
    }];
    jest.spyOn(service, 'getTeamMatches').mockResolvedValue(result);

    expect(await controller.getTeamMatches('1')).toBe(result);
  });

  it('should return matches by date', async () => {
    const result = [{
      result: "Team A score - score Team B",
      date: new Date(),
    },
    {
      result: "Team C score - score Team D",
      date: new Date(),
    }];
    jest.spyOn(service, 'getMatchByDate').mockResolvedValue(result);

    expect(await controller.getMatchByDate('2022-01-01')).toBe(result);
  });
});
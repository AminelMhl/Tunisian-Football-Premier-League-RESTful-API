import { Test, TestingModule } from '@nestjs/testing';
import { FantasyService } from './fantasy.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FantasyService', () => {
  let service: FantasyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FantasyService, PrismaService],
    }).compile();

    service = module.get<FantasyService>(FantasyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a fantasy team', async () => {
    const dto = { name: 'My Fantasy Team', playerIds: [1, 2, 3] };
    const userId = 1;
    jest.spyOn(prisma.player, 'findMany').mockResolvedValue([{
        id: 1,
        name: '',
        nationality: '',
        age: 0,
        position: '',
        team_id: 0,
        goals: 0,
        assists: 0
    }, {
        id: 2,
        name: '',
        nationality: '',
        age: 0,
        position: '',
        team_id: 0,
        goals: 0,
        assists: 0
    }, {
        id: 3,
        name: '',
        nationality: '',
        age: 0,
        position: '',
        team_id: 0,
        goals: 0,
        assists: 0
    }]);
    jest.spyOn(prisma.fantasyTeam, 'create').mockResolvedValue({ id: 1, ...dto, userId, totalPoints: 0 });

    const result = await service.createFantasyTeam(dto, userId);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should throw an error if one or more players do not exist', async () => {
    const dto = { name: 'My Fantasy Team', playerIds: [1, 2, 3] };
    const userId = 1;
    jest.spyOn(prisma.player, 'findMany').mockResolvedValue([{
        id: 1,
        name: '',
        nationality: '',
        age: 0,
        position: '',
        team_id: 0,
        goals: 0,
        assists: 0
    }, {
        id: 2,
        name: '',
        nationality: '',
        age: 0,
        position: '',
        team_id: 0,
        goals: 0,
        assists: 0
    }]); // Missing player 3

    await expect(service.createFantasyTeam(dto, userId)).rejects.toThrow('One or more players do not exist.');
  });

  it('should update points after a match', async () => {
    const matchId = 1;
    const match = {
      id: matchId,
      home_team_id: 1,
      away_team_id: 2,
      homeGoals: 2,
      awayGoals: 1,
      date: new Date(),
    };
    jest.spyOn(prisma.match, 'findUnique').mockResolvedValue(match);
    jest.spyOn(prisma.player, 'findMany').mockResolvedValue([
      {
          id: 1, goals: 1, assists: 1, team_id: 1,
          name: '',
          nationality: '',
          age: 0,
          position: ''
      },
      {
          id: 2, goals: 0, assists: 0, team_id: 2,
          name: '',
          nationality: '',
          age: 0,
          position: ''
      },
    ]);
    jest.spyOn(prisma.fantasyTeam, 'findMany').mockResolvedValue([{ id: 1, name: 'Team A', userId: 1, totalPoints: 4 }]);
    jest.spyOn(prisma.fantasyTeam, 'update').mockResolvedValue({ id: 1, name: 'Team A', userId: 1, totalPoints: 4 });

    await service.updatePointsAfterMatch(matchId);

    expect(prisma.fantasyTeam.update).toHaveBeenCalled();
  });

  it('should throw an error if match not found when updating points', async () => {
    const matchId = 1;
    jest.spyOn(prisma.match, 'findUnique').mockResolvedValue(null);

    await expect(service.updatePointsAfterMatch(matchId)).rejects.toThrow('Match not found.');
  });

  it('should return the leaderboard', async () => {
    const result = [{ id: 1, name: 'Team A', userId: 1, totalPoints: 100 }];
    jest.spyOn(prisma.fantasyTeam, 'findMany').mockResolvedValue(result);

    expect(await service.getLeaderboard()).toBe(result);
  });
});
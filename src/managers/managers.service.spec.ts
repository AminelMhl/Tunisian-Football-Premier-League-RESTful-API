import { Test, TestingModule } from '@nestjs/testing';
import { ManagersService } from './managers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('ManagersService', () => {
  let service: ManagersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagersService,
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

    service = module.get<ManagersService>(ManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all managers', async () => {
    const result = [{ id: 1, name: 'Manager 1', teamId: 1 }];
    prisma.manager.findMany.mockResolvedValue(result);

    expect(await service.getAllManagers()).toBe(result);
  });

  it('should return a manager by ID', async () => {
    const result = { id: 1, name: 'Manager 1', teamId: 1 };
    prisma.manager.findUnique.mockResolvedValue(result);

    expect(await service.getManager(1)).toBe(result);
  });

  it('should throw an error if manager not found', async () => {
    prisma.manager.findUnique.mockResolvedValue(null);

    await expect(service.getManager(1)).rejects.toThrow('Manager with id 1 not found');
  });
});
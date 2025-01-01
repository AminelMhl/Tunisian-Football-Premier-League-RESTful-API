import { Test, TestingModule } from '@nestjs/testing';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ManagersController', () => {
  let controller: ManagersController;
  let service: ManagersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagersController],
      providers: [
        ManagersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    controller = module.get<ManagersController>(ManagersController);
    service = module.get<ManagersService>(ManagersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all managers', async () => {
    const result = [{ id: 1, name: 'Manager 1', teamId: 1 }];
    jest.spyOn(service, 'getAllManagers').mockResolvedValue(result);

    expect(await controller.getAllManagers()).toBe(result);
  });

  it('should return a manager by ID', async () => {
    const result = { id: 1, name: 'Manager 1', teamId: 1 };
    jest.spyOn(service, 'getManager').mockResolvedValue(result);

    expect(await controller.getManager('1')).toBe(result);
  });

  it('should throw an error if manager not found', async () => {
    jest.spyOn(service, 'getManager').mockRejectedValue(new Error('Manager with id 1 not found'));

    await expect(controller.getManager('1')).rejects.toThrow('Manager with id 1 not found');
  });
});
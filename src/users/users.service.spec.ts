import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = [{
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        hash: 'hashedpassword',
        role: 'user'
    }];
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result);

    expect(await service.getAllUsers()).toBe(result);
  });

  it('should return a user by ID', async () => {
    const result = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        hash: 'hashedpassword',
        role: 'user'
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);

    expect(await service.getUser (1)).toBe(result);
  });

  it('should throw an error if user not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.getUser (1)).rejects.toThrow('User  with ID 1 not found');
  });
});
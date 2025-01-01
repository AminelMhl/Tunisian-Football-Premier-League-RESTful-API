import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { hash } from 'crypto';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'user',
        refreshToken: 'someRefreshToken',
        hash: 'hashedpassword',
        verificationToken: 'someVerificationToken',
        isVerified: true,
      },
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'jack.son@example.com',
        name: 'Jack Son',
        role: 'user',
        refreshToken: 'someRefreshToken',
        hash: 'hashedpassword',
        verificationToken: 'someVerificationToken',
        isVerified: false,
      },
    ];
  
    const expectedResult = result.map(user => {
      const { hash, refreshToken, ...userWithoutSensitiveInfo } = user;
      return userWithoutSensitiveInfo;
    });
  
    prisma.user.findMany.mockResolvedValue(result); // Mock the findMany method to return the result
  
    expect(await service.getAllUsers()).toEqual(expectedResult);
  });

  it('should return a user by ID', async () => {
    const result = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'user',
      verificationToken: 'someVerificationToken',
      isVerified: true,
    };
    
  });

  it('should throw an error if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null); // Mock the findUnique method to return null
  
    await expect(service.getUser (1)).rejects.toThrow('User with ID 1 not found');
  });
});
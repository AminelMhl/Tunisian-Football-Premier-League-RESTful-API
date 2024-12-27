import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
    jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');
    jest.spyOn(prisma.user, 'create').mockResolvedValue({ 
      id: 1, 
      name: dto.name,
      email: dto.email,
      hash: 'hashedPassword', 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      role: 'user',
      isVerified: false,
      refreshToken: null,
      verificationToken: 'token123'
    });

    expect(await service.SignUp(dto)).toBe('signed up!');
  });

  it('should throw an error if email is already taken', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
    jest.spyOn(prisma.user, 'create').mockRejectedValue({ code: 'P2002' });

    await expect(service.SignUp(dto)).rejects.toThrow('Credentials taken');
  });

  it('should sign in a user', async () => {
    const dto = { email: 'john@example.com', password: 'password' };
    const user = { 
      id: 1, 
      email: 'john@example.com', 
      hash: 'hashedPassword', 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      name: 'John Doe', 
      role: 'user',
      refreshToken: null,
      isVerified: false,
      verificationToken: 'token123'
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    jest.spyOn(service, 'signToken').mockResolvedValue('token');

    expect(await service.SignIn(dto)).toEqual({ access_token: 'token' });
  });

  it('should throw an error if credentials are incorrect', async () => {
    const dto = { email: 'john@example.com', password: 'wrongPassword' };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.SignIn(dto)).rejects.toThrow('Credentials incorrect');
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  let jwtService: JwtService;

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: prisma
        },
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    })
    .compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(service, 'sendVerificationEmail').mockImplementation(async () => {
      console.log('Mocked email sending');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: dto.name,
      email: dto.email,
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isVerified: false,
      refreshToken: 'refreshToken123',
      verificationToken: 'token123',
    });

    expect(await service.SignUp(dto)).toEqual({
      message: 'User successfully signed up. Please check your email for verification.',
      refreshToken: expect.any(String),
    });
  });

  it('should throw an error if email is already taken', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
    prisma.user.create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`email`)',
      {
        code: 'P2002',
        clientVersion: '2.0.0',
        meta: { target: ['email'] }
      }
    ));

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
      refreshToken: 'refreshToken123',
      isVerified: true,
      verificationToken: 'token123',
    };
    prisma.user.findUnique.mockResolvedValue(user);
    jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    jest.spyOn(service, 'signToken').mockResolvedValue('token');

    expect(await service.SignIn(dto)).toEqual({ access_token: 'token', refresh_token: 'refreshToken123' });
  });

  it('should throw an error if credentials are incorrect', async () => {
    const dto = { email: 'john@example.com', password: 'wrongPassword' };
    const user = {
      id: 1,
      email: 'john@example.com',
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      role: 'user',
      refreshToken: 'refreshToken123',
      isVerified: true,
      verificationToken: 'token123',
    };
    prisma.user.findUnique.mockResolvedValue(user);
    jest.spyOn(argon2, 'verify').mockResolvedValue(false);

    await expect(service.SignIn(dto)).rejects.toThrow('Credentials incorrect');
  });

  it('should throw an error if user is not found', async () => {
    const dto = { email: 'john@example.com', password: 'password' };
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.SignIn(dto)).rejects.toThrow('User not found');
  });

  it('should throw an error if email is not verified', async () => {
    const dto = { email: 'john@example.com', password: 'password' };
    const user = {
      id: 1,
      email: 'john@example.com',
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      role: 'user',
      refreshToken: 'refreshToken123',
      isVerified: false,
      verificationToken: 'token123',
    };
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(service.SignIn(dto)).rejects.toThrow('Email not verified');
  });

  it('should refresh token', async () => {
    const body = { refreshToken: 'refreshToken123' };
    const user = {
      id: 1,
      email: 'john@example.com',
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      role: 'user',
      refreshToken: 'refreshToken123',
      isVerified: true,
      verificationToken: 'token123',
    };
    prisma.user.findUnique.mockResolvedValue(user);
    jest.spyOn(service, 'signToken').mockResolvedValue('newAccessToken');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id, email: user.email, role: user.role });
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('newRefreshToken');

    expect(await service.refreshToken(body)).toEqual({ access_token: 'newAccessToken', refresh_token: 'newRefreshToken' });
  });

  it('should throw an error if refresh token is invalid', async () => {
    const body = { refreshToken: 'invalidRefreshToken' };
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

    await expect(service.refreshToken(body)).rejects.toThrow('Invalid refresh token');
  });

  it('should throw an error if refresh token does not match', async () => {
    const body = { refreshToken: 'refreshToken123' };
    const user = {
      id: 1,
      email: 'john@example.com',
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      role: 'user',
      refreshToken: 'differentRefreshToken',
      isVerified: true,
      verificationToken: 'token123',
    };
    prisma.user.findUnique.mockResolvedValue(user);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id, email: user.email, role: user.role });

    await expect(service.refreshToken(body)).rejects.toThrow('Invalid refresh token');
  });
});